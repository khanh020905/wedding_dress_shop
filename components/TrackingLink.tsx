"use client";

import { trackCTAClick } from "@/lib/analytics";
import { cn } from "@/lib/utils";

interface TrackingLinkProps {
  href: string;
  label: string;
  location: string;
  className?: string;
  children: React.ReactNode;
}

export function TrackingLink({
  href,
  label,
  location,
  className,
  children,
}: TrackingLinkProps) {
  return (
    <a
      href={href}
      onClick={() => trackCTAClick(label, location)}
      className={cn(className)}
    >
      {children}
    </a>
  );
}

export default TrackingLink;
