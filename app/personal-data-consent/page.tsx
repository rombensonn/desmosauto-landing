import Link from "next/link";
import { personalDataOperator } from "@/lib/operator";
import { createPageMetadata, siteConfig } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "Согласие на обработку персональных данных | ДесмосАвто",
  description:
    "Согласие пользователя сайта ДесмосАвто на обработку персональных данных при отправке заявки.",
  path: "/personal-data-consent"
});

export default function PersonalDataConsentPage() {
  return (
    <section className="section-y">
      <div className="container-page">
        <article className="surface mx-auto max-w-4xl rounded-lg p-6 md:p-10">
          <p className="eyebrow">Редакция от 06.07.2026</p>
          <h1 className="mt-5 break-words font-[var(--font-heading)] text-2xl font-black leading-tight text-slate-950 sm:text-3xl md:text-5xl">
            Согласие на обработку персональных данных
          </h1>

          <div className="mt-8 grid gap-8 leading-7 text-slate-700">
            <section>
              <h2 className="font-[var(--font-heading)] text-2xl font-bold text-slate-950">1. Субъект согласия</h2>
              <p className="mt-3">
                Пользователь сайта {siteConfig.name}, заполняющий форму заявки и ставящий отметку напротив настоящего
                согласия, свободно, своей волей и в своём интересе даёт согласие{" "}
                {personalDataOperator.dativeName}, ОГРНИП {personalDataOperator.ogrnip}, ИНН{" "}
                {personalDataOperator.inn}, адрес регистрации: {personalDataOperator.address} (далее: Оператор) на
                обработку персональных данных.
              </p>
            </section>

            <section>
              <h2 className="font-[var(--font-heading)] text-2xl font-bold text-slate-950">
                2. Персональные данные
              </h2>
              <p className="mt-3">
                Согласие распространяется на следующие персональные данные: имя, номер телефона, источник формы на
                сайте, дата и время отправки заявки, а также технические сведения, необходимые для защиты формы от
                спама и подтверждения факта отправки заявки.
              </p>
            </section>

            <section>
              <h2 className="font-[var(--font-heading)] text-2xl font-bold text-slate-950">
                3. Цели обработки
              </h2>
              <p className="mt-3">
                Персональные данные обрабатываются для приёма и обработки заявки, обратной связи с пользователем,
                уточнения направления автосервиса, услуг и города, а также для подготовки демо-версии сайта по запросу
                пользователя.
              </p>
            </section>

            <section>
              <h2 className="font-[var(--font-heading)] text-2xl font-bold text-slate-950">
                4. Действия с персональными данными
              </h2>
              <p className="mt-3">
                Пользователь соглашается на сбор, запись, систематизацию, накопление, хранение, уточнение, использование,
                обезличивание, блокирование, удаление и уничтожение персональных данных.
              </p>
            </section>

            <section>
              <h2 className="font-[var(--font-heading)] text-2xl font-bold text-slate-950">
                5. Способ обработки
              </h2>
              <p className="mt-3">
                Обработка персональных данных может осуществляться с использованием средств автоматизации и без
                использования таких средств.
              </p>
            </section>

            <section>
              <h2 className="font-[var(--font-heading)] text-2xl font-bold text-slate-950">
                6. Срок действия согласия
              </h2>
              <p className="mt-3">
                Согласие действует до достижения целей обработки персональных данных либо до его отзыва пользователем,
                если иной срок не предусмотрен законом.
              </p>
            </section>

            <section>
              <h2 className="font-[var(--font-heading)] text-2xl font-bold text-slate-950">
                7. Отзыв согласия
              </h2>
              <p className="mt-3">
                Пользователь вправе отозвать согласие на обработку персональных данных. Для отзыва согласия пользователь
                может обратиться к Оператору по телефону {personalDataOperator.phone}. После получения отзыва Оператор
                прекращает обработку персональных данных, если отсутствуют иные законные основания для обработки.
              </p>
            </section>
          </div>

          <div className="mt-10 rounded-lg border border-[#ff5a1f]/14 bg-[#fff0e8] p-5 text-sm leading-6 text-slate-700">
            <p>
              Обработка персональных данных также описана в{" "}
              <Link className="font-bold text-[#a33510] underline underline-offset-4" href="/privacy-policy">
                Политике конфиденциальности и обработки персональных данных
              </Link>
              .
            </p>
          </div>
        </article>
      </div>
    </section>
  );
}
