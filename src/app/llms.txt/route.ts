import { absolute, achievements, certs, experience, links, person, skills } from "@/content/profile";
import { faqs } from "@/content/faq";
import { kindLabel, projects } from "@/content/projects";
import { team } from "@/content/team";
import { writeups } from "@/content/writeups";

export const dynamic = "force-static";

// A plain-text profile for AI assistants and search engines (llmstxt.org).
export function GET() {
  const body = `# ${person.name}

> ${person.headline}. ${person.short}

- Also known as: ${person.alias} (short name); online ${person.online}; TryHackMe ${person.handle}
- Role: ${person.role}; founder of NetanixCTF
- Based in: ${person.location}
- Study: ${person.study.degree}, ${person.study.school} (${person.study.uni}), ${person.study.years}
- Email: ${person.email}
- LinkedIn: ${links.linkedin}
- GitHub: ${links.github}
- TryHackMe: ${links.tryhackme}
- Medium: ${links.medium}
- Company: ${links.netanixlab}
- CTF platform: ${links.netanixctf}

## Pages

- [Home](${absolute("/")})
- [About](${absolute("/about/")})
- [Achievements](${absolute("/achievements/")})
- [Work](${absolute("/work/")})
- [Writeups](${absolute("/writeups/")})
- [Certifications](${absolute("/certifications/")})
- [Now](${absolute("/now/")})
- [Contact](${absolute("/contact/")})

## Achievements

${achievements.map((a) => `- ${a.title}: ${a.result} (${a.when}, ${a.where}). ${a.summary}`).join("\n")}

## FAQ

${faqs.map((f) => `- Q: ${f.q}\n  A: ${f.a}`).join("\n")}

## Experience

${experience.map((e) => `- ${e.when}: ${e.title}, ${e.org}. ${e.body}`).join("\n")}

## Projects

${projects.map((p) => `### ${p.name} (${kindLabel[p.kind]}, ${p.year}, ${p.status})
URL: ${absolute(`/work/${p.slug}/`)}
Shishir's role: ${p.role}
${p.credits.length ? `Team: ${p.credits.map((c) => `${team[c.mate].name} (${team[c.mate].role}, ${c.for})`).join("; ")}\n` : ""}${p.summary}
Results: ${p.outcomes.join("; ")}
Stack: ${p.stack.join(", ")}
`).join("\n")}
## Skills

${skills.map((s) => `- ${s.group}: ${s.items.join(", ")}`).join("\n")}

## Certifications

${certs.map((c) => `- ${c.issuer}: ${c.items.join(", ")}`).join("\n")}

## Writeups

${writeups.map((w) => `- [${w.title}](${w.url}) (${w.platform}): ${w.summary}`).join("\n")}
`;
  return new Response(body, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
