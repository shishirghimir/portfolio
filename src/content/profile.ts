// Everything about Shishir in one place. Pages, structured data, llms.txt and
// the OG images all read from here, so facts never drift between them.

export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://shishirghimire.info.np").replace(/\/$/, "");
export const absolute = (path = "/") => `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;

export const person = {
  name: "Shishir Ghimire",
  alias: "NetaNix",
  handle: "N3TANIX",
  role: "Cybersecurity student · Founder of Netanix Lab",
  headline: "Cybersecurity student, CTF player and founder of Netanix Lab",
  short:
    "I'm a cybersecurity student from Kathmandu who found his way into tech later than most, got hooked on breaking things and has been grinding ever since: CTFs, boxes, writeups, international finals and Netanix Lab, the company I founded.",
  location: "Kathmandu, Nepal",
  geo: { lat: 27.7172, lng: 85.324 },
  email: "ssishir39@gmail.com",
  founded: "2024",
  motto: "Break it. Fix it. Secure it.",
  photo: "/photos/dusk.webp",
  study: { degree: "BSc (Hons) Ethical Hacking & Cybersecurity", school: "Softwarica College of IT & E-Commerce", uni: "Coventry University, UK", years: "2024 to 2027" },
};

export const links = {
  linkedin: "https://www.linkedin.com/in/shishir-ghimire-2b7934292/",
  github: "https://github.com/shishirghimir",
  tryhackme: "https://tryhackme.com/p/N3TANIX",
  medium: "https://medium.com/@netanix96",
  discord: "https://discord.com/invite/XcFfwgEDjp",
  netanixlab: "https://netanixlab.com",
  netanixctf: "https://netanixctf.com",
  email: "mailto:ssishir39@gmail.com",
};

export const socials = [
  { key: "linkedin", label: "LinkedIn", handle: "Shishir Ghimire", href: links.linkedin },
  { key: "github", label: "GitHub", handle: "@shishirghimir", href: links.github },
  { key: "tryhackme", label: "TryHackMe", handle: "N3TANIX · Top 1%", href: links.tryhackme },
  { key: "medium", label: "Medium", handle: "@netanix96", href: links.medium },
  { key: "discord", label: "Discord", handle: "NetanixCTF server", href: links.discord },
] as const;

export const stats = [
  { value: 1, prefix: "Top ", suffix: "%", label: "TryHackMe worldwide" },
  { value: 236, suffix: "", label: "TryHackMe rooms completed" },
  { value: 500, suffix: "+", label: "Players on the CTF platform I built" },
  { value: 13, suffix: "", label: "Security certifications" },
];

export const roles = ["Cybersecurity student", "CTF player & creator", "Black Hat MEA 2026 finalist", "Founder, Netanix Lab", "Still learning, every day"];

export type AchievementLogo = { src: string; wide?: boolean } | { icon: "tryhackme" };

export interface Achievement {
  slug: string;
  title: string;
  result: string;
  kind: "Competition" | "Ranking" | "Founder" | "Organiser" | "Credentials";
  when: string;
  where: string;
  logo: AchievementLogo;
  summary: string;
  facts: [string, string][];
  featured?: boolean;
  href?: string;
}

export const achievements: Achievement[] = [
  {
    slug: "blackhat-mea-2026",
    title: "Black Hat MEA CTF 2026",
    result: "Finalist",
    kind: "Competition",
    when: "Finals in December 2026",
    where: "Riyadh, Saudi Arabia",
    logo: { src: "/logos/blackhat-white.webp", wide: true },
    summary:
      "Our team fought through the online qualifiers of one of the world's biggest security competitions and earned a place at the in-person finals in Riyadh. We are the only team made up entirely of players from Nepal to qualify, and I am proud to represent the country on that stage.",
    facts: [["Stage", "In-person finals"], ["Team", "All players from Nepal"], ["Status", "Training for the finals"]],
    featured: true,
    href: "https://blackhatmea.com",
  },
  {
    slug: "hackastra-2026",
    title: "HackAstra 2026",
    result: "5th place nationally",
    kind: "Competition",
    when: "May 2026",
    where: "Kathmandu",
    logo: { src: "/logos/hackastra.webp" },
    summary: "A top five finish at one of Nepal's flagship two-phase CTFs, run by the EthicalHCK community, across web exploitation, forensics, cryptography and OSINT.",
    facts: [["Placing", "#5 in Nepal"], ["Format", "Two-phase CTF"], ["Categories", "Web, forensics, crypto, OSINT"]],
  },
  {
    slug: "tryhackme",
    title: "TryHackMe",
    result: "Top 1% worldwide",
    kind: "Ranking",
    when: "Ongoing",
    where: "As N3TANIX",
    logo: { icon: "tryhackme" },
    summary: "Ranked in the global top 1% of millions of learners, built one room at a time: 236 rooms, 32 badges and a global rank of #6,756 at the last update.",
    facts: [["Global rank", "#6,756"], ["Rooms", "236"], ["Badges", "32"]],
    href: "https://tryhackme.com/p/N3TANIX",
  },
  {
    slug: "netanixctf",
    title: "NetanixCTF",
    result: "Built Nepal's own CTF platform",
    kind: "Founder",
    when: "Since 2024",
    where: "netanixctf.com",
    logo: { src: "/logos/netanixctf-logo.webp" },
    summary: "I started NetanixCTF so students in Nepal could practise real security skills at home. I designed the platform and many of its 40+ challenges, and it has grown into a community with 500+ registered players.",
    facts: [["Players", "500+"], ["Certificates", "100+"], ["Challenges", "40+"]],
    href: "https://netanixctf.com",
  },
  {
    slug: "softwarica-24hr-ctf",
    title: "Softwarica 24 Hour CTF",
    result: "Organised and hosted",
    kind: "Organiser",
    when: "2024",
    where: "Softwarica College, Kathmandu",
    logo: { src: "/logos/softwarica-white.webp", wide: true },
    summary: "A full day and night Capture The Flag we ran with Softwarica College on the NetanixCTF platform: 17 teams, live scoring and prizes for the top three.",
    facts: [["Teams", "17"], ["Length", "24 hours"], ["Prizes", "Top three teams"]],
  },
  {
    slug: "certifications",
    title: "13 certifications",
    result: "Offensive and red team paths",
    kind: "Credentials",
    when: "2025",
    where: "TryHackMe, Red Team Leaders, ICM Security",
    logo: { icon: "tryhackme" },
    summary: "Jr Penetration Tester, the CompTIA Pentest+ path, CCEP, CRTDM, log analysis and more, earned alongside study and running a company.",
    facts: [["TryHackMe", "6"], ["Red Team Leaders", "4"], ["ICM Security", "3"]],
  },
];

/** Short list used by structured data, the terminal and llms.txt. */
export const wins = achievements.filter((a) => a.kind !== "Credentials");

export const experience = [
  {
    when: "2024 to now",
    title: "Founder & Chief Executive Officer",
    org: "Netanix Lab",
    where: "Kathmandu",
    logo: "/brand/mark-light.webp",
    body: "Started Netanix Lab and grew it into a registered software company with an eight person team. I set direction, win and lead client work, architect every system we ship and head offensive security. Products include NLab Billing and NetanixCTF; clients include OMH Nepal, IOS Nepal and Base Camp Adventure.",
    tags: ["Leadership", "Architecture", "Client delivery"],
  },
  {
    when: "2025 to now",
    title: "Lead Engineer, retail systems",
    org: "IOS Nepal, BM Mobile Zone, Bhumiraj, IOS Care",
    where: "Kathmandu",
    body: "Led the billing, inventory and repair systems now running these shops every day: barcode billing, IMEI tracking, multi-branch stock, dues, PDF bills and owner-only profit reports.",
    tags: ["Python", "SQLite", "Desktop apps"],
  },
  {
    when: "2024 to now",
    title: "CTF Creator & Security Researcher",
    org: "NetanixCTF · Medium",
    logo: "/logos/netanixctf-logo.webp",
    where: "Online & on campus",
    body: "Design challenges across web, forensics, OSINT and crypto, run tournaments with colleges such as Softwarica, and publish walkthroughs as @netanix96.",
    tags: ["CTF design", "Research", "Community"],
  },
  {
    when: "2024 to 2027",
    title: "BSc (Hons) Ethical Hacking & Cybersecurity",
    org: "Softwarica College · Coventry University",
    logo: "/logos/softwarica-white.webp",
    where: "Kathmandu",
    body: "Offensive security, network defence, digital forensics and operating systems, alongside the lab. Coursework such as the process management benchmarks is on GitHub.",
    tags: ["Degree"],
  },
  {
    when: "2022 to 2024",
    title: "+2 Computer Science",
    org: "NIST, National School of Sciences",
    where: "Kathmandu",
    body: "Foundations in programming, mathematics and computer systems.",
    tags: ["School"],
  },
];

export const skills = [
  { group: "Offensive security", items: ["Web exploitation", "Penetration testing", "Active Directory", "OSINT & recon", "Burp Suite", "Nmap", "Metasploit"] },
  { group: "Defence & forensics", items: ["Memory forensics", "Volatility 3", "Log analysis", "Packet filtering", "Wireshark", "Secure code review"] },
  { group: "Engineering", items: ["Python", "C", "TypeScript", "React", "Next.js", "Node.js", "PostgreSQL", "Prisma", "Docker", "Linux"] },
  { group: "Leadership", items: ["Product strategy", "System architecture", "Team leadership", "Client delivery", "CTF & event operations"] },
];

/** Tools with their real logos: `svg` files live in /public/tech, `si` names are Simple Icons. */
export type Tool = { name: string; svg?: string; si?: string; invert?: boolean };
export const toolbox: { group: string; blurb: string; tools: Tool[] }[] = [
  {
    group: "Offensive security",
    blurb: "Recon, web exploitation and network attacks, the way real adversaries work.",
    tools: [
      { name: "Kali Linux", svg: "kalilinux" }, { name: "Burp Suite", svg: "burpsuite" }, { name: "Metasploit", si: "SiMetasploit" },
      { name: "Wireshark", svg: "wireshark" }, { name: "OWASP Top 10", si: "SiOwasp" }, { name: "Hack The Box", si: "SiHackthebox" }, { name: "TryHackMe", si: "SiTryhackme" },
    ],
  },
  {
    group: "Defence & forensics",
    blurb: "Memory forensics, packet analysis and hardening what we ship.",
    tools: [
      { name: "Linux", svg: "linux" }, { name: "Bash", si: "SiGnubash" }, { name: "Docker", svg: "docker" }, { name: "Nginx", si: "SiNginx" },
      { name: "Cloudflare", svg: "cloudflare" }, { name: "OpenCV", si: "SiOpencv" }, { name: "Git", svg: "git" },
    ],
  },
  {
    group: "Languages",
    blurb: "From packet filters in C to full products in TypeScript.",
    tools: [
      { name: "Python", svg: "python" }, { name: "C", si: "SiC" }, { name: "TypeScript", svg: "typescript" }, { name: "JavaScript", svg: "javascript" },
      { name: "SQL", svg: "postgresql" }, { name: "HTML5", svg: "html5" }, { name: "CSS", svg: "css3" },
    ],
  },
  {
    group: "Frameworks & platforms",
    blurb: "The stack behind NLab Billing, OMH Nepal and NetanixCTF.",
    tools: [
      { name: "React", svg: "react" }, { name: "Next.js", svg: "nextjs", invert: true }, { name: "Node.js", svg: "nodejs" }, { name: "Express", si: "SiExpress" },
      { name: "FastAPI", svg: "fastapi" }, { name: "PostgreSQL", svg: "postgresql" }, { name: "MySQL", si: "SiMysql" }, { name: "Prisma", svg: "prisma", invert: true },
      { name: "Tailwind CSS", svg: "tailwindcss" }, { name: "Vercel", svg: "vercel", invert: true }, { name: "Railway", si: "SiRailway" },
    ],
  },
];

export const certs = [
  {
    issuer: "TryHackMe",
    logo: "/logos/tryhackme.webp",
    items: ["Jr Penetration Tester", "CompTIA Pentest+ Path", "Cyber Security 101", "Web Fundamentals", "Pre Security", "Advent of Cyber 2025"],
  },
  { issuer: "Red Team Leaders", logo: "/logos/redteamleaders.svg", items: ["Physical Pentest Fundamentals", "Foundations of Log Analysis", "CCEP", "CRTDM"] },
  { issuer: "ICM Security", logo: "", items: ["AI 101 Fundamentals", "Practical Security Fundamentals", "Programming 100 Fundamentals"] },
];

export const now = [
  { tag: "Building", title: "NLab Billing in the cloud", body: "Multi-tenant billing, stock and shop websites so many businesses run on one platform, not one PC per shop." },
  { tag: "Leading", title: "Netanix Lab client work", body: "Shipping OMH Nepal's next phase and the Base Camp Adventure rebuild with the team." },
  { tag: "Competing", title: "Black Hat MEA finals prep", body: "Training with the team on harder categories ahead of the Riyadh finals in December." },
  { tag: "Designing", title: "A new NetanixCTF season", body: "Fresh web, forensics and OSINT challenges, plus a smoother experience for first time players." },
  { tag: "Learning", title: "Red team and Active Directory", body: "Windows privilege escalation and AD attack paths, working towards CRTP and OSCP." },
  { tag: "Writing", title: "Walkthroughs on Medium", body: "Box and room breakdowns as @netanix96, documenting what I break and how to fix it." },
];
