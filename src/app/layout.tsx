// This file is intentionally left blank or with minimal content
// as the main layout logic has moved to src/app/[lang]/layout.tsx.
// You can delete this file if your project structure allows,
// or keep it if other root-level configurations might eventually need it.

// For example, if you needed a root layout that applies to error pages
// or special Next.js files outside the [lang] structure, it might go here.
// However, for typical app content, src/app/[lang]/layout.tsx is now primary.

export default function GlobalLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
