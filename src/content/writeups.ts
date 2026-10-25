// Security writeups. Medium is the home for the full posts; this list keeps the
// site's own pages indexable even when Medium is slow or unreachable.

export interface Writeup {
  title: string;
  platform: "HackTheBox" | "TryHackMe" | "Research";
  level?: string;
  summary: string;
  url: string;
  tags: string[];
}

export const writeups: Writeup[] = [
  {
    title: "MonitorsFour: from web enumeration to Docker escape",
    platform: "HackTheBox",
    summary: "Enumerate a vulnerable web service, pivot into the container, then escape Docker to take the host. Covers recon, foothold, container breakout and the fixes that would have stopped it.",
    url: "https://medium.com/@netanix96/monitorsfour-htb-from-web-enumeration-to-docker-escape-9c280ed5f511",
    tags: ["Web", "Docker", "Privilege escalation"],
  },
  {
    title: "Corridor: an IDOR walkthrough",
    platform: "TryHackMe",
    level: "Easy",
    summary: "Spot the insecure direct object reference pattern hidden in hashed URLs, enumerate it and grab the flag, plus how to design IDs and access checks so this cannot happen.",
    url: "https://medium.com/@netanix96/corridor-tryhackme-room-writeup-easy-56015c978033",
    tags: ["Web", "IDOR", "Access control"],
  },
];
