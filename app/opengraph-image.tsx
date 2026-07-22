import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "SS Developer · Junior Frontend Developer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Branded social preview shown when the link is shared (WhatsApp, LinkedIn, …).
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px",
          background: "#0A0A0D",
          backgroundImage:
            "radial-gradient(900px 500px at 80% -10%, rgba(69,80,245,0.35), transparent 60%)",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: 26,
            letterSpacing: 6,
            textTransform: "uppercase",
            color: "#6E76FF",
            fontFamily: "monospace",
          }}
        >
          Frontend Developer · Azerbaijan
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", fontSize: 108, fontWeight: 800, color: "#EAECF3", lineHeight: 1 }}>
            SS Developer
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", marginTop: 24, fontSize: 40, color: "#9A8FB0" }}>
            <span style={{ color: "#EAECF3" }}>I turn ideas into&nbsp;</span>
            <span style={{ color: "#6E76FF" }}>memorable</span>
            <span style={{ color: "#EAECF3" }}>&nbsp;websites.</span>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div style={{ display: "flex", width: 48, height: 6, borderRadius: 999, background: "linear-gradient(90deg,#4550F5,#6E76FF)" }} />
            <div style={{ display: "flex", fontSize: 30, color: "#EAECF3", fontFamily: "monospace" }}>ssweb.dev</div>
          </div>
          <div style={{ display: "flex", gap: 14, fontSize: 26, color: "#9A8FB0", fontFamily: "monospace" }}>
            React · Next.js · TypeScript
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
