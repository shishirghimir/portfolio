import Link from "next/link";
import { Button } from "@/components/ui/Button";

export const metadata = { title: "404: not found", robots: { index: false } };

export default function NotFound() {
  return (
    <section className="relative isolate grid min-h-[80svh] place-items-center overflow-hidden px-5 pt-24 text-center">
      <div aria-hidden className="grid-bg fade-mask absolute inset-0 -z-10 opacity-60" />
      <div>
        <p className="font-mono text-sm text-alert">[!] 404 · route not found</p>
        <h1 className="glow mt-4 text-7xl font-semibold tracking-[-0.05em] text-signal sm:text-9xl">404</h1>
        <p className="mx-auto mt-5 max-w-md text-muted">That page does not exist, or it moved when this site was rebuilt. Try one of these instead.</p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Button href="/">Back home</Button>
          <Button href="/work/" variant="ghost">See my work</Button>
        </div>
        <p className="mt-10 font-mono text-xs text-subtle">or press <kbd className="rounded border border-white/10 px-1.5">`</kbd> and type <Link href="/" className="text-signal">help</Link></p>
      </div>
    </section>
  );
}
