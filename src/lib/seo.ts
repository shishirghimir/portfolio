import type { Metadata } from "next";
import { SITE_URL, absolute, achievements, certs, links, person, skills } from "@/content/profile";
import { team } from "@/content/team";
import type { Project } from "@/content/projects";

export const PERSON_ID = `${SITE_URL}/#person`;
export const WEBSITE_ID = `${SITE_URL}/#website`;
export const ORG_ID = "https://netanixlab.com/#organization";

const BRAND = person.name;

type PageMeta = {
  title: string;
  description: string;
  path: string;
  image?: string;
  keywords?: string[];
  type?: "website" | "profile" | "article";
};

/** One place for titles, canonical URLs, Open Graph and Twitter cards. */
export function pageMeta({ title, description, path, image = "/og/default.png", keywords = [], type = "website" }: PageMeta): Metadata {
  const full = title.includes(BRAND) ? title : `${title} | ${BRAND}`;
  const url = absolute(path);
  return {
    title: { absolute: full },
    description,
    keywords: [...keywords, "Shishir Ghimire", "NetaNix", "Netanix Lab"],
    alternates: { canonical: url },
    openGraph: {
      type,
      url,
      title: full,
      description,
      siteName: BRAND,
      locale: "en_US",
      images: [{ url: absolute(image), width: 1200, height: 630, alt: full }],
      ...(type === "profile" ? { firstName: "Shishir", lastName: "Ghimire", username: "netanix" } : {}),
    },
    twitter: { card: "summary_large_image", title: full, description, images: [absolute(image)] },
  };
}

export const graph = (...nodes: unknown[]) => ({ "@context": "https://schema.org", "@graph": nodes.flat() });

export function personSchema() {
  return {
    "@type": "Person",
    "@id": PERSON_ID,
    name: person.name,
    givenName: "Shishir",
    familyName: "Ghimire",
    alternateName: [person.alias, person.handle, "Netanix"],
    url: SITE_URL,
    image: [absolute("/photos/dusk.webp"), absolute("/photos/cyber.webp")],
    email: `mailto:${person.email}`,
    jobTitle: "Cybersecurity Engineer",
    hasOccupation: [
      { "@type": "Occupation", name: "Cybersecurity Engineer", occupationLocation: { "@type": "City", name: "Kathmandu" }, skills: "Penetration testing, CTF design, digital forensics, secure software" },
      { "@type": "Occupation", name: "Founder & CEO", description: "Founder and CEO of Netanix Lab" },
    ],
    description: person.short,
    worksFor: { "@id": ORG_ID },
    founder: { "@id": ORG_ID },
    nationality: { "@type": "Country", name: "Nepal" },
    homeLocation: { "@type": "Place", name: person.location, geo: { "@type": "GeoCoordinates", latitude: person.geo.lat, longitude: person.geo.lng } },
    address: { "@type": "PostalAddress", addressLocality: "Kathmandu", addressCountry: "NP" },
    alumniOf: [
      { "@type": "CollegeOrUniversity", name: person.study.school, sameAs: "https://softwarica.edu.np" },
      { "@type": "CollegeOrUniversity", name: "Coventry University", sameAs: "https://www.coventry.ac.uk" },
    ],
    knowsAbout: skills.flatMap((s) => s.items),
    award: achievements.map((a) => `${a.title}: ${a.result} (${a.when})`),
    hasCredential: certs.flatMap((c) => c.items.map((name) => ({ "@type": "EducationalOccupationalCredential", name, recognizedBy: { "@type": "Organization", name: c.issuer } }))),
    sameAs: [links.linkedin, links.github, links.tryhackme, links.medium, "https://netanixlab.com/team/shishir-ghimire/"],
  };
}

export function orgSchema() {
  return {
    "@type": "Organization",
    "@id": ORG_ID,
    name: "Netanix Lab",
    url: links.netanixlab,
    logo: absolute("/brand/logo-square.png"),
    founder: { "@id": PERSON_ID },
    foundingDate: person.founded,
    address: { "@type": "PostalAddress", addressLocality: "Kathmandu", addressCountry: "NP" },
  };
}

export function websiteSchema() {
  return { "@type": "WebSite", "@id": WEBSITE_ID, url: SITE_URL, name: person.name, alternateName: "Shishir Ghimire portfolio", publisher: { "@id": PERSON_ID }, inLanguage: "en" };
}

export function profilePageSchema(path: string, title: string) {
  return {
    "@type": "ProfilePage",
    "@id": `${absolute(path)}#webpage`,
    url: absolute(path),
    name: title,
    isPartOf: { "@id": WEBSITE_ID },
    mainEntity: { "@id": PERSON_ID },
    dateModified: new Date().toISOString().slice(0, 10),
    primaryImageOfPage: { "@type": "ImageObject", url: absolute("/photos/dusk.webp") },
  };
}

export function webPageSchema(path: string, title: string, description: string, type = "WebPage") {
  return { "@type": type, "@id": `${absolute(path)}#webpage`, url: absolute(path), name: title, description, isPartOf: { "@id": WEBSITE_ID }, about: { "@id": PERSON_ID } };
}

export function breadcrumbSchema(crumbs: { name: string; path: string }[]) {
  return {
    "@type": "BreadcrumbList",
    itemListElement: [{ name: "Home", path: "/" }, ...crumbs].map((c, i) => ({ "@type": "ListItem", position: i + 1, name: c.name, item: absolute(c.path) })),
  };
}

export function projectSchema(p: Project) {
  const isApp = p.kind === "product" || p.kind === "security";
  return {
    "@type": isApp ? "SoftwareApplication" : "CreativeWork",
    "@id": `${absolute(`/work/${p.slug}/`)}#work`,
    name: p.name,
    description: p.summary,
    url: absolute(`/work/${p.slug}/`),
    image: absolute(`/og/work-${p.slug}.png`),
    dateCreated: p.year,
    creator: { "@id": PERSON_ID },
    author: { "@id": PERSON_ID },
    contributor: p.credits.map((c) => ({ "@type": "Person", name: team[c.mate].name, jobTitle: team[c.mate].role, url: team[c.mate].href })),
    ...(p.kind === "product" ? { publisher: { "@id": ORG_ID } } : {}),
    ...(isApp ? { applicationCategory: p.kind === "security" ? "SecurityApplication" : "BusinessApplication", operatingSystem: "Web, Windows, Linux" } : {}),
    keywords: p.stack.join(", "),
  };
}

export function itemListSchema(name: string, items: { name: string; path: string }[]) {
  return { "@type": "ItemList", name, itemListElement: items.map((x, i) => ({ "@type": "ListItem", position: i + 1, name: x.name, url: absolute(x.path) })) };
}
