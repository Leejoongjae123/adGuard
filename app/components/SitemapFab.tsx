"use client";

import Link from "next/link";
import { Map } from "lucide-react";

export default function SitemapFab() {
  return (
    <Link
      href="/sitemap"
      className="fixed bottom-6 right-6 z-50 flex h-12 w-12 items-center justify-center rounded-full shadow-lg transition-all hover:scale-105 hover:shadow-xl"
      style={{ background: "var(--color-primary)", color: "#fff" }}
      title="사이트맵"
    >
      <Map className="h-5 w-5" />
    </Link>
  );
}
