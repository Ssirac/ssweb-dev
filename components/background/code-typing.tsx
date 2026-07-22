// Ambient "code being written" layer for the hero — faint monospace lines that
// type themselves out (clip-path steps → paint-only, no layout, no re-renders),
// hold, fade and retype on independent cycles. Desktop only; hidden for
// reduced motion.

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

// scattered placements: top/left %, cycle duration s, delay s
const PLACES = [
  { top: "6%",  left: "3%",  dur: 16, delay: 0 },
  { top: "14%", left: "58%", dur: 21, delay: 3 },
  { top: "24%", left: "22%", dur: 18, delay: 6 },
  { top: "32%", left: "72%", dur: 15, delay: 1.5 },
  { top: "42%", left: "6%",  dur: 22, delay: 8 },
  { top: "50%", left: "48%", dur: 17, delay: 4.5 },
  { top: "60%", left: "68%", dur: 20, delay: 10 },
  { top: "68%", left: "14%", dur: 16, delay: 2 },
  { top: "76%", left: "44%", dur: 23, delay: 7 },
  { top: "84%", left: "70%", dur: 18, delay: 12 },
  { top: "90%", left: "8%",  dur: 21, delay: 5 },
  { top: "38%", left: "34%", dur: 19, delay: 14 },
];

export function CodeTyping() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 z-0 hidden overflow-hidden opacity-[0.13] [mask-image:linear-gradient(to_bottom,transparent,black_15%,black_85%,transparent)] motion-reduce:hidden md:block"
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
