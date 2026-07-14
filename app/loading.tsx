// Shown instantly during route transitions (Next.js Suspense boundary).
// In dev this gives immediate feedback while the route compiles; in
// production, prefetched pages usually swap before it ever appears.
export default function Loading() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary/25 border-t-primary" />
        <span className="font-mono text-xs uppercase tracking-[0.3em] text-muted">SS · Loading</span>
      </div>
    </div>
  );
}
