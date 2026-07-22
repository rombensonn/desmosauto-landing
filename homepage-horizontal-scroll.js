(function () {
  "use strict";

  var SECTION_SELECTOR = "[data-gsap-horizontal-section]";
  var VIEWPORT_SELECTOR = "[data-gsap-horizontal-viewport]";
  var TRACK_SELECTOR = "[data-gsap-horizontal-track]";
  var CARD_SELECTOR = "[data-gsap-horizontal-card]";
  var TRIGGER_PREFIX = "desmosauto-static-horizontal-";
  var refreshTimer = 0;
  var layoutObserver = null;

  function horizontalDistance(viewport, track) {
    var cards = Array.from(track.querySelectorAll(CARD_SELECTOR));
    var lastCard = cards[cards.length - 1];
    var overflowDistance = Math.max(0, track.scrollWidth - viewport.clientWidth);
    if (!lastCard) return overflowDistance;

    var lastCardCenter = lastCard.offsetLeft + lastCard.offsetWidth / 2;
    var centeredDistance = track.offsetLeft + lastCardCenter - viewport.clientWidth / 2;
    return Math.max(0, overflowDistance, centeredDistance);
  }

  function scheduleRefresh() {
    window.clearTimeout(refreshTimer);
    refreshTimer = window.setTimeout(function () {
      if (!window.ScrollTrigger) return;
      window.ScrollTrigger.sort();
      window.ScrollTrigger.refresh();
    }, 80);
  }

  function setupHorizontalScroll() {
    if (document.documentElement.dataset.staticScrollExperience === "true") return;
    if (!window.gsap || !window.ScrollTrigger) {
      console.warn("GSAP ScrollTrigger assets are unavailable; horizontal scroll was not initialized.");
      return;
    }

    var sections = Array.from(document.querySelectorAll(SECTION_SELECTOR));
    if (!sections.length) return;

    document.documentElement.dataset.staticScrollExperience = "true";
    window.gsap.registerPlugin(window.ScrollTrigger);

    window.ScrollTrigger.getAll().forEach(function (trigger) {
      if (String(trigger.vars.id || "").indexOf(TRIGGER_PREFIX) === 0) trigger.kill(true);
    });

    var media = window.gsap.matchMedia();
    media.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", function () {
      var timelines = [];
      var tracks = [];

      sections.forEach(function (section, index) {
        var viewport = section.querySelector(VIEWPORT_SELECTOR);
        var track = section.querySelector(TRACK_SELECTOR);
        if (!viewport || !track || horizontalDistance(viewport, track) <= 4) return;

        tracks.push(track);
        window.gsap.set(track, { force3D: true, willChange: "transform" });

        var timeline = window.gsap.timeline({
          scrollTrigger: {
            id: TRIGGER_PREFIX + index,
            trigger: section,
            start: "top top+=72",
            end: function () {
              return "+=" + Math.round(horizontalDistance(viewport, track) + window.innerHeight * 0.62);
            },
            scrub: 0.85,
            pin: true,
            pinSpacing: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            refreshPriority: -10 + index
          }
        });

        timeline
          .to(track, {
            x: function () { return -horizontalDistance(viewport, track); },
            duration: 1,
            ease: "none"
          })
          .to(track, {
            x: function () { return -horizontalDistance(viewport, track); },
            duration: 0.16,
            ease: "none"
          });

        timelines.push(timeline);
      });

      if (!timelines.length) return;
      document.documentElement.classList.add("gsap-scroll-active");
      scheduleRefresh();

      return function () {
        timelines.forEach(function (timeline) {
          if (timeline.scrollTrigger) timeline.scrollTrigger.kill(true);
          timeline.kill();
        });
        tracks.forEach(function (track) {
          window.gsap.set(track, { clearProps: "transform,willChange" });
        });
        document.documentElement.classList.remove("gsap-scroll-active");
      };
    });

    window.addEventListener("load", scheduleRefresh, { once: true });
    window.addEventListener("resize", scheduleRefresh, { passive: true });

    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(scheduleRefresh).catch(function () {});
    }

    var main = document.querySelector("main");
    if (main) {
      layoutObserver = new MutationObserver(scheduleRefresh);
      layoutObserver.observe(main, { childList: true });
    }

    window.setTimeout(scheduleRefresh, 420);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", setupHorizontalScroll, { once: true });
  } else {
    setupHorizontalScroll();
  }
})();
