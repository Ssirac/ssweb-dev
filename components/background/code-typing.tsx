// Global "code being written" layer — faint monospace lines that type
// themselves out (clip-path steps → paint-only, no layout, no re-renders),
// hold, fade and retype on independent cycles, fixed behind every section.
// Desktop only; hidden for reduced motion.

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
  ".map((p) => <Card {...p} />)",
  "const [state, set] = useState(0);",
  "npm run build && deploy();",
];

// scattered placements: top/left %, cycle duration s, delay s.
// Kept to 7 slow lines: every clip-path step is a repaint, so fewer lines
// with longer cycles ≈ half the constant paint work of the original 12.
const PLACES = [
  { top: "6%",  left: "3%",  dur: 24, delay: 0 },
  { top: "16%", left: "58%", dur: 30, delay: 4 },
  { top: "32%", left: "72%", dur: 26, delay: 2 },
  { top: "44%", left: "6%",  dur: 32, delay: 9 },
  { top: "58%", left: "48%", dur: 25, delay: 6 },
  { top: "74%", left: "14%", dur: 28, delay: 12 },
  { top: "86%", left: "66%", dur: 31, delay: 3 },
];

export function CodeTyping() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0 hidden overflow-hidden opacity-[0.22] [mask-image:linear-gradient(to_bottom,transparent,black_15%,black_85%,transparent)] motion-reduce:hidden md:block"
    >
      {PLACES.map((p, i) => (
        <span
          key={i}
          className="absolute whitespace-nowrap font-mono text-[12px] text-primary"
          style={{
            top: p.top,
            left: p.left,
            animation: `code-type ${p.dur}s linear ${p.delay}s infinite`,
            clipPath: "inset(0 100% 0 0)",
          }}
        >
          {LINES[i % LINES.length]}
        </span>
      ))}
    </div>
  );
}
