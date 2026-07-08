"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const reducedMotionQuery = "(prefers-reduced-motion: reduce)";

function getElements(selector: string, root: ParentNode = document) {
  return gsap.utils.toArray<HTMLElement>(selector, root);
}

export function GsapScrollExperience() {
  useGSAP(() => {
    const prefersReducedMotion = window.matchMedia(reducedMotionQuery).matches;

    if (prefersReducedMotion) {
      return;
    }

    document.documentElement.classList.add("gsap-scroll-active");
    ScrollTrigger.config({
      limitCallbacks: true,
      ignoreMobileResize: true
    });
    gsap.defaults({ overwrite: "auto" });

    const refresh = () => ScrollTrigger.refresh();
    const refreshTimer = window.setTimeout(refresh, 420);
    window.addEventListener("load", refresh, { once: true });

    const prepare = (targets: gsap.TweenTarget) => {
      gsap.set(targets, {
        force3D: true,
        willChange: "transform, opacity"
      });
    };

    const heroItems = getElements("[data-gsap-hero-item]");
    if (heroItems.length) {
      prepare(heroItems);
      gsap.fromTo(
        heroItems,
        { autoAlpha: 0, y: 26 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.9,
          ease: "power3.out",
          stagger: 0.075,
          clearProps: "willChange"
        }
      );
    }

    const sectionHeads = getElements("[data-gsap-section-head]");
    sectionHeads.forEach((head, index) => {
      prepare(head);
      gsap.fromTo(
        head,
        { autoAlpha: 0, y: 34 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.82,
          ease: "power3.out",
          clearProps: "willChange",
          scrollTrigger: {
            id: `desmosauto-section-head-${index}`,
            trigger: head,
            start: "top 82%",
            once: true
          }
        }
      );
    });

    const cardGroups = getElements("[data-gsap-card-group]");
    cardGroups.forEach((group, index) => {
      const cards = getElements("[data-gsap-card]", group);

      if (!cards.length) {
        return;
      }

      prepare(cards);
      gsap.fromTo(
        cards,
        { autoAlpha: 0, y: 38, scale: 0.985 },
        {
          autoAlpha: 1,
          y: 0,
          scale: 1,
          duration: 0.78,
          ease: "power3.out",
          stagger: {
            each: 0.055,
            from: "start"
          },
          clearProps: "willChange",
          scrollTrigger: {
            id: `desmosauto-card-group-${index}`,
            trigger: group,
            start: "top 84%",
            once: true
          }
        }
      );
    });

    const heroVisual = document.querySelector<HTMLElement>("[data-gsap-hero-visual]");
    const heroPanel = heroVisual?.querySelector<HTMLElement>(".aeo-hero-panel");

    if (heroVisual && heroPanel) {
      prepare(heroPanel);
      gsap.fromTo(
        heroPanel,
        { y: 28, scale: 0.985 },
        {
          y: -18,
          scale: 1,
          ease: "none",
          scrollTrigger: {
            id: "desmosauto-hero-visual-drift",
            trigger: heroVisual,
            start: "top bottom",
            end: "bottom top",
            scrub: 0.75,
            invalidateOnRefresh: true
          }
        }
      );
    }

    const mm = gsap.matchMedia();
    mm.add("(min-width: 1024px)", () => {
      const horizontalSections = getElements("[data-gsap-horizontal-section]");

      horizontalSections.forEach((section, index) => {
        const viewport = section.querySelector<HTMLElement>("[data-gsap-horizontal-viewport]");
        const track = section.querySelector<HTMLElement>("[data-gsap-horizontal-track]");

        if (!viewport || !track) {
          return;
        }

        const getTravel = () => {
          const cards = getElements("[data-gsap-horizontal-card]", track);
          const lastCard = cards[cards.length - 1];

          if (!lastCard) {
            return Math.max(0, track.scrollWidth - viewport.clientWidth);
          }

          const lastCardCenter = lastCard.offsetLeft + lastCard.offsetWidth / 2;
          const centeredTravel = track.offsetLeft + lastCardCenter - viewport.clientWidth / 2;
          const edgeTravel = track.scrollWidth - viewport.clientWidth;

          return Math.max(0, centeredTravel, edgeTravel);
        };
        const getHoldDistance = () => window.innerHeight * 0.62;

        if (getTravel() <= 4) {
          return;
        }

        prepare(track);
        const timeline = gsap.timeline({
          scrollTrigger: {
            id: `desmosauto-horizontal-problems-${index}`,
            trigger: section,
            start: "top top+=72",
            end: () => `+=${getTravel() + getHoldDistance()}`,
            scrub: 0.85,
            pin: true,
            anticipatePin: 1,
            invalidateOnRefresh: true
          }
        });

        timeline
          .to(track, {
            x: () => -getTravel(),
            duration: 1,
            ease: "none"
          })
          .to(track, {
            x: () => -getTravel(),
            duration: 0.16,
            ease: "none"
          });
      });

      return () => {
        horizontalSections.forEach((section) => {
          const track = section.querySelector<HTMLElement>("[data-gsap-horizontal-track]");
          if (track) {
            gsap.set(track, { clearProps: "transform,opacity,visibility,willChange" });
          }
        });
      };
    });

    mm.add("(min-width: 768px)", () => {
      const stackCards = getElements(".scroll-stack-card");

      stackCards.forEach((card, index) => {
        const image = card.querySelector<HTMLElement>(".scroll-stack-image");
        const copy = card.querySelector<HTMLElement>(".scroll-stack-copy");
        const baseY = index * 10;

        prepare(card);
        gsap.fromTo(
          card,
          { y: baseY + 48, scale: 0.982 },
          {
            y: baseY,
            scale: 1,
            ease: "none",
            scrollTrigger: {
              id: `desmosauto-stack-card-${index}`,
              trigger: card,
              start: "top 90%",
              end: "top 38%",
              scrub: 0.6,
              invalidateOnRefresh: true
            }
          }
        );

        if (image) {
          prepare(image);
          gsap.fromTo(
            image,
            { y: 18, scale: 0.99 },
            {
              y: -12,
              scale: 1.04,
              ease: "none",
              scrollTrigger: {
                id: `desmosauto-stack-image-${index}`,
                trigger: card,
                start: "top bottom",
                end: "bottom top",
                scrub: 0.8,
                invalidateOnRefresh: true
              }
            }
          );
        }

        if (copy) {
          prepare(copy);
          gsap.fromTo(
            copy,
            { autoAlpha: 0.74, x: -18 },
            {
              autoAlpha: 1,
              x: 0,
              ease: "none",
              scrollTrigger: {
                id: `desmosauto-stack-copy-${index}`,
                trigger: card,
                start: "top 82%",
                end: "top 46%",
                scrub: 0.45,
                invalidateOnRefresh: true
              }
            }
          );
        }
      });

      return () => {
        stackCards.forEach((card) => {
          gsap.set(card, { clearProps: "transform,opacity,visibility,willChange" });
          const image = card.querySelector<HTMLElement>(".scroll-stack-image");
          const copy = card.querySelector<HTMLElement>(".scroll-stack-copy");
          if (image) {
            gsap.set(image, { clearProps: "transform,opacity,visibility,willChange" });
          }
          if (copy) {
            gsap.set(copy, { clearProps: "transform,opacity,visibility,willChange" });
          }
        });
      };
    });

    return () => {
      window.clearTimeout(refreshTimer);
      window.removeEventListener("load", refresh);
      mm.revert();
      ScrollTrigger.getAll()
        .filter((trigger) => trigger.vars.id?.startsWith("desmosauto-"))
        .forEach((trigger) => trigger.kill());
      document.documentElement.classList.remove("gsap-scroll-active");
    };
  }, []);

  return null;
}
