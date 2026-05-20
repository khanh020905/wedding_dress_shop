"use client";

import { trackCTAClick } from "@/lib/analytics";
import { cn } from "@/lib/utils";

interface TrackingLinkProps {
  href: string;
  label: string;
  location: string;
  className?: string;
  target?: string;
  rel?: string;
  ariaLabel?: string;
  style?: React.CSSProperties;
  children: React.ReactNode;
}

export function TrackingLink({
  href,
  label,
  location,
  className,
  target,
  rel,
  ariaLabel,
  style,
  children,
}: TrackingLinkProps) {
  function handleClick(event: React.MouseEvent<HTMLAnchorElement>) {
    trackCTAClick(label, location);

    if (href.startsWith("#")) {
      event.preventDefault();
      event.currentTarget.closest("details")?.removeAttribute("open");

      const targetElement = document.querySelector(href);

      if (targetElement) {
        window.history.pushState(null, "", href);
        targetElement.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    }
  }

  return (
    <a
      href={href}
      target={target}
      rel={rel}
      aria-label={ariaLabel}
      onClick={handleClick}
      className={cn(className)}
      style={style}
    >
      {children}
    </a>
  );
}

export default TrackingLink;
