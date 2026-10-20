"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

/** Refresh filesystem-backed Markdown while the local preview is visible. */
export function DevRefresh() {
  const router = useRouter();
  useEffect(() => {
    if (process.env.NODE_ENV !== "development") return;
    const refresh = () => {
      if (document.visibilityState === "visible") router.refresh();
    };
    const timer = window.setInterval(refresh, 3000);
    document.addEventListener("visibilitychange", refresh);
    return () => {
      window.clearInterval(timer);
      document.removeEventListener("visibilitychange", refresh);
    };
  }, [router]);
  return null;
}
