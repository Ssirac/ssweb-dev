export function Grid() {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none">
      <div className="absolute inset-0 bg-grid-pattern bg-[size:60px_60px] opacity-40 [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_75%)]" />
      <div className="absolute left-1/2 top-0 -translate-x-1/2 h-[500px] w-[900px] rounded-full bg-primary/20 blur-[140px]" />
      <div className="absolute right-0 bottom-0 h-[400px] w-[500px] rounded-full bg-secondary/15 blur-[140px]" />
    </div>
  );
}
