"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

function getVisitorId(): string {
  const key = "rk_visitor_id";
  let id = "";

  // Try to read from cookie
  if (typeof document !== "undefined") {
    const match = document.cookie.match(new RegExp(`(^| )${key}=([^;]+)`));
    if (match) {
      id = match[2];
    }
  }

  if (!id) {
    // Generate new UUID
    id = "v_" + Math.random().toString(36).substring(2, 15) + Date.now().toString(36);
    // Set cookie for 1 year
    if (typeof document !== "undefined") {
      const expires = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toUTCString();
      document.cookie = `${key}=${id}; expires=${expires}; path=/; SameSite=Lax`;
    }
  }

  return id;
}

export default function VisitorTracker() {
  const pathname = usePathname();

  useEffect(() => {
    // Don't track admin pages
    if (pathname?.startsWith("/admin")) return;

    const track = async () => {
      try {
        const visitorId = getVisitorId();
        await fetch("/api/visits", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            visitorId,
            page: pathname || "/",
            referrer: typeof document !== "undefined" ? document.referrer : "",
            userAgent: typeof navigator !== "undefined" ? navigator.userAgent : "",
          }),
        });
      } catch {
        // Silently fail — don't affect user experience
      }
    };

    // Small delay to not block page render
    const timeout = setTimeout(track, 500);
    return () => clearTimeout(timeout);
  }, [pathname]);

  return null; // Invisible component
}
