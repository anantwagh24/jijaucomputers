"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function VisitorTracker() {
  const pathname = usePathname();

  useEffect(() => {
    // Don't track admin pages to avoid noise
    if (pathname.startsWith("/admin")) return;

    try {
      const payload = {
        page: pathname,
        referrer: typeof document !== "undefined" && document.referrer ? document.referrer : "—",
        userAgent: typeof navigator !== "undefined" ? navigator.userAgent : "",
      };

      fetch("/api/admin/visitors", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }).catch(() => {});
    } catch {
      // Non-blocking
    }
  }, [pathname]);

  return null;
}
