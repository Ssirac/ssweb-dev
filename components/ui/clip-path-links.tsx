"use client";

// Clip-path hover links (adapted from TomIsLoading's 21st.dev / hover.dev
// component). Hovering a tile wipes an indigo layer in from the edge the
// cursor entered and out through the edge it left. Wired to our real
// channels; icons from react-icons + lucide, matching the rest of the site.

import { useAnimate } from "framer-motion";
import type { ComponentType } from "react";
import { FaGithub, FaLinkedin, FaInstagram, FaWhatsapp } from "react-icons/fa";
import { FaTiktok } from "react-icons/fa6";
import { Mail, Phone } from "lucide-react";
import { PROFILE } from "@/lib/data";

const NO_CLIP = "polygon(0 0, 100% 0, 100% 100%, 0% 100%)";
const BOTTOM_RIGHT_CLIP = "polygon(0 0, 100% 0, 0 0, 0% 100%)";
const TOP_RIGHT_CLIP = "polygon(0 0, 0 100%, 100% 100%, 0% 100%)";
const BOTTOM_LEFT_CLIP = "polygon(100% 100%, 100% 0, 100% 100%, 0 100%)";
const TOP_LEFT_CLIP = "polygon(0 0, 100% 0, 100% 100%, 100% 0)";

type Side = "left" | "right" | "top" | "bottom";

const ENTRANCE_KEYFRAMES: Record<Side, string[]> = {
  left: [BOTTOM_RIGHT_CLIP, NO_CLIP],
  bottom: [BOTTOM_RIGHT_CLIP, NO_CLIP],
  top: [BOTTOM_RIGHT_CLIP, NO_CLIP],
  right: [TOP_LEFT_CLIP, NO_CLIP],
};

const EXIT_KEYFRAMES: Record<Side, string[]> = {
  left: [NO_CLIP, TOP_RIGHT_CLIP],
  bottom: [NO_CLIP, TOP_RIGHT_CLIP],
  top: [NO_CLIP, TOP_RIGHT_CLIP],
  right: [NO_CLIP, BOTTOM_LEFT_CLIP],
};

const getNearestSide = (e: React.MouseEvent): Side => {
  const box = (e.currentTarget as HTMLElement).getBoundingClientRect();
  const proximity: { side: Side; d: number }[] = [
    { side: "left", d: Math.abs(box.left - e.clientX) },
    { side: "right", d: Math.abs(box.right - e.clientX) },
    { side: "top", d: Math.abs(box.top - e.clientY) },
    { side: "bottom", d: Math.abs(box.bottom - e.clientY) },
  ];
  proximity.sort((a, b) => a.d - b.d);
  return proximity[0].side;
};

const LinkBox = ({
  Icon,
  href,
  label,
  external,
}: {
  Icon: ComponentType<{ size?: number; className?: string }>;
  href: string;
  label: string;
  external: boolean;
}) => {
  const [scope, animate] = useAnimate();

  const handleMouseEnter = (e: React.MouseEvent) => {
    animate(scope.current, { clipPath: ENTRANCE_KEYFRAMES[getNearestSide(e)] });
  };
  const handleMouseLeave = (e: React.MouseEvent) => {
    animate(scope.current, { clipPath: EXIT_KEYFRAMES[getNearestSide(e)] });
  };

  return (
    <a
      href={href}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      aria-label={label}
      title={label}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="relative grid h-20 w-full place-content-center text-muted transition-colors hover:text-ink sm:h-24"
    >
      <Icon size={26} />
      <div
        ref={scope}
        style={{ clipPath: BOTTOM_RIGHT_CLIP }}
        className="absolute inset-0 grid place-content-center bg-primary text-white"
      >
        <Icon size={26} />
      </div>
    </a>
  );
};

export function ClipPathLinks() {
  return (
    <div className="divide-y divide-ink/10 overflow-hidden rounded-2xl border border-ink/10">
      <div className="grid grid-cols-2 divide-x divide-ink/10">
        <LinkBox Icon={FaGithub} href={PROFILE.socials.github} label="GitHub" external />
        <LinkBox Icon={FaLinkedin} href={PROFILE.socials.linkedin} label="LinkedIn" external />
      </div>
      <div className="grid grid-cols-3 divide-x divide-ink/10">
        <LinkBox Icon={FaInstagram} href={PROFILE.socials.instagram} label="Instagram" external />
        <LinkBox Icon={FaTiktok} href={PROFILE.socials.tiktok} label="TikTok" external />
        <LinkBox
          Icon={FaWhatsapp}
          href={`https://wa.me/${PROFILE.whatsapp[0].number}`}
          label="WhatsApp"
          external
        />
      </div>
      <div className="grid grid-cols-2 divide-x divide-ink/10">
        <LinkBox Icon={Mail} href={`mailto:${PROFILE.email}`} label="Email" external={false} />
        <LinkBox
          Icon={Phone}
          href={`tel:+${PROFILE.whatsapp[0].number}`}
          label="Phone"
          external={false}
        />
      </div>
    </div>
  );
}
