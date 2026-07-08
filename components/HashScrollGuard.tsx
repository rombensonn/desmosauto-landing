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
    let timeoutId = 0;
    let lateTimeoutId = 0;

    function clearHashToTop() {
      if (window.sessionStorage.getItem(pendingScrollKey)) {
        return;
      }

      if (window.location.hash) {
        replaceUrlWithoutHash();
      }

      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    }

    const pendingTarget = window.sessionStorage.getItem(pendingScrollKey);

    if (!pendingTarget) {
      clearHashToTop();
      frameId = window.requestAnimationFrame(clearHashToTop);
      timeoutId = window.setTimeout(clearHashToTop, 80);
      lateTimeoutId = window.setTimeout(clearHashToTop, 500);
      window.addEventListener("hashchange", clearHashToTop);

      return () => {
        window.cancelAnimationFrame(frameId);
        window.clearTimeout(timeoutId);
        window.clearTimeout(lateTimeoutId);
        window.removeEventListener("hashchange", clearHashToTop);
      };
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

  useEffect(() => {
    function handleHashChange() {
      if (!window.location.hash) {
        return;
      }

      replaceUrlWithoutHash();
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
      window.requestAnimationFrame(() => window.scrollTo({ top: 0, left: 0, behavior: "auto" }));
      window.setTimeout(() => window.scrollTo({ top: 0, left: 0, behavior: "auto" }), 120);
      window.setTimeout(() => window.scrollTo({ top: 0, left: 0, behavior: "auto" }), 500);
    }

    window.addEventListener("hashchange", handleHashChange);

    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  return null;
}
