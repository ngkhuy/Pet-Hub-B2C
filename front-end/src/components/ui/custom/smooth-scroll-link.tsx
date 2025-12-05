"use client";
import Link from "next/link";
import { PropsWithChildren } from "react";

type Props = PropsWithChildren<{ href: `#${string}`; offset?: number }>;

export function SmoothScrollLink({ href, offset = 88, children }: Props) {
  return (
    <Link
      href={href}
      onClick={(e) => {
        e.preventDefault();
        const id = href.slice(1);
        const el = document.getElementById(id);
        if (!el) return;
        const top = el.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: "smooth" });
        history.replaceState(null, "", href);
      }}
      className="group flex items-center justify-between gap-4 p-4 transition-colors hover:bg-muted/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
    >
      {children}
    </Link>
  );
}
