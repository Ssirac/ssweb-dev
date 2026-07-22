import type { Metadata } from "next";
import { Contact } from "@/components/sections/contact";

export const metadata: Metadata = {
  title: "Contact · SS Developer",
  description: "Have a project in mind? Get in touch with SS Developer, available for freelance and full-time work.",
};

export default function ContactPage() {
  return <Contact />;
}
