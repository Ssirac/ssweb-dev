// Ambient "flowing code" layer for the hero — faint monospace lines drifting
// upward at different speeds. Decorative only; hidden for reduced motion.
const LINES = [
  "const build = () => ship(idea);",
  "export default function App() {",
  "import { motion } from 'framer';",
  "return <section className='hero'>",
  "useEffect(() => render(), []);",
  "if (clean && fast) success();",
  "type Props = { name: string };",
  "await fetch('/api/projects');",
  "git commit -m 'ship it';",
  "<div className='flex gap-4'>",
  ".map((p) => <Card {...p} />)",
  "const [state, set] = useState(0);",
  "background: #4550F5;",
  "grid-template-columns: 1fr 1fr;",
  "@media (min-width: 768px) {",
  "npm run build && deploy();",
];

const COLS = [
  { dur: 34, delay: 0 },
  { dur: 48, delay: -9 },
  { dur: 40, delay: -18 },
  { dur: 54, delay: -5 },
  { dur: 44, delay: -22 },
  { dur: 38, delay: -14 },
];

export function CodeRain() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 z-0 overflow-hidden opacity-[0.09] [mask-image:linear-gradient(to_bottom,transparent,black_18%,black_82%,transparent)] motion-reduce:hidden"
    >
      <div className="flex h-full justify-between gap-8 px-2">
        {COLS.map((c, i) => (
          <div
            key={i}
            className="flex shrink-0 flex-col gap-1.5"
            style={{ animation: `code-scroll ${c.dur}s linear ${c.delay}s infinite` }}
          >
            {[...LINES, ...LINES].map((ln, j) => (
              <span key={j} className="whitespace-nowrap font-mono text-[11px] leading-relaxed text-primary">
                {ln}
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
