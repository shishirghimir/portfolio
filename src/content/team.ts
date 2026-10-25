// The Netanix Lab crew. Projects credit them by key; profiles live on netanixlab.com.

export interface Mate {
  key: string;
  name: string;
  role: string;
  photo: string;
  href: string;
}

const profile = (slug: string) => `https://netanixlab.com/team/${slug}/`;

export const team: Record<string, Mate> = {
  rikesh: { key: "rikesh", name: "Rikesh Maharjan", role: "CTO", photo: "/team/rikesh-maharjan.webp", href: profile("rikesh-maharjan") },
  rupak: { key: "rupak", name: "Rupak Raj Pandey", role: "CISO", photo: "/team/rupak-raj-pandey.webp", href: profile("rupak-raj-pandey") },
  ritesh: { key: "ritesh", name: "Ritesh Pathak", role: "Head of Design & Marketing", photo: "/team/ritesh-pathak.webp", href: profile("ritesh-pathak") },
  pratik: { key: "pratik", name: "Pratik Prasai", role: "Head of Operations", photo: "/team/pratik-prasai.webp", href: profile("pratik-prasai") },
  sparsha: { key: "sparsha", name: "Sparsha Poudel", role: "Team Lead, NetanixCTF", photo: "/team/sparsha-poudel.webp", href: profile("sparsha-poudel") },
  dipendra: { key: "dipendra", name: "Dipendra Karki", role: "Senior Security Content Engineer", photo: "/team/dipendra-karki.webp", href: profile("dipendra-karki") },
  manish: { key: "manish", name: "Manish Rana", role: "Event Coordinator", photo: "/team/manish-rana.webp", href: profile("manish-rana") },
};

export const crew = Object.values(team);
