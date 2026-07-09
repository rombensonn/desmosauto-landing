import { ArrowRight, Bot, Search, Sparkles } from "lucide-react";
import { CleanAnchorLink } from "@/components/CleanAnchorLink";

const answerPoints = [
  "Диагностика нужна, если есть вибрация, шум, ошибка на панели или машина стала хуже ехать.",
  "Стоимость зависит от узла и глубины проверки, поэтому сервис сначала уточняет симптомы.",
  "Записаться можно без длинной анкеты: достаточно имени и телефона."
];

const sourceChips = ["услуги", "цены", "FAQ", "отзывы"];

export function HeroMockup() {
  return (
    <aside className="reference-hero-visual aeo-hero-visual mt-10 md:mt-14" aria-label="Оффер AEO-оптимизации" data-gsap-hero-visual>
      <div className="container-page relative py-10 sm:py-12 md:py-16">
        <p className="showreel-word" aria-hidden="true">
          AEO
        </p>
        <p className="showreel-year" aria-hidden="true">
          AI-ответ
        </p>

        <div className="aeo-hero-panel grid w-full max-w-full gap-7 rounded-lg p-4 sm:p-7 lg:grid-cols-[minmax(0,0.88fr)_minmax(0,1.12fr)] lg:items-center lg:p-8">
          <div className="min-w-0 max-w-xl">
            <p className="inline-flex min-h-9 items-center gap-2 rounded-full border border-white/18 bg-white/10 px-4 py-2 text-xs font-black uppercase text-[#ffd8c5]">
              <Sparkles aria-hidden="true" size={16} />
              быстрые ответы для клиентов
            </p>
            <h2 className="mt-5 break-words font-[var(--font-heading)] text-3xl font-black leading-[1.02] text-white sm:text-5xl lg:text-6xl">
              AEO-оптимизация под быстрые ответы нейросетей
            </h2>
            <p className="mt-5 max-w-lg text-base leading-8 text-white/74">
              Упакуем услуги, FAQ и доказательства так, чтобы Google, Яндекс и AI-поиск быстрее понимали,
              кому показать ваш автосервис и какой ответ дать клиенту.
            </p>
            <CleanAnchorLink
              href="#aeo-offer"
              className="mt-7 inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-white px-5 py-3 font-black text-neutral-950 transition hover:bg-[#ffd8c5]"
            >
              Посмотреть блок быстрых ответов
              <ArrowRight aria-hidden="true" size={18} />
            </CleanAnchorLink>
          </div>

          <div className="aeo-search-preview min-w-0 rounded-lg p-2.5 sm:p-4">
            <div className="rounded-full border border-white/12 bg-white/[0.08] p-2">
              <div className="flex min-h-11 min-w-0 items-center gap-3 rounded-full bg-white px-4 text-neutral-950">
                <Search aria-hidden="true" className="shrink-0 text-[#ff5a1f]" size={18} />
                <p className="min-w-0 text-sm font-black leading-5 sm:truncate sm:text-base">
                  когда нужна диагностика автомобиля и сколько стоит
                </p>
              </div>
            </div>

            <div className="mt-4 min-w-0 rounded-lg border border-white/14 bg-white/[0.92] p-3 text-neutral-950 shadow-2xl sm:p-5">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-neutral-200 pb-4">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-neutral-950 text-white">
                    <Bot aria-hidden="true" size={21} />
                  </span>
                  <div>
                    <p className="text-sm font-black">Ответ нейросети</p>
                    <p className="mt-1 text-xs font-bold text-neutral-500">AEO-выдача по странице автосервиса</p>
                  </div>
                </div>
                <span className="rounded-full bg-[#fff0e8] px-3 py-1 text-xs font-black text-[#a33510]">быстрый ответ</span>
              </div>

              <div className="mt-4 grid min-w-0 gap-3">
                {answerPoints.map((item, index) => (
                  <div key={item} className="grid min-w-0 grid-cols-[1.75rem_minmax(0,1fr)] gap-3 rounded-lg bg-neutral-100 p-3">
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#ff5a1f] text-xs font-black text-white">
                      {index + 1}
                    </span>
                    <p className="min-w-0 break-words text-sm font-bold leading-6 text-neutral-800">{item}</p>
                  </div>
                ))}
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                {sourceChips.map((item) => (
                  <span key={item} className="rounded-full border border-neutral-200 bg-white px-3 py-1 text-xs font-black text-neutral-600">
                    источник: {item}
                  </span>
                ))}
              </div>

              <div className="mt-4 rounded-lg border border-[#ff5a1f]/24 bg-[#fff0e8] p-3">
                <p className="text-sm font-black text-neutral-950">
                  Следующий шаг: оставить заявку на диагностику
                </p>
                <p className="mt-1 text-xs font-bold leading-5 text-neutral-600">
                  AEO не просто отвечает, а ведёт пользователя к понятному действию.
                </p>
              </div>
            </div>

            <div className="mt-3 grid gap-2 sm:grid-cols-3">
              {["Google AI", "Яндекс Нейро", "AI-поиск"].map((item) => (
                <div key={item} className="rounded-lg border border-white/10 bg-white/[0.07] px-3 py-2 text-center">
                  <p className="text-xs font-black text-white/72">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
