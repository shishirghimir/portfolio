import { PageHead } from "@/components/sections/Blocks";
import { ProjectCard } from "@/components/sections/ProjectCard";
import { WorkGrid } from "@/components/sections/WorkGrid";
import { ContactBand } from "@/components/sections/ContactBand";
import { JsonLd } from "@/components/JsonLd";
import { projects } from "@/content/projects";
import { breadcrumbSchema, graph, itemListSchema, pageMeta, webPageSchema } from "@/lib/seo";

const TITLE = "Work: products, client systems and security tools";
const DESC = "Projects led by Shishir Ghimire at Netanix Lab: NetanixCTF, NLab Billing, OMH Nepal, MemVault, retail POS systems and more, with the team credited on every one.";

export const metadata = pageMeta({ title: TITLE, description: DESC, path: "/work/", image: "/og/work.png", keywords: ["Shishir Ghimire projects", "Netanix Lab projects", "cybersecurity projects Nepal"] });

export default function WorkPage() {
  const cards = Object.fromEntries(projects.map((p, i) => [p.slug, <ProjectCard key={p.slug} p={p} priority={i < 3} />]));
  return (
    <>
      <JsonLd data={graph(webPageSchema("/work/", TITLE, DESC, "CollectionPage"), breadcrumbSchema([{ name: "Work", path: "/work/" }]), itemListSchema("Projects", projects.map((p) => ({ name: p.name, path: `/work/${p.slug}/` }))))} />
      <PageHead kicker="Work" title={<>Led, shipped <span className="text-signal">and secured.</span></>} lead="Products Netanix Lab runs, systems our clients use every day, and the security tools and research I build along the way." crumbs={[{ name: "Work", path: "/work/" }]} />
      <section className="container-x">
        <WorkGrid projects={projects.map(({ slug, kind }) => ({ slug, kind }))} cards={cards} />
      </section>
      <ContactBand />
    </>
  );
}
