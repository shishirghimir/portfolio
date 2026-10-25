/** Re-mounts on every navigation, so each page settles in. Nothing fixed lives inside it, so the transform is safe. */
export default function Template({ children }: { children: React.ReactNode }) {
  return <div className="page-in">{children}</div>;
}
