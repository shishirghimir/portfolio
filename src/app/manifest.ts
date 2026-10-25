import type { MetadataRoute } from "next";
import { person } from "@/content/profile";

export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${person.name} · ${person.role}`,
    short_name: "Shishir Ghimire",
    description: person.short,
    start_url: "/",
    display: "standalone",
    background_color: "#050608",
    theme_color: "#050608",
    icons: [
      { src: "/icon-192.png?v=sg2", sizes: "192x192", type: "image/png" },
      { src: "/icon-512.png?v=sg2", sizes: "512x512", type: "image/png" },
      { src: "/icon-maskable-512.png?v=sg2", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
