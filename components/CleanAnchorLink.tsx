"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { AnchorHTMLAttributes, MouseEvent, ReactNode } from "react";

type CleanAnchorLinkProps = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> & {
  href: string;
  children: ReactNode;
};

const pendingScrollKey = "desmosauto:pending-scroll-target";

function splitHref(href: string) {
  const hashIndex = href.indexOf("#");

  if (hashIndex === -1) {
    return { path: href, targetId: "" };
  }

  return {
    path: href.slice(0, hashIndex),
    targetId: href.slice(hashIndex + 1)
  };
}

function cleanUrl() {
  const cleanPath = `${window.location.pathname}${window.location.search}`;
  window.history.replaceState(null, "", cleanPath);
}

function scrollToTarget(targetId: string) {
  const target = document.getElementById(targetId);

  if (!target) {
    return;
  }

  target.scrollIntoView({ behavior: "smooth", block: "start" });
  cleanUrl();
}

export function CleanAnchorLink({ href, children, onClick, ...props }: CleanAnchorLinkProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { path, targetId } = splitHref(href);

  function handleClick(event: MouseEvent<HTMLAnchorElement>) {
    onClick?.(event);

    if (event.defaultPrevented || !targetId) {
      return;
    }

    event.preventDefault();

    const targetPath = path || pathname;

    if (targetPath === pathname) {
      scrollToTarget(targetId);
      return;
    }

    window.sessionStorage.setItem(pendingScrollKey, targetId);
    router.push(targetPath);
  }

  return (
    <Link href={targetId ? path || pathname : href} onClick={handleClick} {...props}>
      {children}
    </Link>
  );
}

export { pendingScrollKey };
