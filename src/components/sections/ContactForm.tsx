"use client";

import { useState } from "react";
import { Send } from "lucide-react";
import { person } from "@/content/profile";

const TOPICS = ["Software project with Netanix Lab", "Security assessment", "CTF or event collaboration", "Job or role", "Speaking or media", "Something else"];
const field = "w-full rounded-xl border border-white/10 bg-ink-950 px-4 py-3.5 text-sm text-fg placeholder:text-subtle outline-none transition-all focus:border-signal/60 focus:ring-4 focus:ring-signal/10";

/** Opens the visitor's mail app with everything pre-filled. No data is stored or sent anywhere else. */
export function ContactForm() {
  const [sent, setSent] = useState(false);
  return (
    <form
      className="grid gap-4 sm:grid-cols-2"
      onSubmit={(e) => {
        e.preventDefault();
        const d = Object.fromEntries(new FormData(e.currentTarget)) as Record<string, string>;
        const body = [`Name: ${d.name}`, `Email: ${d.email}`, d.company ? `Company: ${d.company}` : "", `Topic: ${d.topic}`, "", d.message].filter((x) => x !== "").join("\n");
        window.location.href = `mailto:${person.email}?subject=${encodeURIComponent(`${d.topic}: ${d.name}`)}&body=${encodeURIComponent(body)}`;
        setSent(true);
      }}
    >
      <label className="grid gap-2 text-sm text-muted">Name *<input required name="name" autoComplete="name" placeholder="Your name" className={field} /></label>
      <label className="grid gap-2 text-sm text-muted">Email *<input required type="email" name="email" autoComplete="email" placeholder="you@company.com" className={field} /></label>
      <label className="grid gap-2 text-sm text-muted">Company<input name="company" autoComplete="organization" placeholder="Optional" className={field} /></label>
      <label className="grid gap-2 text-sm text-muted">Topic<select name="topic" defaultValue={TOPICS[0]} className={`${field} appearance-none`}>{TOPICS.map((t) => <option key={t}>{t}</option>)}</select></label>
      <label className="grid gap-2 text-sm text-muted sm:col-span-2">Message *<textarea required name="message" rows={6} placeholder="What are you building, or what should I try to break?" className={`${field} resize-y`} /></label>
      <div className="flex flex-col items-start gap-3 sm:col-span-2 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs text-subtle">{sent ? "Your mail app should have opened. If not, email me directly." : "Opens your mail app pre-filled. Nothing is stored on this site."}</p>
        <button type="submit" className="group inline-flex items-center gap-2 rounded-full bg-signal px-6 py-3 text-sm font-semibold text-on-signal transition-colors hover:bg-signal-300">
          <Send className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden />Send message
        </button>
      </div>
    </form>
  );
}
