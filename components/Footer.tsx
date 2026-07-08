import Link from "next/link";
import { CleanAnchorLink } from "@/components/CleanAnchorLink";
import { personalDataOperator } from "@/lib/operator";

export function Footer() {
  return (
    <footer className="border-t border-neutral-200 bg-white text-neutral-950">
      <div className="container-page py-12">
        <div className="grid gap-10 lg:grid-cols-[1.2fr_1fr_1fr]">
          <div className="max-w-sm">
            <Link href="/" className="inline-flex items-center" aria-label="ДесмосАвто, на главную">
              <span className="font-[var(--font-heading)] text-xl font-black">ДесмосАвто</span>
            </Link>
            <p className="mt-3 text-sm leading-6 text-neutral-600">
              Сайты для автосервисов: структура услуг, доверие, заявка и демо-версия за сутки.
            </p>
            <CleanAnchorLink href="#lead-form" className="btn-primary mt-5 !min-h-10 px-4 py-2 text-sm">
              Получить демо
            </CleanAnchorLink>
          </div>

          <nav className="grid gap-3 text-sm font-bold" aria-label="Разделы сайта">
            <p className="font-[var(--font-serif)] text-lg italic font-normal text-neutral-500">Разделы</p>
            <Link className="text-neutral-700 transition-colors hover:text-neutral-950" href="/">
              Главная
            </Link>
            <Link className="text-neutral-700 transition-colors hover:text-neutral-950" href="/projects">
              Кейсы
            </Link>
            <CleanAnchorLink className="text-neutral-700 transition-colors hover:text-neutral-950" href="/#process">
              Процесс
            </CleanAnchorLink>
            <CleanAnchorLink className="text-neutral-700 transition-colors hover:text-neutral-950" href="/#faq">
              FAQ
            </CleanAnchorLink>
          </nav>

          <nav className="grid gap-3 text-sm font-bold" aria-label="Документы">
            <p className="font-[var(--font-serif)] text-lg italic font-normal text-neutral-500">Документы</p>
            <Link className="text-neutral-700 transition-colors hover:text-neutral-950" href="/privacy-policy">
              Политика обработки данных
            </Link>
            <Link className="text-neutral-700 transition-colors hover:text-neutral-950" href="/personal-data-consent">
              Согласие на обработку
            </Link>
            <span className="text-neutral-500">{personalDataOperator.phone}</span>
          </nav>
        </div>

        <div className="mt-10 border-t border-neutral-200 pt-5">
          <div className="grid gap-4 text-[11px] leading-5 text-neutral-500 md:grid-cols-[minmax(0,1.4fr)_minmax(220px,0.6fr)] md:items-start">
            <div className="max-w-3xl">
              <p>
                Оператор персональных данных: {personalDataOperator.shortName}, ОГРНИП{" "}
                {personalDataOperator.ogrnip}, ИНН {personalDataOperator.inn}, адрес регистрации:{" "}
                {personalDataOperator.address}.
              </p>
            </div>
            <div className="space-y-1 md:text-right">
              <p className="font-semibold text-neutral-600">{personalDataOperator.phone}</p>
              <p>
                <a className="font-semibold text-neutral-600 transition-colors hover:text-neutral-950" href={`mailto:${personalDataOperator.email}`}>
                  {personalDataOperator.email}
                </a>
              </p>
              <p className="pt-1">© 2026 ДесмосАвто</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
