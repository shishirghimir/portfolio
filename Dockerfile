# Tiny Caddy image (~45 MB) serving the static portfolio.
# Railway auto-detects this Dockerfile and builds it.
FROM caddy:2-alpine

# Validate the Caddyfile at build time so a typo fails the build, not the deploy.
COPY Caddyfile /etc/caddy/Caddyfile
RUN caddy validate --config /etc/caddy/Caddyfile --adapter caddyfile

# Copy the static site
COPY . /srv

# Drop large/unused junk that snuck in
RUN rm -rf /srv/.git /srv/.gitignore /srv/Dockerfile /srv/Caddyfile /srv/README.md /srv/.dockerignore /srv/railway.toml 2>/dev/null || true

EXPOSE 8080

CMD ["caddy", "run", "--config", "/etc/caddy/Caddyfile", "--adapter", "caddyfile"]
