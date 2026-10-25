// Everything about Shishir in one place. Pages, structured data, llms.txt and
// the OG images all read from here, so facts never drift between them.

export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://shishirghimire.info.np").replace(/\/$/, "");
export const absolute = (path = "/") => `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;

export const person = {
  name: "Shishir Ghimire",
  alias: "NetaNix",
  handle: "N3TANIX",
  role: "Founder & CEO, Netanix Lab",
  headline: "Founder & CEO of Netanix Lab, cybersecurity engineer and CTF creator",
  short:
    "I lead Netanix Lab, the Kathmandu team that builds billing systems, workforce platforms and websites for Nepali businesses, and I founded NetanixCTF, Nepal's Capture The Flag platform. I break software so my team can ship it secure.",
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
  { value: 10, suffix: "+", label: "Production systems shipped" },
  { value: 500, suffix: "+", label: "Players on NetanixCTF" },
  { value: 1, prefix: "Top ", suffix: "%", label: "TryHackMe, worldwide" },
  { value: 13, suffix: "", label: "Security certifications" },
];

export const roles = ["Founder & CEO, Netanix Lab", "Offensive security engineer", "CTF creator", "Full-stack architect"];

export const wins = [
  {
    slug: "blackhat-mea-2026",
    title: "Black Hat MEA CTF 2026",
    result: "Qualified for the finals",
    note: "The only team made up entirely of players from Nepal to qualify for the in-person finals in Riyadh.",
    when: "Finals · December 2026 · Riyadh",
    logo: "/logos/blackhat-mea.webp",
    dark: true,
  },
  {
    slug: "hackastra-2026",
    title: "HackAstra 2026",
    result: "5th place nationally",
    note: "Top five at one of Nepal's flagship two-phase CTFs, across web, forensics, crypto and OSINT.",
    when: "May 2026 · Kathmandu",
    logo: "/logos/hackastra.webp",
    dark: true,
  },
  {
    slug: "tryhackme",
    title: "TryHackMe",
    result: "Top 1% worldwide",
    note: "Ranked in the global top 1% as N3TANIX, with 230+ rooms of hands-on offensive security practice.",
    when: "Ongoing · N3TANIX",
    logo: "tryhackme",
    dark: true,
  },
  {
    slug: "netanixctf",
    title: "NetanixCTF",
    result: "Founded a national platform",
    note: "Built Nepal's own CTF platform: 500+ registered players, 100+ certificates issued and events with colleges.",
    when: "Since 2024 · netanixctf.com",
    logo: "/logos/netanixctf-logo.webp",
    dark: false,
  },
];

export const experience = [
  {
    when: "2024 to now",
    title: "Founder & Chief Executive Officer",
    org: "Netanix Lab",
    where: "Kathmandu",
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
    where: "Online & on campus",
    body: "Design challenges across web, forensics, OSINT and crypto, run tournaments with colleges such as Softwarica, and publish walkthroughs as @netanix96.",
    tags: ["CTF design", "Research", "Community"],
  },
  {
    when: "2024 to 2027",
    title: "BSc (Hons) Ethical Hacking & Cybersecurity",
    org: "Softwarica College · Coventry University",
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

export const certs = [
  {
    issuer: "TryHackMe",
    logo: "tryhackme",
    items: ["Jr Penetration Tester", "CompTIA Pentest+ Path", "Cyber Security 101", "Web Fundamentals", "Pre Security", "Advent of Cyber 2025"],
  },
  { issuer: "Red Team Leaders", logo: "rtl", items: ["Physical Pentest Fundamentals", "Foundations of Log Analysis", "CCEP", "CRTDM"] },
  { issuer: "ICM Security", logo: "icm", items: ["AI 101 Fundamentals", "Practical Security Fundamentals", "Programming 100 Fundamentals"] },
];

export const now = [
  { tag: "Building", title: "NLab Billing in the cloud", body: "Multi-tenant billing, stock and shop websites so many businesses run on one platform, not one PC per shop." },
  { tag: "Leading", title: "Netanix Lab client work", body: "Shipping OMH Nepal's next phase and the Base Camp Adventure rebuild with the team." },
  { tag: "Competing", title: "Black Hat MEA finals prep", body: "Training with the team on harder categories ahead of the Riyadh finals in December." },
  { tag: "Designing", title: "A new NetanixCTF season", body: "Fresh web, forensics and OSINT challenges, plus a smoother experience for first time players." },
  { tag: "Learning", title: "Red team and Active Directory", body: "Windows privilege escalation and AD attack paths, working towards CRTP and OSCP." },
  { tag: "Writing", title: "Walkthroughs on Medium", body: "Box and room breakdowns as @netanix96, documenting what I break and how to fix it." },
];
