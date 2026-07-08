import type { ReactNode } from "react";

type SectionProps = {
  id?: string;
  eyebrow?: string;
  title: ReactNode;
  description?: string;
  answer?: string;
  children: ReactNode;
  className?: string;
};

export function Section({ id, eyebrow, title, description, answer, children, className = "" }: SectionProps) {
  return (
    <section id={id} className={`section-y ${className}`} data-gsap-section>
      <div className="container-page">
        <div className="mx-auto mb-9 max-w-3xl text-center md:mb-14" data-gsap-section-head>
          {eyebrow ? <p className="eyebrow mb-4">{eyebrow}</p> : null}
          <h2 className="font-[var(--font-heading)] text-3xl font-black leading-[1.05] text-neutral-950 md:text-5xl">
            {title}
          </h2>
          {description ? <p className="mt-5 text-lg leading-8 text-neutral-700">{description}</p> : null}
          {answer ? <p className="answer-box mt-6 text-left">{answer}</p> : null}
        </div>
        {children}
      </div>
    </section>
  );
}
