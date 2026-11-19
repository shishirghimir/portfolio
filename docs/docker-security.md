# Docker Security: OWASP Docker Top 10

This is how the portfolio container follows the [OWASP Docker Top 10](https://github.com/OWASP/Docker-Security). The focus is **D07 Resource Protection**.

The site is a static Next.js export. It is built in a Node stage and served by an unprivileged nginx container. Each push to `main` deploys it through GitHub Actions on a self-hosted runner. The hardening lives in three files: [`Dockerfile`](../Dockerfile), [`docker-compose.yml`](../docker-compose.yml) and [`nginx.conf`](../nginx.conf).

---

## D07: Resource Protection

### The threat

Without limits, a container can use **all of the host's CPU, memory, processes, file handles and disk**. That can come from a bug, a memory leak, a flood of requests or an attacker inside the container, and it takes down the host and every other container with it. When memory runs out, the Linux **OOM killer** chooses which process to kill by its own score, and that is not always the process that caused the problem.

### What I set and why

| Resource | Setting (compose) | `docker run` equivalent | What it does |
|---|---|---|---|
| Memory (hard) | `mem_limit: 128m` | `--memory=128m` | The container can never use more than 128 MB of RAM. Past that, only processes inside it are OOM-killed, never the host. |
| Swap | `memswap_limit: 128m` | `--memory-swap=128m` | Memory + swap = 128 MB, so **no swap** at all. The container can't avoid the limit by thrashing the disk. |
| Memory (soft) | `mem_reservation: 64m` | `--memory-reservation=64m` | A soft limit. When the host is short on memory, Docker pushes the container back toward 64 MB. |
| OOM priority | `oom_score_adj: -500` | `--oom-score-adj=-500` | Lowers the container's OOM score, so the host kills other processes before the web server. |
| CPU (hard) | `cpus: 0.5` | `--cpus=0.5` | At most half of one CPU core (CFS quota). |
| CPU (relative) | `cpu_shares: 512` | `--cpu-shares=512` | Gets half the default weight (1024) when CPUs are contended. |
| Processes | `pids_limit: 64` | `--pids-limit=64` | At most 64 processes. This stops a fork bomb. |
| File handles | `ulimits: nofile 4096` | `--ulimit nofile=4096:4096` | Caps open files and sockets. |
| Disk (logs) | `max-size: 10m`, `max-file: 3` | `--log-opt max-size=10m --log-opt max-file=3` | Logs can never use more than 30 MB of host disk. |
| Disk (writes) | `read_only: true` + `tmpfs /tmp:size=16m` | `--read-only --tmpfs /tmp:size=16m` | The container can't fill the disk. The only writable place is a 16 MB in-memory `/tmp`. |

**Inside nginx** ([`nginx.conf`](../nginx.conf)), the app is sized to fit those limits:

- `worker_processes 2`: matches the CPU limit. `auto` would read the host's core count and start a worker per core.
- `worker_rlimit_nofile 4096` and `worker_connections 1024`: stay within the `nofile` ulimit.
- `limit_conn perip 100`: one IP can't hold every connection open (network I/O protection). It returns `429`.
- `client_header_timeout`, `client_body_timeout`, `send_timeout 10s`, `keepalive_timeout 15s` and `reset_timedout_connection on`: slow-loris style clients get dropped instead of holding connections and memory.
- `client_max_body_size 16k`, plus only `GET`/`HEAD` allowed: nobody can push large bodies into a static site.

### About `--oom-kill-disable`

The OWASP page suggests `--oom-kill-disable`. It **only works on cgroup v1**. This host runs **cgroup v2** (`docker info` → `Cgroup Version: 2`), where Docker ignores the flag with a warning. Disabling the OOM killer without a memory limit is also dangerous: the host itself could hang. So this setup uses a **hard memory limit + no swap + `oom_score_adj`**, which gives the same protection on modern kernels.

### Demo commands (for the presentation)

**1. Show the limits Docker applied (audit)**

```bash
docker inspect portfolio --format "memory={{.HostConfig.Memory}} swap={{.HostConfig.MemorySwap}} reservation={{.HostConfig.MemoryReservation}} cpus={{.HostConfig.NanoCpus}} shares={{.HostConfig.CpuShares}} pids={{.HostConfig.PidsLimit}} oom_adj={{.HostConfig.OomScoreAdj}}"
docker inspect portfolio --format "{{json .HostConfig.Ulimits}} {{json .HostConfig.LogConfig}}"
```

**2. Live usage against the limit**

```bash
docker stats portfolio
```

The `MEM USAGE / LIMIT` column shows `… / 128MiB`, and `PIDS` shows the live process count.

**3. Read the cgroup files directly (what the kernel enforces)**

On cgroup v2 the files live in the container's own cgroup:

```bash
docker exec portfolio cat /sys/fs/cgroup/memory.max        # 134217728  (128 MB)
docker exec portfolio cat /sys/fs/cgroup/memory.swap.max   # 0          (no swap)
docker exec portfolio cat /sys/fs/cgroup/memory.low        # 67108864   (64 MB reservation)
docker exec portfolio cat /sys/fs/cgroup/cpu.max           # 50000 100000  (0.5 CPU)
docker exec portfolio cat /sys/fs/cgroup/cpu.weight        # weight from cpu_shares 512
docker exec portfolio cat /sys/fs/cgroup/pids.max          # 64
docker exec portfolio cat /sys/fs/cgroup/memory.events     # oom / oom_kill counters
```

On a cgroup v1 host, the same values are in `/sys/fs/cgroup/memory/docker/<container-id>/memory.limit_in_bytes` (the path the OWASP page mentions).

**4. Prove the limits hold (run against a throwaway container, not the live one)**

Memory: the process is killed at the limit, and the host is fine.

```bash
docker run --rm --memory=128m --memory-swap=128m alpine sh -c "tail /dev/zero"
echo $?    # 137 = killed by the OOM killer (SIGKILL)
```

Processes: a fork bomb hits the wall at 64.

```bash
docker run --rm --pids-limit=64 alpine sh -c "for i in \$(seq 1 200); do sleep 60 & done"
# sh: can't fork: Resource temporarily unavailable
```

CPU: a busy loop is held at 50%.

```bash
docker run -d --name cpuburn --cpus=0.5 alpine sh -c "while :; do :; done"
docker stats --no-stream cpuburn    # CPU % stays around 50%
docker rm -f cpuburn
```

Read-only filesystem: writes are refused.

```bash
docker exec portfolio sh -c "echo x > /usr/share/nginx/html/hack.html"
# sh: can't create /usr/share/nginx/html/hack.html: Read-only file system
```

Connection limit: nginx answers `429` once one IP opens more than 100 connections.

**5. Change a limit on a running container (no restart)**

```bash
docker update --memory=256m --memory-swap=256m --cpus=1 portfolio
```

---

## The rest of the Top 10

| # | Control | How it is done here |
|---|---|---|
| **D01** | Secure User Mapping | Runs as `nginx` (uid **101**), not root: `USER 101:101` in the Dockerfile and `user: "101:101"` in compose. nginx listens on **8080**, so it needs no root to bind port 80. Never `--privileged`. |
| **D02** | Patch Management | Base images are pinned by digest and updated through **Dependabot** ([`.github/dependabot.yml`](../.github/dependabot.yml)) for Docker, npm and Actions. `apk upgrade` runs at build, and `build.pull: true` always pulls fresh bases. Every push rebuilds and redeploys. |
| **D03** | Network Segmentation | Own bridge network `web` with inter-container communication **disabled** (`enable_icc=false`). Only port 8080 is published. To expose it only behind a reverse proxy or tunnel, use `127.0.0.1:8080:8080`. |
| **D04** | Secure Defaults & Hardening | `cap_drop: ALL` (no Linux capabilities at all), `no-new-privileges:true` (SUID binaries can't escalate), and Docker's default seccomp and AppArmor profiles stay on. The minimal Alpine image has no shell tools beyond busybox. `server_tokens off` hides the nginx version. |
| **D05** | Security Contexts | One job per container: the build tools (Node, npm, source) stay in the build stage and never reach production. Only static files and nginx ship. The runner host runs only this production container. |
| **D06** | Protect Secrets | The site needs no secrets. `.dockerignore` keeps `.env*`, `*.pem`, `*.key`, `.git` and `node_modules` out of the build context, so nothing secret can end up in an image layer. |
| **D07** | Resource Protection | See above. |
| **D08** | Image Integrity & Origin | Only **official/verified publisher** images (`node`, `nginxinc/nginx-unprivileged`), pinned by **sha256 digest**. A changed or tampered tag can't swap the image. |
| **D09** | Immutable Paradigm | `read_only: true` root filesystem. Site files are owned by root and the server runs as uid 101, so nothing can be changed at runtime. Changes only ship by rebuilding the image through CI. |
| **D10** | Logging | nginx access logs go to stdout and errors to stderr, which `docker logs portfolio` collects. `json-file` rotation (10 MB × 3) keeps logs on disk without filling it. A `HEALTHCHECK` reports health to Docker and to the deploy pipeline. |

### Quick full audit

```bash
docker inspect portfolio --format "user={{.Config.User}} privileged={{.HostConfig.Privileged}} readonly={{.HostConfig.ReadonlyRootfs}} capdrop={{.HostConfig.CapDrop}} secopt={{.HostConfig.SecurityOpt}} network={{.HostConfig.NetworkMode}}"
docker exec portfolio id                     # uid=101(nginx)
docker exec portfolio cat /proc/1/status | grep Cap    # CapEff: 0000000000000000
docker image inspect shishirghimir/portfolio:latest --format "{{.Config.User}}"
docker logs --tail 20 portfolio
```
