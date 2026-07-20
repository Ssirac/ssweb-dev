import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "SS Developer — Junior Frontend Developer",
    short_name: "SS Developer",
    description:
      "Portfolio of SS Developer — a junior frontend developer building clean, modern web experiences with React, Next.js & TypeScript.",
    start_url: "/",
    display: "standalone",
    background_color: "#0A0A0D",
    theme_color: "#0A0A0D",
    icons: [
      { src: "/favicon.svg", sizes: "any", type: "image/svg+xml" },
      { src: "/sslogo.jpg", sizes: "512x512", type: "image/jpeg", purpose: "any" },
    ],
  };
}
