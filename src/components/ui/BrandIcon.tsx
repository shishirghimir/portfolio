import { FaLinkedinIn } from "react-icons/fa6";
import { SiDiscord, SiGithub, SiMedium, SiTryhackme, SiHackthebox } from "react-icons/si";
import { Mail } from "lucide-react";
import { cn } from "@/lib/cn";

/** Official brand marks for the profiles Shishir links to, in their real colours when asked. */
const ICONS = { linkedin: FaLinkedinIn, github: SiGithub, tryhackme: SiTryhackme, medium: SiMedium, discord: SiDiscord, hackthebox: SiHackthebox, email: Mail };
const COLORS: Record<string, string> = { linkedin: "text-[#0a66c2]", github: "text-white", tryhackme: "text-[#e0262b]", medium: "text-white", discord: "text-[#5865f2]", hackthebox: "text-[#9fef00]", email: "text-signal" };
export type BrandKey = keyof typeof ICONS;

export function BrandIcon({ name, className, colored }: { name: BrandKey | string; className?: string; colored?: boolean }) {
  const I = ICONS[name as BrandKey] ?? Mail;
  return <I className={cn(className, colored && COLORS[name])} aria-hidden />;
}
