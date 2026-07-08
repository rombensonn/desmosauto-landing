import type { CSSProperties } from "react";
import Image from "next/image";
import { ArrowRight, Gauge, Layers3, MessageCircle, Route, type LucideIcon } from "lucide-react";
import { CleanAnchorLink } from "@/components/CleanAnchorLink";
import { assetPath } from "@/lib/site-paths";

type StackLayer = {
  tag: string;
  title: string;
  text: string;
  points: string[];
  image: string;
  icon: LucideIcon;
};

const stackLayers: StackLayer[] = [
  {
    tag: "Вопрос клиента",
    title: "Сначала снимаем тревогу перед звонком",
    text: "Первый слой страницы объясняет симптомы, услуги и следующий шаг без длинных формулировок.",
    points: ["понятная услуга", "цена или принцип расчёта", "быстрый путь к записи"],
    image: "/images/problem-models-uniform/unclear-estimate.png",
    icon: MessageCircle
  },
  {
    tag: "Доверие",
    title: "Показываем доказательства до заявки",
    text: "Следующий слой добавляет фото работ, гарантии, опыт и ответы на частые сомнения владельца авто.",
    points: ["фото и кейсы", "гарантии", "ответы на возражения"],
    image: "/images/solution-models-uniform/trust-package.png",
    icon: Layers3
  },
  {
    tag: "Маршрут",
    title: "Ведём человека через сайт без лишних развилок",
    text: "Структура соединяет услуги, FAQ, кейсы и форму так, чтобы клиент не терялся между блоками.",
    points: ["услуги связаны с FAQ", "кейсы ведут к заявке", "CTA не спорят между собой"],
    image: "/images/trust-models/service-structure.png",
    icon: Route
  },
  {
    tag: "Заявка",
    title: "Финальный слой собирает короткое обращение",
    text: "Форма просит только имя и телефон, а администратор получает более подготовленный контакт.",
    points: ["имя и телефон", "серверная проверка", "понятный источник заявки"],
    image: "/images/solution-models-uniform/short-lead-form.png",
    icon: Gauge
  }
];

export function ScrollStackShowcase() {
  return (
    <section className="scroll-stack-section" aria-labelledby="scroll-stack-title">
      <div className="container-page">
        <div className="scroll-stack-header">
          <p className="scroll-stack-kicker">Тестовый сценарий</p>
          <h2 id="scroll-stack-title" className="font-[var(--font-heading)] text-3xl font-black leading-[1.05] text-neutral-950 md:text-5xl">
            Страница раскрывается слоями, <span className="serif-accent">как путь клиента к заявке</span>
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-neutral-700 md:text-lg">
            Каждый экран держит один смысл: вопрос, доверие, маршрут и короткое обращение в автосервис.
          </p>
        </div>

        <div className="scroll-stack-list">
          {stackLayers.map((layer, index) => {
            const Icon = layer.icon;

            return (
              <article
                key={layer.title}
                className={`scroll-stack-card scroll-stack-card-${index + 1}`}
                style={{ "--stack-index": index } as CSSProperties}
              >
                <div className="scroll-stack-copy">
                  <div className="scroll-stack-meta">
                    <span className="scroll-stack-icon">
                      <Icon aria-hidden="true" size={20} />
                    </span>
                    <span className="scroll-stack-tag">{layer.tag}</span>
                  </div>
                  <h3 className="font-[var(--font-heading)] text-3xl font-black leading-[1.04] text-neutral-950 md:text-5xl">
                    {layer.title}
                  </h3>
                  <p className="mt-5 max-w-xl text-base leading-8 text-neutral-700 md:text-lg">{layer.text}</p>
                  <ul className="scroll-stack-points" aria-label={`Ключевые элементы: ${layer.tag}`}>
                    {layer.points.map((point) => (
                      <li key={point}>{point}</li>
                    ))}
                  </ul>
                  {index === stackLayers.length - 1 ? (
                    <CleanAnchorLink href="#lead-form" className="btn-primary mt-7">
                      Получить демо за сутки
                      <ArrowRight aria-hidden="true" size={18} />
                    </CleanAnchorLink>
                  ) : null}
                </div>

                <div className="scroll-stack-media">
                  <Image
                    src={assetPath(layer.image)}
                    alt=""
                    width={640}
                    height={460}
                    className="scroll-stack-image"
                    sizes="(min-width: 1024px) 42vw, (min-width: 768px) 58vw, 86vw"
                    aria-hidden="true"
                    unoptimized
                  />
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
