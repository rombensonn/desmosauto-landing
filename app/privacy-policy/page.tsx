import Link from "next/link";
import { personalDataOperator } from "@/lib/operator";
import { createPageMetadata, siteConfig } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "Политика конфиденциальности и обработки персональных данных | ДесмосАвто",
  description:
    "Политика конфиденциальности и обработки персональных данных пользователей сайта ДесмосАвто.",
  path: "/privacy-policy"
});

export default function PrivacyPolicyPage() {
  return (
    <section className="section-y">
      <div className="container-page">
        <article className="surface mx-auto max-w-4xl rounded-lg p-6 md:p-10">
          <p className="eyebrow">Редакция от 06.07.2026</p>
          <h1 className="mt-5 break-words font-[var(--font-heading)] text-2xl font-black leading-tight text-slate-950 sm:text-3xl md:text-5xl">
            Политика конфиденциальности и обработки персональных данных
          </h1>

          <div className="mt-8 grid gap-8 leading-7 text-slate-700">
            <section>
              <h2 className="font-[var(--font-heading)] text-2xl font-bold text-slate-950">1. Общие положения</h2>
              <p className="mt-3">
                Настоящая политика определяет порядок обработки персональных данных пользователей сайта
                {` ${siteConfig.name}`}. Оператором персональных данных является {personalDataOperator.fullName},
                ОГРНИП {personalDataOperator.ogrnip}, ИНН {personalDataOperator.inn}, адрес регистрации:{" "}
                {personalDataOperator.address} (далее: Оператор).
              </p>
              <p className="mt-3">
                Использование сайта и отправка формы заявки означает, что пользователь ознакомился с настоящей
                политикой. Отдельное согласие на обработку персональных данных оформляется пользователем перед
                отправкой заявки.
              </p>
            </section>

            <section>
              <h2 className="font-[var(--font-heading)] text-2xl font-bold text-slate-950">
                2. Какие данные обрабатываются
              </h2>
              <p className="mt-3">
                При отправке заявки Оператор обрабатывает имя пользователя, номер телефона, источник формы на сайте,
                дату и время отправки заявки, а также технические сведения, необходимые для защиты формы от спама и
                подтверждения факта отправки заявки.
              </p>
              <p className="mt-3">
                Оператор не запрашивает специальные категории персональных данных и биометрические персональные данные.
              </p>
            </section>

            <section>
              <h2 className="font-[var(--font-heading)] text-2xl font-bold text-slate-950">
                3. Цели обработки данных
              </h2>
              <p className="mt-3">
                Персональные данные используются для обработки входящей заявки, обратной связи с пользователем,
                уточнения направления автосервиса, услуг и города, а также для подготовки демо-версии сайта по запросу
                пользователя.
              </p>
            </section>

            <section>
              <h2 className="font-[var(--font-heading)] text-2xl font-bold text-slate-950">
                4. Правовые основания обработки
              </h2>
              <p className="mt-3">
                Обработка персональных данных осуществляется на основании согласия пользователя на обработку
                персональных данных, а также для совершения действий по запросу пользователя до заключения договора.
              </p>
            </section>

            <section>
              <h2 className="font-[var(--font-heading)] text-2xl font-bold text-slate-950">
                5. Действия с персональными данными
              </h2>
              <p className="mt-3">
                Оператор может совершать с персональными данными следующие действия: сбор, запись, систематизация,
                накопление, хранение, уточнение, использование, обезличивание, блокирование, удаление и уничтожение.
              </p>
            </section>

            <section>
              <h2 className="font-[var(--font-heading)] text-2xl font-bold text-slate-950">
                6. Срок хранения и удаление данных
              </h2>
              <p className="mt-3">
                Персональные данные хранятся до достижения целей обработки либо до отзыва согласия пользователем, если
                иной срок хранения не требуется по закону. После достижения целей обработки данные удаляются или
                обезличиваются.
              </p>
            </section>

            <section>
              <h2 className="font-[var(--font-heading)] text-2xl font-bold text-slate-950">
                7. Права пользователя
              </h2>
              <p className="mt-3">
                Пользователь вправе получать сведения об обработке своих персональных данных, требовать их уточнения,
                блокирования или уничтожения, а также отозвать согласие на обработку персональных данных. Для обращения
                к Оператору пользователь может использовать форму обратной связи на сайте.
              </p>
            </section>

            <section>
              <h2 className="font-[var(--font-heading)] text-2xl font-bold text-slate-950">
                8. Защита персональных данных
              </h2>
              <p className="mt-3">
                Оператор принимает необходимые организационные и технические меры для защиты персональных данных от
                неправомерного или случайного доступа, уничтожения, изменения, блокирования, копирования,
                предоставления, распространения и иных неправомерных действий.
              </p>
            </section>

            <section>
              <h2 className="font-[var(--font-heading)] text-2xl font-bold text-slate-950">
                9. Контакты Оператора
              </h2>
              <p className="mt-3">
                По вопросам обработки персональных данных, уточнения, блокирования, удаления данных или отзыва согласия
                пользователь может обратиться к Оператору по телефону {personalDataOperator.phone}.
              </p>
            </section>

            <section>
              <h2 className="font-[var(--font-heading)] text-2xl font-bold text-slate-950">
                10. Изменение политики
              </h2>
              <p className="mt-3">
                Оператор вправе обновлять настоящую политику. Актуальная редакция размещается на этой странице.
              </p>
            </section>
          </div>

          <div className="mt-10 rounded-lg border border-[#ff5a1f]/14 bg-[#fff0e8] p-5 text-sm leading-6 text-slate-700">
            <p>
              Также перед отправкой заявки пользователь оформляет отдельное{" "}
              <Link className="font-bold text-[#a33510] underline underline-offset-4" href="/personal-data-consent">
                согласие на обработку персональных данных
              </Link>
              .
            </p>
          </div>
        </article>
      </div>
    </section>
  );
}
