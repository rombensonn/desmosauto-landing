import { LeadForm } from "@/components/LeadForm";
import Image from "next/image";
import { assetPath } from "@/lib/site-paths";

type CTASectionProps = {
  title: string;
  text: string;
  submitLabel?: string;
  source: string;
};

const ctaBenefits = [
  {
    label: "Уточним направление",
    icon: "/images/cta-icons/lead-direction.png"
  },
  {
    label: "Покажем демо за сутки",
    icon: "/images/cta-icons/lead-demo.png"
  },
  {
    label: "Без предоплаты",
    icon: "/images/cta-icons/lead-prepay.png"
  }
];

export function CTASection({ title, text, submitLabel, source }: CTASectionProps) {
  return (
    <section id="lead-form" className="section-y reference-dark-section text-white">
      <div className="container-page grid items-start gap-10 lg:grid-cols-[1fr_0.9fr]">
        <div>
          <p className="eyebrow border-white/12 bg-white/8 text-white/72">Заявка</p>
          <h2 className="mt-5 max-w-2xl font-[var(--font-heading)] text-3xl font-black leading-[1.05] md:text-5xl">
            {title}
          </h2>
          <p className="mt-5 max-w-xl text-lg leading-8 text-white/72">{text}</p>
          <div className="mt-8 grid gap-3 text-white/78 sm:grid-cols-3">
            {ctaBenefits.map((item) => (
              <div
                key={item.label}
                className="flex min-h-16 items-center gap-3 rounded-lg border border-white/12 bg-white/8 px-3 py-3 text-sm font-bold leading-snug"
              >
                <span className="relative h-11 w-11 shrink-0">
                  <Image
                    src={assetPath(item.icon)}
                    alt=""
                    fill
                    unoptimized
                    sizes="44px"
                    className="object-contain"
                    aria-hidden="true"
                  />
                </span>
                <span>{item.label}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="surface rounded-lg p-5 text-neutral-950 md:p-7">
          <LeadForm source={source} submitLabel={submitLabel} />
        </div>
      </div>
    </section>
  );
}
