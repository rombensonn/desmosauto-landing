import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Bot, CheckCircle2, ClipboardList, MessageSquareQuote, SearchCheck, Sparkles } from "lucide-react";
import { CleanAnchorLink } from "@/components/CleanAnchorLink";
import { CTASection } from "@/components/CTASection";
import { FAQ } from "@/components/FAQ";
import { GsapScrollExperience } from "@/components/GsapScrollExperience";
import { HeroMockup } from "@/components/HeroMockup";
import { ProjectGrid } from "@/components/ProjectGrid";
import { ScrollStackShowcase } from "@/components/ScrollStackShowcase";
import { Section } from "@/components/Section";
import { SeoJsonLd } from "@/components/SeoJsonLd";
import { ServicesGrid } from "@/components/ServicesGrid";
import { faqs } from "@/data/faqs";
import { featuredProjects } from "@/data/projects";
import { services } from "@/data/services";
import {
  createPageMetadata,
  faqJsonLd,
  organizationJsonLd,
  serviceJsonLd,
  websiteJsonLd
} from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "ДесмосАвто — сайт для автосервиса за сутки без предоплаты",
  description:
    "Покажем демо-версию сайта для автосервиса за сутки без предоплаты и обязательств. В портфеле 120 рабочих проектов для СТО, шиномонтажей, детейлинга и смежных ниш.",
  path: "/"
});

const proofItems = [
  "Демо-версия за сутки",
  "Без предоплаты и обязательств",
  "120 рабочих проектов",
  "12 кейсов на главной",
  "SEO/AEO-структура с первого дня",
  "Заявки: имя + телефон"
];

const problemItems = [
  {
    text: "клиенты звонят и задают одни и те же вопросы",
    detail: "Администратор повторяет базовые ответы вместо записи клиента.",
    tags: ["FAQ", "услуги", "запись"],
    model: "/images/problem-models-uniform/repeat-calls.png"
  },
  {
    text: "не понимают стоимость, сроки и состав работ",
    detail: "Без логики цены клиент сравнивает только по самому низкому чеку.",
    tags: ["цены", "сроки", "состав работ"],
    model: "/images/problem-models-uniform/unclear-estimate.png"
  },
  {
    text: "боятся переплаты и не доверяют мастерам без доказательств",
    detail: "Сомнения растут, когда нет фото, гарантий и понятных ответов.",
    tags: ["доверие", "гарантии", "доказательства"],
    model: "/images/problem-models-uniform/trust-proof.png"
  },
  {
    text: "хотят увидеть фото работ, гарантии и понятный порядок записи",
    detail: "Решение созревает быстрее, когда путь до заявки показан заранее.",
    tags: ["фото работ", "порядок", "уверенность"],
    model: "/images/problem-models-uniform/work-photos.png"
  },
  {
    text: "с телефона неудобно оставить заявку",
    detail: "Мобильный сценарий должен вести к контакту без лишних полей.",
    tags: ["мобильный", "форма", "контакт"],
    model: "/images/problem-models-uniform/mobile-form.png"
  },
  {
    text: "сайт не помогает администратору, а просто висит для галочки",
    detail: "Страница должна подготавливать обращение, а не быть визиткой без роли.",
    tags: ["заявка", "структура", "разговор"],
    model: "/images/problem-models-uniform/admin-dashboard.png"
  }
];

const solutionItems = [
  {
    text: "объясняет услуги простым языком до звонка",
    model: "/images/solution-models-uniform/simple-services.png"
  },
  {
    text: "показывает цены от или принципы расчёта",
    model: "/images/solution-models-uniform/pricing-logic.png"
  },
  {
    text: "собирает имя и телефон без длинных анкет",
    model: "/images/solution-models-uniform/short-lead-form.png"
  },
  {
    text: "показывает доверие: опыт, фото, гарантии, ответы",
    model: "/images/solution-models-uniform/trust-package.png"
  },
  {
    text: "готовит клиента к разговору с администратором",
    model: "/images/solution-models-uniform/admin-conversation.png"
  },
  {
    text: "даёт владельцу более структурированные обращения",
    model: "/images/solution-models-uniform/structured-leads.png"
  }
];

const processItems = [
  "Изучаем автосервис: услуги, отзывы, фото, географию, специализацию.",
  "Собираем структуру: первый экран, услуги, доверие, цены, FAQ, заявка.",
  "Делаем дизайн: мобильный, понятный, без шаблонной подачи.",
  "Собираем сайт: фронтенд, PHP-форма, SEO/AEO, базовая аналитическая структура.",
  "Подключаем серверную обработку заявок без внешних сервисных интеграций.",
  "Передаём сайт и список улучшений для следующего этапа."
];

const seoAeoCards = [
  ["Ответы на вопросы клиентов", "Короткие блоки помогают быстрее понять услугу, цену и порядок записи."],
  ["FAQ-разметка", "Вопросы и ответы оформлены так, чтобы их было удобно индексировать и цитировать."],
  ["Структура услуг", "У каждой услуги есть назначение, состав работ, ограничения и следующий шаг."],
  ["Кейсы и доказательства", "120 рабочих проектов показывают, как структура сайта решает задачи разных автосервисов."],
  ["Быстрые страницы", "Семантическая верстка, статическая генерация и лёгкие компоненты уменьшают лишнюю нагрузку."],
  ["Внутренняя перелинковка", "Главная ведёт в каталог, каталог возвращает к заявке и будущим страницам кейсов."]
];

const aeoHighlights = [
  ["Формулируем ответы", "Пишем блоки так, чтобы нейросети быстро понимали услугу, симптомы, цену и следующий шаг."],
  ["Усиливаем выдачу", "Готовим структуру под быстрые ответы Google, Яндекса и AI-поиска по вопросам клиентов."],
  ["Связываем с заявкой", "Ответ не висит отдельно: после объяснения человек видит понятный путь к записи."]
];

const advantageItems = [
  {
    kicker: "Специализация",
    title: "Понимаем авто-нишу",
    description: "Не начинаем с пустого листа: знаем, как объяснять услуги СТО, шиномонтажа, детейлинга и ремонта.",
    model: "/images/trust-models/auto-specialist.png"
  },
  {
    kicker: "Структура",
    title: "Собираем путь к заявке",
    description: "Выстраиваем первый экран, услуги, цены, доверие, FAQ и форму так, чтобы сайт работал как администратор.",
    model: "/images/trust-models/service-structure.png"
  },
  {
    kicker: "Практика",
    title: "Опираемся на 120 проектов",
    description: "Быстрее подбираем формат, потому что уже видели десятки задач по разным направлениям автосервиса.",
    model: "/images/trust-models/case-library.png"
  },
  {
    kicker: "Скорость",
    title: "Показываем демо за сутки",
    description: "Даём увидеть первую версию до оплаты, чтобы вы оценили подход, структуру и визуальный уровень.",
    model: "/images/trust-models/fast-demo.png"
  },
  {
    kicker: "Техника",
    title: "Делаем заявку надёжной",
    description: "Форма с именем и телефоном проходит серверную проверку и работает без лишних внешних зависимостей.",
    model: "/images/trust-models/php-lead-form.png"
  },
  {
    kicker: "Поиск",
    title: "Закладываем SEO/AEO",
    description: "Готовим сайт к поиску и быстрым AI-ответам: услуги, FAQ, доказательства и сценарии клиента.",
    model: "/images/trust-models/seo-aeo.png"
  },
  {
    kicker: "Мобильный опыт",
    title: "Проектируем сначала телефон",
    description: "Делаем быстрый мобильный путь: услуга, доверие и заявка без лишних шагов и длинных анкет.",
    model: "/images/trust-models/mobile-flow.png"
  },
  {
    kicker: "Передача",
    title: "Отдаём понятную основу",
    description: "Передаём структуру, проект и рекомендации так, чтобы сайт можно было развивать дальше без путаницы.",
    model: "/images/trust-models/site-handoff.png"
  },
  {
    kicker: "Контроль",
    title: "Ведём запуск по шагам",
    description: "Показываем, что уже готово, что влияет на заявку и какие улучшения стоит делать следующим этапом.",
    model: "/images/trust-models/launch-control.png"
  }
];

const serviceModels: Record<string, string> = {
  "auto-service-landing": "/images/service-models/auto-service-landing.png",
  "sto-multipage": "/images/service-models/sto-multipage.png",
  "tire-service": "/images/service-models/tire-service.png",
  detailing: "/images/service-models/detailing.png",
  "body-repair": "/images/service-models/body-repair.png",
  diagnostics: "/images/service-models/diagnostics.png",
  inspection: "/images/service-models/inspection.png",
  "auto-parts": "/images/service-models/auto-parts.png"
};

export default function HomePage() {
  return (
    <>
      <SeoJsonLd id="organization-jsonld" data={organizationJsonLd()} />
      <SeoJsonLd id="website-jsonld" data={websiteJsonLd()} />
      <SeoJsonLd id="service-jsonld" data={serviceJsonLd()} />
      <SeoJsonLd id="faq-jsonld" data={faqJsonLd(faqs)} />
      <GsapScrollExperience />

      <section className="overflow-hidden pb-0 pt-10 md:pt-12" data-gsap-hero>
        <div className="container-page">
          <div className="mx-auto max-w-5xl text-center">
            <h1 className="font-[var(--font-heading)] text-4xl font-black leading-[0.98] text-neutral-950 sm:text-5xl md:text-7xl" data-gsap-hero-item>
              Сайт для автосервиса, который{" "}
              <span className="serif-accent">объясняет и приводит заявки</span>
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-neutral-700 md:text-lg" data-gsap-hero-item>
              Покажем демо под ваш тип сервиса: СТО, шиномонтаж, детейлинг, кузовной ремонт, диагностику или автозапчасти.
            </p>
            <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row" data-gsap-hero-item>
              <CleanAnchorLink href="#lead-form" className="btn-primary">
                Получить демо за сутки
                <ArrowRight aria-hidden="true" size={18} />
              </CleanAnchorLink>
              <Link href="/projects" className="btn-hero-secondary">
                Смотреть 120 кейсов
              </Link>
            </div>
            <div className="mx-auto mt-8 grid max-w-2xl gap-3 sm:grid-cols-3" data-gsap-hero-item>
              {[
                ["за 24 часа", "сделаем первую версию"],
                ["120+", "реализовали проектов"],
                ["0₽", "предоплата за демо"]
              ].map(([value, label]) => (
                <div key={label} className="border-t border-neutral-300 pt-4">
                  <p className="font-[var(--font-heading)] text-3xl font-black text-neutral-950">{value}</p>
                  <p className="mt-1 text-sm font-bold text-neutral-600">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <HeroMockup />

        <div className="reference-proof-strip overflow-hidden" aria-label="Ключевые преимущества" data-gsap-hero-item>
          <div className="reference-marquee flex w-max items-center py-3">
            {[...proofItems, ...proofItems].map((item, index) => (
              <div
                key={`${item}-${index}`}
                className="flex min-h-12 w-[230px] shrink-0 items-center gap-2 px-5 text-sm font-bold text-neutral-700"
                aria-hidden={index >= proofItems.length}
              >
                <CheckCircle2 aria-hidden="true" size={17} className="shrink-0 text-[#ff5a1f]" />
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      <ScrollStackShowcase />

      <Section
        title={
          <>
            Обычный сайт автосервиса часто не объясняет,{" "}
            <span className="serif-accent">почему вам можно доверять</span>
          </>
        }
        answer="Сайт для автосервиса нужен не только для адреса и телефона. Он должен заранее отвечать на вопросы клиента, снижать тревогу перед ремонтом и подводить к понятной записи."
      >
        <div className="problem-horizontal-stage" data-gsap-horizontal-section>
          <div className="problem-horizontal-viewport" data-gsap-horizontal-viewport>
            <div className="problem-horizontal-track" data-gsap-horizontal-track data-gsap-card-group>
              {problemItems.map((item, index) => (
                <article
                  key={item.text}
                  className="surface model-split-card problem-horizontal-card overflow-hidden rounded-lg"
                  data-gsap-card
                  data-gsap-horizontal-card
                >
                  <div className="problem-horizontal-copy">
                    <span className="problem-horizontal-index">0{index + 1}</span>
                    <p className="problem-horizontal-text">
                      {item.text}
                    </p>
                    <div className="problem-horizontal-meta">
                      <p className="problem-horizontal-detail">{item.detail}</p>
                      <div className="problem-horizontal-tags" aria-label="Что важно закрыть на сайте">
                        {item.tags.map((tag) => (
                          <span key={tag} className="problem-horizontal-tag">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="model-split-media">
                    <Image
                      src={item.model}
                      alt=""
                      width={420}
                      height={300}
                      className="model-split-image pointer-events-none"
                      sizes="(min-width: 1024px) 292px, (min-width: 640px) 288px, 250px"
                      aria-hidden="true"
                      unoptimized
                    />
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </Section>

      <Section
        title={
          <>
            Сайт работает как цифровой администратор,{" "}
            <span className="serif-accent">а не как визитка</span>
          </>
        }
        description="Мы проектируем структуру так, чтобы клиент увидел важное до звонка: что вы делаете, как считаете стоимость, почему вам можно доверять и что будет после заявки."
        className="reference-soft-section"
      >
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3" data-gsap-card-group>
          {solutionItems.map((item, index) => (
            <div
              key={item.text}
              className="surface model-split-card solution-model-card overflow-hidden rounded-lg"
              data-gsap-card
            >
              <div className="relative z-10 min-w-0">
                <span className="text-sm font-black text-[#ff5a1f]">0{index + 1}</span>
                <p className="solution-model-text mt-3 max-w-[210px] text-base font-medium leading-7 text-neutral-900">
                  {item.text}
                </p>
              </div>
              <div className="model-split-media">
                <Image
                  src={item.model}
                  alt=""
                  width={420}
                  height={300}
                  className="model-split-image pointer-events-none"
                  sizes="(min-width: 1024px) 292px, (min-width: 640px) 288px, 250px"
                  aria-hidden="true"
                  unoptimized
                />
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section
        id="services"
        eyebrow="Что разрабатываем"
        title={
          <>
            Подбираем формат под тип сервиса,{" "}
            <span className="serif-accent">а не натягиваем один шаблон</span>
          </>
        }
        answer="Лендинг подходит для быстрого запуска одной услуги или направления. Многостраничный сайт нужен, когда услуг много, важны SEO-страницы, города, бренды, FAQ и будущие кейсы."
      >
        <ServicesGrid services={services} serviceModels={serviceModels} />
      </Section>

      <section id="aeo-offer" className="section-y aeo-offer-section text-white" data-gsap-section>
        <div className="container-page">
          <div className="grid gap-8 lg:grid-cols-[0.94fr_1.06fr] lg:items-center" data-gsap-card-group>
            <div className="max-w-2xl" data-gsap-card>
              <p className="inline-flex min-h-9 items-center gap-2 rounded-full border border-white/18 bg-white/10 px-4 py-2 text-xs font-black uppercase text-white/78">
                <Sparkles aria-hidden="true" size={16} className="text-[#ffb08a]" />
                Новый оффер
              </p>
              <h2 className="mt-6 font-[var(--font-heading)] text-3xl font-black leading-[1.02] text-white sm:text-4xl md:text-6xl">
                AEO-оптимизация под быстрые ответы{" "}
                <span className="serif-accent text-[#ffd8c5]">нейросетей</span>
              </h2>
              <p className="mt-6 max-w-xl text-base leading-8 text-white/78 md:text-lg">
                Делаем страницы так, чтобы Google, Яндекс и AI-поиск быстрее понимали ваш сервис:
                что вы ремонтируете, как считается цена, когда нужна диагностика и куда оставить заявку.
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                {["Google", "Яндекс", "AI-поиск", "быстрый ответ"].map((item) => (
                  <span key={item} className="rounded-full border border-white/16 bg-white/10 px-4 py-2 text-sm font-bold text-white/82">
                    {item}
                  </span>
                ))}
              </div>
              <CleanAnchorLink href="#lead-form" className="mt-8 inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-white px-5 py-3 font-black text-neutral-950 transition hover:bg-[#ffd8c5]">
                Добавить AEO в демо
                <ArrowRight aria-hidden="true" size={18} />
              </CleanAnchorLink>
            </div>

            <div className="aeo-answer-panel rounded-lg p-5 sm:p-6" data-gsap-card>
              <div className="flex items-center justify-between gap-4 border-b border-white/12 pb-5">
                <div className="flex items-center gap-3">
                  <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#ff5a1f] text-white">
                    <Bot aria-hidden="true" size={22} />
                  </span>
                  <div>
                    <p className="text-sm font-black text-white">AI answer preview</p>
                    <p className="mt-1 text-xs font-bold text-white/52">как сайт готовит ответ для выдачи</p>
                  </div>
                </div>
                <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-black text-[#ffd8c5]">AEO</span>
              </div>

              <div className="mt-6 rounded-lg border border-white/12 bg-black/24 p-4">
                <p className="flex items-center gap-2 text-xs font-black uppercase text-[#ffb08a]">
                  <MessageSquareQuote aria-hidden="true" size={16} />
                  запрос клиента
                </p>
                <p className="mt-3 font-[var(--font-heading)] text-2xl font-black leading-tight text-white">
                  Почему машина вибрирует на скорости и когда ехать на диагностику?
                </p>
              </div>

              <div className="mt-4 grid gap-3">
                {aeoHighlights.map(([title, text]) => (
                  <div key={title} className="grid gap-3 rounded-lg border border-white/12 bg-white/[0.07] p-4 sm:grid-cols-[1.8rem_1fr]">
                    <SearchCheck aria-hidden="true" className="mt-1 text-[#ff8b57]" size={22} />
                    <div>
                      <h3 className="font-[var(--font-heading)] text-lg font-black text-white">{title}</h3>
                      <p className="mt-1 text-sm leading-6 text-white/68">{text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <Section
        id="process"
        eyebrow="Как работаем"
        title={
          <>
            Сначала собираем смыслы, <span className="serif-accent">потом дизайн и код</span>
          </>
        }
        description="Создаём техническую и смысловую основу для SEO и AEO, чтобы сайт было проще индексировать, расширять и использовать в ответах поисковых и AI-систем."
        className="reference-dark-section text-white"
      >
        <div className="grid gap-4 lg:grid-cols-3" data-gsap-card-group>
          {processItems.map((item, index) => (
            <div key={item} className="surface-dark rounded-lg p-5" data-gsap-card>
              <div className="mb-8 flex items-center justify-between gap-4">
                <span className="font-[var(--font-heading)] text-4xl font-black text-white">0{index + 1}</span>
                <ArrowRight aria-hidden="true" className="text-white/28" size={34} />
              </div>
              <p className="leading-7 text-white/72">{item}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section
        id="examples"
        eyebrow="Рабочие кейсы"
        title={
          <>
            12 рабочих проектов для разных <span className="serif-accent">типов автосервиса</span>
          </>
        }
        description="Показываем не сухую галерею макетов, а рабочие проекты: от лендинга для шиномонтажа до многостраничного сайта СТО с услугами, доверием, заявками и SEO/AEO-структурой."
      >
        <ProjectGrid projects={featuredProjects.slice(0, 12)} compact />
        <div className="mt-8 text-center">
          <Link href="/projects" className="btn-primary">
            Смотреть все 120 кейсов
            <ArrowRight aria-hidden="true" size={18} />
          </Link>
        </div>
      </Section>

      <Section
        id="seo-aeo"
        eyebrow="SEO и AEO"
        title={
          <>
            Структуру для поиска закладываем сразу,{" "}
            <span className="serif-accent">а не добавляем в конце</span>
          </>
        }
        answer="SEO помогает странице быть понятной поисковым системам. AEO помогает давать короткие, точные ответы на вопросы клиентов и владельцев автосервисов."
        className="reference-soft-section"
      >
        <div className="grid md:grid-cols-2 lg:grid-cols-3" data-gsap-card-group>
          {seoAeoCards.map(([title, text]) => (
            <div key={title} className="orbix-feature-cell" data-gsap-card>
              <ClipboardList aria-hidden="true" className="mx-auto mb-5 text-neutral-950" size={28} />
              <h3 className="font-[var(--font-heading)] text-xl font-black text-neutral-950">{title}</h3>
              <p className="mx-auto mt-3 max-w-xs text-sm leading-6 text-neutral-700">{text}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section
        title={
          <>
            Почему с нами сайт запускается быстрее,{" "}
            <span className="serif-accent">и сразу работает на заявку</span>
          </>
        }
        description="Мы не просто рисуем красивую страницу. Собираем структуру, тексты, заявку, SEO/AEO-основу и мобильный сценарий так, чтобы сайт помогал владельцу и администратору."
        className="reference-dark-section text-white"
      >
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3" data-gsap-card-group>
          {advantageItems.map((item) => (
            <div key={item.title} className="surface card-hover group flex min-h-[410px] flex-col overflow-hidden rounded-lg" data-gsap-card>
              <div className="trust-model-stage bg-[#f4f5f6]">
                <Image
                  src={item.model}
                  alt=""
                  width={520}
                  height={380}
                  className="trust-model-image pointer-events-none transition-transform duration-300 group-hover:scale-[1.03]"
                  sizes="(min-width: 1024px) 28vw, (min-width: 768px) 44vw, 90vw"
                  aria-hidden="true"
                  unoptimized
                />
                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-white/70 to-transparent" />
              </div>
              <div className="flex flex-1 flex-col p-6">
                <p className="text-sm font-black text-[#ff5a1f]">{item.kicker}</p>
                <h3 className="mt-3 font-[var(--font-heading)] text-2xl font-black leading-tight text-neutral-950">
                  {item.title}
                </h3>
                <p className="mt-4 text-base leading-7 text-neutral-600">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </Section>

      <section id="faq" className="section-y orbix-faq-band" data-gsap-section>
        <div className="container-page grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
          <div data-gsap-section-head>
            <p className="eyebrow">FAQ</p>
            <h2 className="mt-5 max-w-lg font-[var(--font-heading)] text-3xl font-black leading-[1.05] text-neutral-950 md:text-5xl">
              Короткие ответы <span className="serif-accent">на вопросы владельцев автосервисов</span>
            </h2>
            <p className="mt-5 max-w-md leading-7 text-neutral-700">
              Если ответа нет в списке, оставьте заявку: уточним направление, город и покажем подходящий формат демо.
            </p>
            <div className="surface mt-8 max-w-sm rounded-lg p-5">
              <p className="text-sm font-black text-neutral-950">Нужна быстрая консультация?</p>
              <p className="mt-2 text-sm leading-6 text-neutral-600">
                Разберём услуги и подскажем, какой формат сайта стоит запускать первым.
              </p>
              <CleanAnchorLink href="#lead-form" className="btn-primary mt-5 !min-h-10 px-4 py-2 text-sm">
                Оставить заявку
                <ArrowRight aria-hidden="true" size={16} />
              </CleanAnchorLink>
            </div>
          </div>
          <FAQ items={faqs} />
        </div>
      </section>

      <CTASection
        title="Получите демо-версию сайта за сутки"
        text="Оставьте заявку — уточним направление, услуги и город, после чего покажем демо-версию без предоплаты и обязательств."
        submitLabel="Получить демо за сутки"
        source="home-final"
      />
    </>
  );
}
