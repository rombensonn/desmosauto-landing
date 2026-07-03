(async function () {
  var motion;

  try {
    motion = await import("https://cdn.jsdelivr.net/npm/motion@12.42.2/+esm");
  } catch (error) {
    document.documentElement.classList.add("motion-unavailable");
    return;
  }

  var animate = motion.animate;
  var inView = motion.inView;
  var press = motion.press;
  var scroll = motion.scroll;
  var stagger = motion.stagger;
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var easeSoft = [0.16, 1, 0.3, 1];
  var springSoft = { type: "spring", stiffness: 170, damping: 24, mass: 0.9 };
  var cleanupTasks = [];

  if (reduceMotion || !animate || !inView || !stagger) {
    document.documentElement.classList.add("motion-reduced");
    return;
  }

  document.documentElement.classList.add("motion-enhanced");

  function queryAll(selector, root) {
    return Array.from((root || document).querySelectorAll(selector));
  }

  function addCleanup(task) {
    if (typeof task === "function") {
      cleanupTasks.push(task);
    }
  }

  function prepareReveal(elements, distance) {
    elements.forEach(function (element) {
      element.style.opacity = "0";
      element.style.transform = "translate3d(0, " + distance + "px, 0) scale(0.985)";
      element.style.transformOrigin = "50% 60%";
      element.style.willChange = "opacity, transform, filter";
      element.style.filter = "blur(8px)";
    });
  }

  function finishReveal(elements) {
    elements.forEach(function (element) {
      window.setTimeout(function () {
        element.style.willChange = "";
      }, 1300);
    });
  }

  function bindHover(selector, onEnter, onLeave) {
    queryAll(selector).forEach(function (element) {
      function handleEnter() {
        onEnter(element);
      }

      function handleLeave() {
        onLeave(element);
      }

      element.addEventListener("pointerenter", handleEnter);
      element.addEventListener("pointerleave", handleLeave);
      element.addEventListener("mouseenter", handleEnter);
      element.addEventListener("mouseleave", handleLeave);

      addCleanup(function () {
        element.removeEventListener("pointerenter", handleEnter);
        element.removeEventListener("pointerleave", handleLeave);
        element.removeEventListener("mouseenter", handleEnter);
        element.removeEventListener("mouseleave", handleLeave);
      });
    });
  }

  function revealGroup(container, selector, options) {
    var items = queryAll(selector, container);

    if (!items.length) {
      return;
    }

    prepareReveal(items, options.distance || 28);

    addCleanup(inView(container, function () {
      animate(
        items,
        {
          opacity: 1,
          transform: "translate3d(0, 0, 0) scale(1)",
          filter: "blur(0px)"
        },
        {
          delay: stagger(options.stagger || 0.055, { startDelay: options.startDelay || 0 }),
          duration: options.duration || 0.9,
          ease: easeSoft
        }
      );

      finishReveal(items);
    }, {
      amount: options.amount || 0.24,
      margin: options.margin || "0px 0px -12% 0px"
    }));
  }

  function revealSingle(selector, options) {
    queryAll(selector).forEach(function (element) {
      prepareReveal([element], options.distance || 28);

      addCleanup(inView(element, function () {
        animate(
          element,
          {
            opacity: 1,
            transform: "translate3d(0, 0, 0) scale(1)",
            filter: "blur(0px)"
          },
          {
            duration: options.duration || 0.95,
            ease: easeSoft
          }
        );

        finishReveal([element]);
      }, {
        amount: options.amount || 0.22,
        margin: options.margin || "0px 0px -10% 0px"
      }));
    });
  }

  function setupHeroMotion() {
    var hero = document.querySelector(".hero");
    var heroGrid = document.querySelector(".hero-grid");
    var heroItems = queryAll(".hero .eyebrow, .hero h1, .hero .hero-lead, .hero .hero-actions, .hero .hero-note");

    if (!hero || !heroItems.length) {
      return;
    }

    prepareReveal(heroItems, 34);
    animate(
      heroItems,
      {
        opacity: 1,
        transform: "translate3d(0, 0, 0) scale(1)",
        filter: "blur(0px)"
      },
      {
        delay: stagger(0.075, { startDelay: 0.12 }),
        duration: 1,
        ease: easeSoft
      }
    );
    finishReveal(heroItems);

    if (!scroll || !heroGrid) {
      return;
    }

    addCleanup(scroll(function (progress) {
      var y = Math.min(progress * 64, 64);
      heroGrid.style.setProperty("--motion-hero-y", y.toFixed(2) + "px");
      heroGrid.style.setProperty("--motion-hero-offset", (y * -0.08).toFixed(2) + "px");
    }, {
      target: hero,
      offset: ["start start", "end start"]
    }));
  }

  function setupCatalogHeroMotion() {
    var hero = document.querySelector(".catalog-hero");
    var heroItems = queryAll(".catalog-hero .eyebrow, .catalog-hero h1, .catalog-hero p, .catalog-hero__actions, .catalog-hero__stats > *");

    if (!hero || !heroItems.length) {
      return;
    }

    prepareReveal(heroItems, 32);
    animate(
      heroItems,
      {
        opacity: 1,
        transform: "translate3d(0, 0, 0) scale(1)",
        filter: "blur(0px)"
      },
      {
        delay: stagger(0.06, { startDelay: 0.12 }),
        duration: 0.95,
        ease: easeSoft
      }
    );
    finishReveal(heroItems);
  }

  function setupSectionReveals() {
    queryAll(".section-heading").forEach(function (heading) {
      revealGroup(heading, ":scope > .eyebrow, :scope > h2, :scope > p", {
        amount: 0.18,
        distance: 24,
        duration: 0.85,
        stagger: 0.07
      });
    });

    revealSingle(".request-demo, .lead-copy, .lead-form", {
      amount: 0.18,
      distance: 30,
      duration: 1
    });

    queryAll(".work-grid, .catalog-grid, .cards-grid, .segment-grid, .included-grid, .process-grid").forEach(function (grid) {
      revealGroup(grid, ":scope > *", {
        amount: 0.14,
        distance: 34,
        duration: 0.92,
        stagger: 0.045
      });
    });

    revealSingle(".faq-item, .result-card, .demo-card", {
      amount: 0.2,
      distance: 24,
      duration: 0.8
    });
  }

  function setupInteractiveMotion() {
    bindHover(
      ".button, .mobile-sticky-cta",
      function (element) {
        animate(element, { y: -3, scale: 1.018 }, springSoft);
      },
      function (element) {
        animate(element, { y: 0, scale: 1 }, springSoft);
      }
    );

    if (press) {
      addCleanup(press(".button, .mobile-sticky-cta, .work-card a", function (element) {
        animate(element, { scale: 0.982 }, { duration: 0.16, ease: easeSoft });

        return function () {
          animate(element, { scale: 1 }, { type: "spring", stiffness: 320, damping: 22 });
        };
      }));
    }

    bindHover(
      ".work-card a",
      function (element) {
        var image = element.querySelector("img");
        var meta = element.querySelector(".work-card__meta");

        animate(element, { y: -8, scale: 1.012 }, springSoft);

        if (image) {
          animate(image, { scale: 1.045, y: -5 }, { duration: 0.8, ease: easeSoft });
        }

        if (meta) {
          animate(meta, { y: -2 }, { duration: 0.7, ease: easeSoft });
        }
      },
      function (element) {
        var image = element.querySelector("img");
        var meta = element.querySelector(".work-card__meta");

        animate(element, { y: 0, scale: 1 }, springSoft);

        if (image) {
          animate(image, { scale: 1, y: 0 }, { duration: 0.75, ease: easeSoft });
        }

        if (meta) {
          animate(meta, { y: 0 }, { duration: 0.65, ease: easeSoft });
        }
      }
    );

    bindHover(
      ".catalog-card, .cards-grid > *, .segment-grid > *, .included-grid > *, .process-grid > *, .faq-item",
      function (element) {
        animate(element, { y: -7, scale: 1.01 }, springSoft);
      },
      function (element) {
        animate(element, { y: 0, scale: 1 }, springSoft);
      }
    );
  }

  function setupRequestDemoMotion() {
    var demo = document.querySelector(".request-demo");

    if (!demo) {
      return;
    }

    var browserFrame = demo.querySelector(".request-demo__browser");
    var notifications = queryAll(".request-demo__notification", demo);

    addCleanup(inView(demo, function () {
      if (browserFrame) {
        animate(
          browserFrame,
          {
            y: [18, 0],
            scale: [0.975, 1],
            rotateX: [2, 0]
          },
          {
            duration: 1.05,
            ease: easeSoft
          }
        );
      }

      if (notifications.length) {
        animate(
          notifications,
          {
            y: [20, 0],
            scale: [0.96, 1]
          },
          {
            delay: stagger(0.08, { startDelay: 0.18 }),
            duration: 0.85,
            ease: easeSoft
          }
        );
      }
    }, {
      amount: 0.2
    }));
  }

  function setupHeaderMotion() {
    var header = document.querySelector("[data-site-header]");

    if (!header || !scroll) {
      return;
    }

    addCleanup(scroll(function (progress) {
      var normalized = Math.min(progress * 6, 1);

      header.style.setProperty("--motion-header-progress", normalized.toFixed(3));
      header.style.setProperty("--motion-header-shadow-y", (normalized * 0.9).toFixed(3) + "rem");
      header.style.setProperty("--motion-header-shadow-blur", (normalized * 2.2).toFixed(3) + "rem");
      header.style.setProperty(
        "--motion-header-shadow-color",
        "color-mix(in srgb, var(--color-brand-primary) " + (normalized * 10).toFixed(2) + "%, transparent)"
      );
    }));
  }

  setupHeroMotion();
  setupCatalogHeroMotion();
  setupSectionReveals();
  setupInteractiveMotion();
  setupRequestDemoMotion();
  setupHeaderMotion();

  window.addEventListener("pagehide", function () {
    cleanupTasks.forEach(function (cleanup) {
      cleanup();
    });
  }, { once: true });
})();
