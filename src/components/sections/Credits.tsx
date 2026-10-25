import Image from "next/image";
import { team } from "@/content/team";
import type { Project } from "@/content/projects";

/** Stacked teammate faces with names in the tooltip/alt text. */
export function CreditFaces({ p, max = 4 }: { p: Project; max?: number }) {
  if (!p.credits.length) return null;
  const mates = p.credits.slice(0, max).map((c) => team[c.mate]);
  return (
    <span className="flex items-center gap-2">
      <span className="flex -space-x-2">
        {mates.map((m) => (
          <span key={m.key} title={`${m.name}, ${m.role}`} className="relative size-7 overflow-hidden rounded-full ring-2 ring-ink-900">
            <Image src={m.photo} alt={m.name} fill sizes="28px" className="object-cover" />
          </span>
        ))}
      </span>
      <span className="text-xs text-subtle">with {mates.map((m) => m.name.split(" ")[0]).join(", ")}</span>
    </span>
  );
}
