import type { Metadata } from "next";
import { About } from "@/components/sections/about";
import { Skills } from "@/components/sections/skills";

export const metadata: Metadata = {
  title: "About · SS Developer",
  description: "Get to know SS Developer: a full stack engineer, experience timeline, and the modern stack behind every build.",
};

export default function AboutPage() {
  return (
    <>
      <About />
      <Skills />
    </>
  );
}
