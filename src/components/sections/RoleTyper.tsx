"use client";

import { useEffect, useState } from "react";

/** Types each role, pauses, deletes it and moves to the next. First role is in the HTML. */
export function RoleTyper({ roles }: { roles: string[] }) {
  const [i, setI] = useState(0);
  const [n, setN] = useState(roles[0].length);
  const [del, setDel] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const word = roles[i];
    const t = window.setTimeout(() => {
      if (!del && n === word.length) setDel(true);
      else if (del && n === 0) { setDel(false); setI((x) => (x + 1) % roles.length); }
      else setN((x) => x + (del ? -1 : 1));
    }, !del && n === word.length ? 2200 : del ? 28 : 55);
    return () => clearTimeout(t);
  }, [i, n, del, roles]);

  return (
    <span className="font-mono">
      <span className="text-signal">&gt; </span>
      <span className="text-fg">{roles[i].slice(0, n)}</span>
      <span aria-hidden className="ml-0.5 inline-block h-[1.05em] w-[0.55em] translate-y-[0.18em] animate-blink bg-signal" />
    </span>
  );
}
