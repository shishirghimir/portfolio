import { FaLinkedinIn } from "react-icons/fa6";
import { SiDiscord, SiGithub, SiMedium, SiTryhackme, SiHackthebox } from "react-icons/si";
import { Mail } from "lucide-react";

/** Official brand marks for the profiles Shishir links to. */
const ICONS = { linkedin: FaLinkedinIn, github: SiGithub, tryhackme: SiTryhackme, medium: SiMedium, discord: SiDiscord, hackthebox: SiHackthebox, email: Mail };
export type BrandKey = keyof typeof ICONS;

export function BrandIcon({ name, className }: { name: BrandKey | string; className?: string }) {
  const I = ICONS[name as BrandKey] ?? Mail;
  return <I className={className} aria-hidden />;
}
