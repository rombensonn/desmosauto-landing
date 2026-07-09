"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { pendingScrollKey } from "@/components/CleanAnchorLink";

function replaceUrlWithoutHash() {
  const cleanPath = `${window.location.pathname}${window.location.search}`;
  window.history.replaceState(null, "", cleanPath);
}

export function HashScrollGuard() {
  const pathname = usePathname();

  useEffect(() => {
    let frameId = 0;
    const pendingTarget = window.sessionStorage.getItem(pendingScrollKey);

    if (!pendingTarget) {
      return undefined;
    }

    window.sessionStorage.removeItem(pendingScrollKey);

    frameId = window.requestAnimationFrame(() => {
      const target = document.getElementById(pendingTarget);
      target?.scrollIntoView({ behavior: "smooth", block: "start" });
      replaceUrlWithoutHash();
    });

    return () => {
      window.cancelAnimationFrame(frameId);
    };
  }, [pathname]);

  return null;
}
