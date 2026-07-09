"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowRight, X } from "lucide-react";
import type { Service } from "@/data/services";

type ServicesGridProps = {
  services: Service[];
  serviceModels: Record<string, string>;
};

const detailEase = [0.16, 1, 0.3, 1] as const;

export function ServicesGrid({ services, serviceModels }: ServicesGridProps) {
  const [selectedServiceId, setSelectedServiceId] = useState<string | null>(null);
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);
  const previousBodyOverflowRef = useRef("");
  const shouldReduceMotion = useReducedMotion();
  const detailTransition = shouldReduceMotion ? { duration: 0 } : { duration: 0.28, ease: detailEase };
  const selectedService = useMemo(
    () => services.find((service) => service.id === selectedServiceId) ?? null,
    [selectedServiceId, services]
  );

  const closeModal = useCallback((restoreFocus = true) => {
    if (!restoreFocus) {
      previousFocusRef.current = null;
    }

    setSelectedServiceId(null);
  }, []);

  const scrollToLeadForm = useCallback(() => {
    previousFocusRef.current = null;
    setSelectedServiceId(null);
    document.body.style.overflow = previousBodyOverflowRef.current;

    window.requestAnimationFrame(() => {
      const leadForm = document.getElementById("lead-form");

      if (!leadForm) {
        return;
      }

      leadForm.scrollIntoView({ behavior: shouldReduceMotion ? "auto" : "smooth", block: "start" });
      window.history.replaceState(null, "", `${window.location.pathname}${window.location.search}`);
    });
  }, [shouldReduceMotion]);

  const scrollToExamples = useCallback(() => {
    previousFocusRef.current = null;
    setSelectedServiceId(null);
    document.body.style.overflow = previousBodyOverflowRef.current;

    window.requestAnimationFrame(() => {
      const examples = document.getElementById("examples");

      if (!examples) {
        return;
      }

      examples.scrollIntoView({ behavior: shouldReduceMotion ? "auto" : "smooth", block: "start" });
      window.history.replaceState(null, "", `${window.location.pathname}${window.location.search}#examples`);
    });
  }, [shouldReduceMotion]);

  useEffect(() => {
    if (!selectedService) {
      return;
    }

    previousFocusRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const previousBodyOverflow = document.body.style.overflow;
    previousBodyOverflowRef.current = previousBodyOverflow;
    document.body.style.overflow = "hidden";

    const focusFrame = window.requestAnimationFrame(() => {
      closeButtonRef.current?.focus();
    });

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        closeModal();
        return;
      }

      if (event.key !== "Tab" || !dialogRef.current) {
        return;
      }

      const focusableElements = Array.from(
        dialogRef.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
        )
      ).filter((element) => !element.hasAttribute("aria-hidden"));

      if (focusableElements.length === 0) {
        event.preventDefault();
        dialogRef.current.focus();
        return;
      }

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      }

      if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    }

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      window.cancelAnimationFrame(focusFrame);
      document.body.style.overflow = previousBodyOverflow;
      document.removeEventListener("keydown", handleKeyDown);
      previousFocusRef.current?.focus();
    };
  }, [closeModal, selectedService]);

  return (
    <>
      <div className="services-auto-grid" data-gsap-card-group>
        {services.map((service, index) => {
          return (
            <article
              key={service.id}
              data-service-id={service.id}
              className="surface orbix-service-card"
              data-gsap-card
            >
              <div className="orbix-service-media service-model-stage rounded-lg">
                <Image
                  src={serviceModels[service.id]}
                  alt=""
                  width={520}
                  height={380}
                  className="service-model-image pointer-events-none"
                  sizes="(min-width: 1024px) 24vw, (min-width: 768px) 44vw, 90vw"
                  aria-hidden="true"
                  unoptimized
                />
              </div>

              <div className="service-card-copy">
                <p className="text-xs font-black text-neutral-400">0{index + 1}</p>
                <h3 className="mt-2 font-[var(--font-heading)] text-2xl font-black leading-tight text-neutral-950">{service.title}</h3>
                <p className="mt-3 text-sm leading-6 text-neutral-700">{service.description}</p>

                <div className="service-card-actions">
                  <Link className="service-toggle-button" href={`/services/${service.id}`}>
                    <span>Страница услуги</span>
                    <ArrowRight aria-hidden="true" size={16} />
                  </Link>
                  <button
                    type="button"
                    className="service-toggle-button"
                    data-service-action="open-modal"
                    aria-haspopup="dialog"
                    onClick={() => setSelectedServiceId(service.id)}
                  >
                    <span>Подробнее о сайте</span>
                    <ArrowRight aria-hidden="true" size={16} />
                  </button>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      <AnimatePresence>
        {selectedService ? (
          <motion.div
            key="service-modal-backdrop"
            className="service-modal-backdrop"
            initial={shouldReduceMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0 }}
            transition={detailTransition}
            onClick={(event) => {
              if (event.target === event.currentTarget) {
                closeModal();
              }
            }}
          >
            <motion.div
              ref={dialogRef}
              role="dialog"
              aria-modal="true"
              aria-labelledby={`service-modal-title-${selectedService.id}`}
              aria-describedby={`service-modal-description-${selectedService.id}`}
              tabIndex={-1}
              className="service-modal surface"
              initial={shouldReduceMotion ? false : { opacity: 0, y: 22, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 18, scale: 0.98 }}
              transition={detailTransition}
            >
              <button ref={closeButtonRef} type="button" className="service-modal-close" aria-label="Закрыть окно" onClick={() => closeModal()}>
                <X aria-hidden="true" size={20} />
              </button>

              <div className="service-modal-media orbix-service-media service-model-stage rounded-lg">
                <Image
                  src={serviceModels[selectedService.id]}
                  alt=""
                  width={720}
                  height={520}
                  className="service-model-image pointer-events-none"
                  sizes="(min-width: 1024px) 34vw, 90vw"
                  aria-hidden="true"
                  unoptimized
                />
              </div>

              <div className="service-modal-content">
                <p className="service-detail-label">Формат сайта</p>
                <h3
                  id={`service-modal-title-${selectedService.id}`}
                  className="mt-2 font-[var(--font-heading)] text-3xl font-black leading-tight text-neutral-950"
                >
                  {selectedService.title}
                </h3>
                <p id={`service-modal-description-${selectedService.id}`} className="mt-4 text-base leading-7 text-neutral-700">
                  {selectedService.description}
                </p>

                <div className="service-modal-details">
                  <div className="service-info-panel">
                    <p className="service-detail-label">Подходит</p>
                    <p>{selectedService.bestFor}</p>
                  </div>

                  <div>
                    <p className="service-detail-label">В составе</p>
                    <ul className="service-detail-list">
                      {selectedService.included.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <p className="service-detail-label">Что делаем</p>
                    <ul className="service-detail-list">
                      {selectedService.workScope.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="service-result-box">
                    <p className="service-detail-label">Результат</p>
                    <p>{selectedService.outcome}</p>
                  </div>
                </div>

                <div className="service-modal-actions">
                  <button type="button" className="service-modal-cta" onClick={scrollToLeadForm}>
                    Обсудить проект
                    <ArrowRight aria-hidden="true" size={17} />
                  </button>
                  <button type="button" className="service-modal-secondary" onClick={scrollToExamples}>
                    Посмотреть примеры
                    <ArrowRight aria-hidden="true" size={17} />
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
