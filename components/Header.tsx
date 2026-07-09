"use client";

import Image from "next/image";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { CleanAnchorLink } from "@/components/CleanAnchorLink";
import { assetPath } from "@/lib/site-paths";

const navItems = [
  { label: "Главная", href: "/" },
  { label: "Услуги", href: "/services" },
  { label: "Кейсы", href: "/projects" },
  { label: "SEO/AEO", href: "/aeo" },
  { label: "FAQ", href: "/faq" }
];

export function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const leadHref = pathname === "/" ? "#lead-form" : "/contact";

  return (
    <header className="sticky top-0 z-50 border-b border-neutral-200 bg-[#f7f7f5]/92 backdrop-blur">
      <CleanAnchorLink
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60] focus:rounded-md focus:bg-white focus:px-4 focus:py-3 focus:text-neutral-950"
      >
        Перейти к содержанию
      </CleanAnchorLink>
      <div className="container-page flex min-h-16 items-center justify-between gap-4">
        <Link href="/" className="flex min-h-12 items-center gap-2" aria-label="ДесмосАвто, на главную">
          <Image
            src={assetPath("/images/brand/desmosauto-icon.svg")}
            alt=""
            width={328}
            height={300}
            priority
            className="h-8 w-auto shrink-0"
          />
          <span className="font-[var(--font-heading)] text-lg font-black text-neutral-950">ДесмосАвто</span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Основная навигация">
          {navItems.map((item) => {
            const isActive = item.href === pathname;
            return (
              <CleanAnchorLink
                key={item.label}
                href={item.href}
                className={`rounded-full px-3 py-2 text-sm font-bold transition-colors hover:bg-white ${
                  isActive ? "text-neutral-950" : "text-neutral-600"
                }`}
              >
                {item.label}
              </CleanAnchorLink>
            );
          })}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <CleanAnchorLink href={leadHref} className="btn-primary !min-h-10 px-4 py-2 text-sm">
            Демо за сутки
          </CleanAnchorLink>
        </div>

        <button
          type="button"
          className="inline-flex h-12 w-12 cursor-pointer items-center justify-center rounded-full border border-neutral-200 bg-white text-neutral-950 lg:hidden"
          aria-label={isOpen ? "Закрыть меню" : "Открыть меню"}
          aria-expanded={isOpen}
          onClick={() => setIsOpen((value) => !value)}
        >
          {isOpen ? <X aria-hidden="true" size={22} /> : <Menu aria-hidden="true" size={22} />}
        </button>
      </div>

      {isOpen ? (
        <div className="border-t border-neutral-200 bg-white lg:hidden">
          <nav className="container-page flex flex-col gap-2 py-4" aria-label="Мобильная навигация">
            {navItems.map((item) => {
              return (
                <CleanAnchorLink
                  key={item.label}
                  href={item.href}
                  className="min-h-12 rounded-md px-3 py-3 font-bold text-neutral-800 hover:bg-neutral-100"
                  onClick={() => setIsOpen(false)}
                >
                  {item.label}
                </CleanAnchorLink>
              );
            })}
            <CleanAnchorLink href={leadHref} className="btn-primary mt-2" onClick={() => setIsOpen(false)}>
              Получить демо за сутки
            </CleanAnchorLink>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
