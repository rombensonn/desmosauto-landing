import Image from "next/image";
import { ArrowRight, CheckCircle2, ClipboardList, MessageCircleQuestion, Route, SearchCheck } from "lucide-react";
import { CleanAnchorLink } from "@/components/CleanAnchorLink";
import { CTASection } from "@/components/CTASection";
import { FAQ } from "@/components/FAQ";
import { SeoJsonLd } from "@/components/SeoJsonLd";
import { breadcrumbJsonLd, createPageMetadata, faqJsonLd, siteConfig } from "@/lib/seo";
import { assetPath } from "@/lib/site-paths";
import { ScrollAnimate } from "./ScrollAnimate";

export const metadata = createPageMetadata({
  title: "AEO для сайта автосервиса: ответы для людей и AI-поиска",
  description:
    "Как AEO помогает сайту автосервиса давать понятные ответы о симптомах, услугах, цене, сроках, гарантии и записи без обещаний гарантированной выдачи.",
  path: "/aeo"
});

const methodSteps = [
  "Формулируем вопросы клиентов по симптомам, услугам, цене, срокам и гарантии.",
  "Собираем короткие ответы, которые можно прочитать до звонка с телефона.",
  "Связываем услуги, FAQ, кейсы и форму заявки в один понятный путь.",
  "Добавляем schema.org для страницы, FAQ и хлебных крошек там, где это уместно.",
  "Проверяем мобильный путь от ответа к заявке, чтобы человек не терял следующий шаг."
];

const websiteBenefits = [
  {
    title: "Понятная семантика",
    text: "Страница объясняет сущности: услуга, симптом, ограничение, доказательство и действие."
  },
  {
    title: "FAQPage JSON-LD",
    text: "Частые вопросы получают разметку, которая помогает поисковым системам читать структуру ответа."
  },
  {
    title: "Быстрые ответы",
    text: "Клиент быстрее находит базовую информацию и понимает, стоит ли оставлять заявку."
  },
  {
    title: "Более точные обращения",
    text: "В заявке чаще есть контекст: проблема, услуга, ожидания по срокам и подготовке."
  },
  {
    title: "Меньше повторных звонков",
    text: "Администратор реже объясняет одно и то же, если сайт уже закрыл простые вопросы."
  }
];

const autoServiceUseCases = [
  ["Симптом", "Что может означать вибрация, шум, стук, запах или ошибка на панели."],
  ["Услуга", "Когда нужна диагностика, ремонт, шиномонтаж, детейлинг или кузовная работа."],
  ["Цена", "От чего зависит расчет и почему итог может отличаться после осмотра."],
  ["Срок", "Что обычно влияет на длительность работы и наличие запчастей."],
  ["Гарантия", "Какие условия стоит объяснить до визита, чтобы снизить тревогу."],
  ["Подготовка", "Какие фото, документы или признаки проблемы помогут мастеру быстрее начать."],
  ["Запись", "Куда нажать после ответа и какие данные нужны для первого контакта."]
];

const matrixRows = [
  {
    question: "Почему машину ведет в сторону после замены шин?",
    answer: "Причина может быть в давлении, износе, балансировке или углах установки колес.",
    proof: "Показываем диагностику, условия проверки и ограничения без удаленного диагноза.",
    next: "Записаться на осмотр ходовой и колес."
  },
  {
    question: "Сколько времени занимает полировка кузова?",
    answer: "Срок зависит от состояния лака, площади работ и выбранного пакета.",
    proof: "Добавляем фото этапов, состав услуги и примеры похожих работ.",
    next: "Отправить фото кузова для оценки."
  },
  {
    question: "Можно ли понять цену ремонта до визита?",
    answer: "Можно дать вилку или принцип расчета, точная сумма обычно требует диагностики.",
    proof: "Объясняем, какие факторы меняют стоимость и что входит в первичный расчет.",
    next: "Оставить телефон и описать проблему."
  }
];

const faqItems = [
  {
    question: "Что такое AEO для сайта автосервиса?",
    answer:
      "AEO помогает странице отвечать на конкретные вопросы клиента: что случилось, какая услуга нужна, от чего зависит цена, сколько ждать и как записаться."
  },
  {
    question: "Чем AEO отличается от SEO?",
    answer:
      "SEO шире работает с видимостью сайта в поиске. AEO фокусируется на коротких, самодостаточных ответах, которые понятны человеку и системам ответа."
  },
  {
    question: "Нужно ли AEO маленькому автосервису?",
    answer:
      "Да, если клиенты часто задают одинаковые вопросы о симптомах, ценах, сроках, гарантии и подготовке к визиту."
  },
  {
    question: "AEO гарантирует попадание в AI-поиск?",
    answer:
      "Нет. Мы не обещаем гарантированное включение в AI-ответы. Мы делаем структуру, тексты и разметку более понятными для обработки."
  },
  {
    question: "Какие блоки нужны для AEO-страницы?",
    answer:
      "Нужны вопросы клиентов, короткие ответы, доказательства, ссылки на услуги или кейсы, FAQ-разметка и понятный следующий шаг к заявке."
  },
  {
    question: "Можно ли добавить AEO к существующему сайту?",
    answer:
      "Да. Обычно начинают с аудита услуг и FAQ, затем переписывают ответы, добавляют schema.org и проверяют мобильный путь к заявке."
  },
  {
    question: "Какие вопросы лучше выносить в FAQ?",
    answer:
      "Выносите вопросы, которые клиент задает до записи: симптомы, цену, сроки, гарантию, подготовку, порядок диагностики и способы связи."
  },
  {
    question: "Как понять, что AEO-блоки написаны хорошо?",
    answer:
      "Хороший блок отвечает прямо, не обещает невозможного, дает ограничение, подтверждение и понятный следующий шаг для клиента."
  }
];

function aeoWebPageJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "AEO для сайта автосервиса",
    url: `${siteConfig.url}/aeo`,
    inLanguage: "ru-RU",
    description:
      "Страница о том, как AEO помогает сайтам автосервисов давать понятные ответы людям, поисковым системам и AI-поиску.",
    isPartOf: {
      "@type": "WebSite",
      name: siteConfig.name,
      url: siteConfig.url
    },
    about: {
      "@type": "Thing",
      name: "Answer Engine Optimization для сайтов автосервисов"
    },
    publisher: {
      "@type": "Organization",
      name: siteConfig.name,
      url: siteConfig.url
    }
  };
}

export default function AeoPage() {
  return (
    <>
      <SeoJsonLd id="aeo-webpage-jsonld" data={aeoWebPageJsonLd()} />
      <SeoJsonLd id="aeo-faq-jsonld" data={faqJsonLd(faqItems)} />
      <SeoJsonLd
        id="aeo-breadcrumb-jsonld"
        data={breadcrumbJsonLd([
          { name: "Главная", path: "/" },
          { name: "AEO", path: "/aeo" }
        ])}
      />

      <section className="overflow-hidden bg-white py-10 md:py-14">
        <div className="container-page grid gap-8 lg:grid-cols-[0.96fr_1.04fr] lg:items-center">
          <ScrollAnimate threshold={0.05} className="max-w-3xl">
            <p className="eyebrow">AEO для автосервиса</p>
            <h1 className="mt-5 font-[var(--font-heading)] text-4xl font-black leading-[1.02] text-neutral-950 sm:text-5xl lg:text-6xl">
              AEO для сайта автосервиса: ответы, которые понимают люди и AI-поиск
            </h1>
            <p className="mt-5 max-w-xl text-base leading-8 text-neutral-700 md:text-lg">
              Структурируем услуги, FAQ и доказательства так, чтобы клиент быстрее понял следующий шаг.
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <CleanAnchorLink href="#lead-form" className="btn-primary whitespace-nowrap">
                Получить демо
                <ArrowRight aria-hidden="true" size={18} />
              </CleanAnchorLink>
              <CleanAnchorLink href="#aeo-faq" className="btn-hero-secondary whitespace-nowrap">
                Читать FAQ
              </CleanAnchorLink>
            </div>
          </ScrollAnimate>

          <ScrollAnimate animation="zoomIn" delay={120} threshold={0.05} className="aeo-hero-visual rounded-lg p-4 text-white sm:p-5">
            <div className="aeo-answer-panel rounded-lg p-4 sm:p-5">
              <div className="grid gap-4 md:grid-cols-[1fr_0.9fr] md:items-center">
                <div>
                  <div className="flex items-center gap-3 border-b border-white/12 pb-4">
                    <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#ff5a1f] text-white">
                      <SearchCheck aria-hidden="true" size={22} />
                    </span>
                    <div>
                      <p className="text-sm font-black text-white">Ответ на сайте</p>
                      <p className="mt-1 text-xs font-bold text-white/56">вопрос, ответ, доказательство, заявка</p>
                    </div>
                  </div>
                  <div className="mt-5 rounded-lg border border-white/12 bg-black/24 p-4">
                    <p className="text-xs font-black text-[#ffb08a]">Вопрос клиента</p>
                    <p className="mt-2 font-[var(--font-heading)] text-2xl font-black leading-tight text-white">
                      Когда нужна диагностика ходовой?
                    </p>
                    <p className="mt-3 text-sm leading-6 text-white/72">
                      Если есть стук, вибрация, увод автомобиля или неравномерный износ шин, стоит начать с осмотра.
                    </p>
                  </div>
                </div>
                <div className="relative min-h-[220px] overflow-hidden rounded-lg border border-white/12 bg-white">
                  <Image
                    src={assetPath("/images/trust-models/seo-aeo.webp")}
                    alt="Схема AEO-структуры для сайта автосервиса"
                    fill
                    priority
                    sizes="(min-width: 1024px) 34vw, 90vw"
                    className="object-contain p-4"
                    unoptimized
                  />
                </div>
              </div>
            </div>
          </ScrollAnimate>
        </div>
      </section>

      <section className="section-y">
        <div className="container-page grid gap-8 lg:grid-cols-[0.92fr_1.08fr] lg:items-start">
          <ScrollAnimate>
            <h2 className="max-w-xl font-[var(--font-heading)] text-3xl font-black leading-[1.08] text-neutral-950 md:text-5xl">
              Что такое AEO и чем оно отличается от <span className="serif-accent">SEO</span>
            </h2>
            <p className="mt-5 max-w-xl text-lg leading-8 text-neutral-700">
              SEO помогает странице быть понятной для поиска в целом. AEO собирает ответы так, чтобы человек и AI-поиск быстрее извлекали суть без лишнего перехода между блоками.
            </p>
          </ScrollAnimate>
          <div className="grid gap-4 sm:grid-cols-2">
            <ScrollAnimate as="article" animation="zoomIn" className="surface rounded-lg p-5">
              <ClipboardList aria-hidden="true" size={28} className="text-[#ff5a1f]" />
              <h3 className="mt-5 font-[var(--font-heading)] text-2xl font-black text-neutral-950">SEO</h3>
              <p className="mt-3 leading-7 text-neutral-700">
                Работает с индексируемостью, структурой страниц, заголовками, контентом, скоростью и связями внутри сайта.
              </p>
            </ScrollAnimate>
            <ScrollAnimate as="article" animation="zoomIn" delay={120} className="surface rounded-lg border-[#ffccb8] bg-[#fff7f2] p-5">
              <MessageCircleQuestion aria-hidden="true" size={28} className="text-[#ff5a1f]" />
              <h3 className="mt-5 font-[var(--font-heading)] text-2xl font-black text-neutral-950">AEO</h3>
              <p className="mt-3 leading-7 text-neutral-700">
                Работает с форматом ответа: вопрос клиента, короткое объяснение, ограничение, подтверждение и следующий шаг.
              </p>
            </ScrollAnimate>
          </div>
        </div>
      </section>

      <section className="section-y reference-soft-section">
        <div className="container-page">
          <ScrollAnimate className="max-w-3xl">
            <h2 className="font-[var(--font-heading)] text-3xl font-black leading-[1.08] text-neutral-950 md:text-5xl">
              Как ДесмосАвто работает с AEO
            </h2>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-neutral-700">
              Мы не добавляем блок FAQ в конце проекта ради галочки. Сначала собираем реальные вопросы, потом связываем ответы с услугами, доказательствами и формой заявки.
            </p>
          </ScrollAnimate>
          <div className="mt-10 grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
            <ScrollAnimate className="surface rounded-lg p-5 md:p-7">
              <div className="grid gap-4">
                {methodSteps.map((step, index) => (
                  <div key={step} className="grid gap-4 border-b border-neutral-200 pb-4 last:border-b-0 last:pb-0 sm:grid-cols-[3rem_1fr]">
                    <span className="font-[var(--font-heading)] text-3xl font-black text-[#ff5a1f]">0{index + 1}</span>
                    <p className="text-base font-bold leading-7 text-neutral-800">{step}</p>
                  </div>
                ))}
              </div>
            </ScrollAnimate>
            <ScrollAnimate animation="zoomIn" delay={120} className="relative min-h-[360px] overflow-hidden rounded-lg border border-neutral-200 bg-white">
              <Image
                src={assetPath("/images/solution-models-uniform/simple-services.webp")}
                alt="Структура услуг автосервиса с короткими ответами"
                fill
                sizes="(min-width: 1024px) 32vw, 90vw"
                className="object-contain p-6"
                unoptimized
              />
            </ScrollAnimate>
          </div>
        </div>
      </section>

      <section className="section-y bg-white">
        <div className="container-page">
          <ScrollAnimate as="h2" className="max-w-3xl font-[var(--font-heading)] text-3xl font-black leading-[1.08] text-neutral-950 md:text-5xl">
            Почему AEO помогает сайту быть понятнее
          </ScrollAnimate>
          <div className="mt-10 grid gap-4 lg:grid-cols-[1fr_1fr_1fr]">
            {websiteBenefits.map((item, index) => (
              <ScrollAnimate
                as="article"
                key={item.title}
                animation={index === 0 ? "bounceIn" : "fadeInUp"}
                delay={index * 80}
                className={`rounded-lg border border-neutral-200 p-5 ${
                  index === 0 ? "bg-neutral-950 text-white lg:row-span-2" : "bg-white text-neutral-950"
                }`}
              >
                <CheckCircle2 aria-hidden="true" size={24} className={index === 0 ? "text-[#ff8b57]" : "text-[#ff5a1f]"} />
                <h3 className="mt-5 font-[var(--font-heading)] text-xl font-black">{item.title}</h3>
                <p className={`mt-3 leading-7 ${index === 0 ? "text-white/72" : "text-neutral-700"}`}>{item.text}</p>
              </ScrollAnimate>
            ))}
          </div>
        </div>
      </section>

      <section className="section-y reference-dark-section text-white">
        <div className="container-page grid gap-10 lg:grid-cols-[0.76fr_1.24fr] lg:items-start">
          <ScrollAnimate>
            <h2 className="font-[var(--font-heading)] text-3xl font-black leading-[1.08] md:text-5xl">
              Почему это особенно важно для сайта автосервиса
            </h2>
            <p className="mt-5 max-w-lg text-lg leading-8 text-white/72">
              Клиент приходит не с термином услуги, а с проблемой. AEO помогает перевести симптом в понятный путь: объяснение, проверка, цена, срок, гарантия, запись.
            </p>
          </ScrollAnimate>
          <div className="grid gap-3 sm:grid-cols-2">
            {autoServiceUseCases.map(([title, text], index) => (
              <ScrollAnimate as="article" key={title} delay={index * 55} className="surface-dark rounded-lg p-5">
                <h3 className="font-[var(--font-heading)] text-xl font-black text-white">{title}</h3>
                <p className="mt-3 text-sm leading-6 text-white/68">{text}</p>
              </ScrollAnimate>
            ))}
          </div>
        </div>
      </section>

      <section id="aeo-matrix" className="section-y">
        <div className="container-page">
          <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
            <ScrollAnimate>
              <h2 className="font-[var(--font-heading)] text-3xl font-black leading-[1.08] text-neutral-950 md:text-5xl">
                Что получает страница: компактная матрица AEO-блоков
              </h2>
              <p className="mt-5 max-w-lg text-lg leading-8 text-neutral-700">
                Каждый блок отвечает на конкретный вопрос, добавляет ограничение или доказательство и ведет к следующему действию.
              </p>
            </ScrollAnimate>
            <ScrollAnimate className="overflow-hidden rounded-lg border border-neutral-200 bg-white shadow-[var(--shadow-saas-soft)]">
              <div className="hidden bg-neutral-950 px-4 py-3 text-xs font-black text-white md:grid md:grid-cols-4">
                <span>Вопрос</span>
                <span>Ответ</span>
                <span>Доказательство</span>
                <span>Шаг</span>
              </div>
              {matrixRows.map((row) => (
                <article key={row.question} className="grid gap-3 border-t border-neutral-200 p-4 text-sm leading-6 md:grid-cols-4">
                  <p className="font-black text-neutral-950">
                    <span className="mb-1 block text-[0.68rem] font-black uppercase tracking-[0.08em] text-neutral-500 md:hidden">Вопрос</span>
                    {row.question}
                  </p>
                  <p className="text-neutral-700">
                    <span className="mb-1 block text-[0.68rem] font-black uppercase tracking-[0.08em] text-neutral-500 md:hidden">Ответ</span>
                    {row.answer}
                  </p>
                  <p className="text-neutral-700">
                    <span className="mb-1 block text-[0.68rem] font-black uppercase tracking-[0.08em] text-neutral-500 md:hidden">Доказательство</span>
                    {row.proof}
                  </p>
                  <p className="font-bold text-[#e44810]">
                    <span className="mb-1 block text-[0.68rem] font-black uppercase tracking-[0.08em] text-neutral-500 md:hidden">Шаг</span>
                    {row.next}
                  </p>
                </article>
              ))}
            </ScrollAnimate>
          </div>
        </div>
      </section>

      <section id="aeo-faq" className="section-y reference-soft-section">
        <div className="container-page grid gap-10 lg:grid-cols-[0.82fr_1.18fr] lg:items-start">
          <ScrollAnimate>
            <p className="eyebrow">FAQ</p>
            <h2 className="mt-5 max-w-lg font-[var(--font-heading)] text-3xl font-black leading-[1.08] text-neutral-950 md:text-5xl">
              AEO FAQ для владельца автосервиса
            </h2>
            <p className="mt-5 max-w-md leading-7 text-neutral-700">
              Вопросы ниже написаны как самостоятельные ответы, чтобы они были полезны и человеку, и поисковым системам.
            </p>
            <div className="surface mt-8 max-w-sm rounded-lg p-5">
              <Route aria-hidden="true" size={26} className="text-[#ff5a1f]" />
              <p className="mt-4 text-sm font-black text-neutral-950">Главный принцип</p>
              <p className="mt-2 text-sm leading-6 text-neutral-600">
                Не обещать результат выдачи, а сделать страницу ясной, проверяемой и удобной для заявки.
              </p>
            </div>
          </ScrollAnimate>
          <ScrollAnimate>
            <FAQ items={faqItems} />
          </ScrollAnimate>
        </div>
      </section>

      <ScrollAnimate threshold={0.08}>
        <CTASection
          title="Получите демо сайта с AEO-структурой"
          text="Оставьте заявку, уточним услуги автосервиса и покажем демо-страницу, где ответы, FAQ, доказательства и форма связаны в один путь."
          submitLabel="Получить демо"
          source="aeo-page"
        />
      </ScrollAnimate>
    </>
  );
}
