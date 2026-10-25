import type { MetadataRoute } from "next";
import { absolute } from "@/content/profile";
import { projects } from "@/content/projects";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const page = (path: string, priority: number, images: string[] = []) => ({
    url: absolute(path),
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority,
    ...(images.length ? { images: images.map((i) => absolute(i)) } : {}),
  });
  return [
    page("/", 1, ["/og/default.png", "/photos/dusk.webp", "/photos/cyber.webp", "/brand/logo-square.png"]),
    page("/about/", 0.9, ["/og/about.png", "/photos/nagarkot.webp", "/photos/kurintar.webp"]),
    page("/work/", 0.9, ["/og/work.png"]),
    ...projects.map((p) => page(`/work/${p.slug}/`, p.featured ? 0.8 : 0.7, [`/og/work-${p.slug}.png`, ...(p.cover ? [p.cover.desktop] : []), ...(p.gallery ?? []).map((g) => g.src)])),
    page("/writeups/", 0.7, ["/og/writeups.png"]),
    page("/certifications/", 0.7, ["/og/certifications.png"]),
    page("/now/", 0.5, ["/og/now.png"]),
    page("/contact/", 0.8, ["/og/contact.png"]),
  ];
}
