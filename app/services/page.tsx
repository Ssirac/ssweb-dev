import type { Metadata } from "next";
import { Services } from "@/components/sections/services";

export const metadata: Metadata = {
  title: "Services · SS Developer",
  description: "Web development, frontend, backend, API design, UI/UX and performance: end-to-end product development.",
};

export default function ServicesPage() {
  return <Services />;
}
