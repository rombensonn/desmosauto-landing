(function () {
  "use strict";

  var selectedCases = new Set([
    "aleks-servis-landing", "antikoravto-landing", "arsenal-2013", "auto-lider-landing",
    "auto-rihtovka", "autocomplex-velyaminovo", "autoelektrik-diagnost-industrial",
    "autolar-landing", "automig-landing", "autoservice-efremov", "autoservice-elektrostal",
    "autoservice-khimki", "autoservice-konstantinovo-obezdnoy", "autoservice-lakinsk",
    "autoservice-mishkovo", "autoservice-rastunovo", "autoservice-tver", "autoservice-vyazniki",
    "avto-masterskaya-pushkino", "avtodiagnostika-landing", "avtomaster-landing",
    "biz-car-garage-landing", "carmasters-landing", "carservice-rastunovo-landing",
    "cleancar-landing-preview", "doctor-cars", "doctorshin-landing", "don-domodedovo-autoservice",
    "fenix-car-studio-landing", "gazel-remont-korgashino", "grand-parts-landing", "greenbox-landing",
    "h2o-kirzhach-landing", "hozyain-morey-autoservice", "kashirka-autoservice-landing",
    "katyusha-autoservice-podolsk", "kuzovnoy-landing", "lastochka-landing",
    "panev-detailing-landing", "remont-generatorov-landing", "vagguide-landing",
    "zelvolvo-landing", "zln-garage"
  ]);

  var featuredCases = [
    ["doctor-cars", "Сайт автосервиса «Doctor Cars»", "Автосервис"],
    ["auto-rihtovka", "Сайт кузовного ремонта «Авто Рихтовка»", "Кузовной ремонт"],
    ["vagguide-landing", "Лендинг диагностики «Vagguide»", "Диагностика"],
    ["panev-detailing-landing", "Лендинг «Panev Детейлинг»", "Детейлинг"],
    ["grand-parts-landing", "Лендинг «Grand Parts»", "Автозапчасти"],
    ["doctorshin-landing", "Лендинг шиномонтажа «DoctorShin»", "Шиномонтаж"],
    ["auto-lider-landing", "Лендинг автосервиса «Авто Лидер»", "Автосервис"],
    ["autoservice-tver", "Сайт автосервиса в Твери", "Автосервис"],
    ["h2o-kirzhach-landing", "Лендинг «H2O Kirzhach»", "Детейлинг"],
    ["gazel-remont-korgashino", "Сайт сервиса для коммерческих авто", "Шиномонтаж"],
    ["kuzovnoy-landing", "Лендинг кузовного ремонта", "Кузовной ремонт"],
    ["zelvolvo-landing", "Лендинг марочного сервиса «Zelvolvo»", "Автосервис"]
  ];

  var scheduled = false;

  function escapeHtml(value) {
    return String(value).replace(/[&<>\"]/g, function (character) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[character];
    });
  }

  function setMenuState(button, menu, open) {
    var nextOpen = Boolean(open);
    menu.dataset.open = String(nextOpen);
    menu.hidden = !nextOpen;
    button.setAttribute("aria-expanded", String(nextOpen));
    button.setAttribute("aria-label", nextOpen ? "Закрыть меню" : "Открыть меню");
  }

  function setupMenu() {
    document.querySelectorAll("[data-portfolio-menu-button]").forEach(function (button) {
      if (button.dataset.ready === "true") return;
      var header = button.closest("header");
      var menu = header ? header.querySelector("[data-portfolio-mobile-nav]") : null;
      if (!menu) return;

      button.dataset.ready = "true";
      setMenuState(button, menu, menu.dataset.open === "true" && getComputedStyle(button).display !== "none");

      button.addEventListener("click", function () {
        setMenuState(button, menu, menu.dataset.open !== "true");
      });

      menu.addEventListener("click", function (event) {
        if (event.target.closest("a")) setMenuState(button, menu, false);
      });

      document.addEventListener("click", function (event) {
        if (menu.dataset.open === "true" && header && !header.contains(event.target)) {
          setMenuState(button, menu, false);
        }
      });

      document.addEventListener("keydown", function (event) {
        if (event.key === "Escape" && menu.dataset.open === "true") {
          setMenuState(button, menu, false);
          button.focus();
        }
      });

      window.addEventListener("resize", function () {
        if (menu.dataset.open === "true" && getComputedStyle(button).display === "none") {
          setMenuState(button, menu, false);
        }
      });
    });
  }

  function upgradeLegacyMenu() {
    if (document.querySelector('script[src^="/_next/"]')) return;
    document.querySelectorAll('header button[aria-label="Открыть меню"]:not([data-portfolio-menu-button])').forEach(function (button) {
      var header = button.closest("header");
      if (!header) return;
      var menu = header.querySelector("[data-portfolio-mobile-nav]");
      if (!menu) {
        menu = document.createElement("nav");
        menu.className = "portfolio-mobile-nav";
        menu.dataset.portfolioMobileNav = "legacy";
        menu.dataset.open = "false";
        menu.hidden = true;
        menu.setAttribute("aria-label", "Мобильная навигация");
        menu.innerHTML = '<a href="/">Главная</a><a href="/services">Услуги</a><a href="/projects">Кейсы</a><a href="/aeo">SEO/AEO</a><a href="/faq">FAQ</a><a href="/contact">Обсудить сайт</a>';
        header.appendChild(menu);
      }
      button.dataset.portfolioMenuButton = "";
    });
  }

  function setupCatalog() {
    var catalog = document.querySelector("[data-curated-catalog]");
    if (!catalog || catalog.dataset.ready === "true") return;
    catalog.dataset.ready = "true";

    var search = catalog.querySelector("[data-portfolio-search]");
    var buttons = Array.from(catalog.querySelectorAll("[data-portfolio-filter]"));
    var cards = Array.from(catalog.querySelectorAll("[data-curated-card]"));
    var result = catalog.querySelector("[data-portfolio-result-count]");
    var empty = catalog.querySelector("[data-portfolio-empty]");
    var active = "all";

    function applyFilters() {
      var query = search ? search.value.trim().toLocaleLowerCase("ru-RU") : "";
      var visible = 0;
      cards.forEach(function (card) {
        var categoryMatch = active === "all" || card.dataset.category === active;
        var searchMatch = !query || String(card.dataset.search || "").toLocaleLowerCase("ru-RU").includes(query);
        card.hidden = !(categoryMatch && searchMatch);
        if (!card.hidden) visible += 1;
      });
      if (result) result.textContent = String(visible);
      if (empty) empty.hidden = visible !== 0;
    }

    buttons.forEach(function (button) {
      button.addEventListener("click", function () {
        active = button.dataset.portfolioFilter || "all";
        buttons.forEach(function (candidate) {
          candidate.setAttribute("aria-pressed", String(candidate === button));
        });
        applyFilters();
      });
    });

    if (search) search.addEventListener("input", applyFilters);
    applyFilters();
  }

  function setupStaticPortfolioNavigation() {
    if (document.documentElement.dataset.staticPortfolioNavigation === "true") return;
    document.documentElement.dataset.staticPortfolioNavigation = "true";
    document.addEventListener("click", function (event) {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      var link = event.target.closest("a[href]");
      if (!link || link.target === "_blank" || link.hasAttribute("download")) return;
      var url;
      try { url = new URL(link.href, location.href); } catch (_) { return; }
      if (url.origin !== location.origin) return;
      var pathname = url.pathname.replace(/\/$/, "") || "/";
      var isCatalog = pathname === "/projects";
      var isSelectedCase = pathname.indexOf("/projects/") === 0 && selectedCases.has(pathname.slice("/projects/".length));
      if (!isCatalog && !isSelectedCase) return;
      event.preventDefault();
      location.assign(url.pathname + url.search + url.hash);
    }, true);
  }

  function correctPortfolioTotals(root) {
    var replacements = [
      [/120 рабочих примеров сайтов/g, "43 отобранных проекта"],
      [/120 примеров сайтов/g, "43 отобранных проекта"],
      [/120 примеров/g, "43 отобранных проекта"],
      [/120 кейсов/g, "43 кейса"],
      [/120 проектов/g, "43 проекта"]
    ];
    var walker = document.createTreeWalker(root || document.body, NodeFilter.SHOW_TEXT);
    var node;
    while ((node = walker.nextNode())) {
      var parent = node.parentElement;
      if (!parent || /^(SCRIPT|STYLE|TEXTAREA)$/i.test(parent.tagName)) continue;
      var value = node.nodeValue;
      replacements.forEach(function (pair) { value = value.replace(pair[0], pair[1]); });
      if (value !== node.nodeValue) node.nodeValue = value;
    }
  }

  function repairRemovedCaseLinks() {
    document.querySelectorAll('a[href^="/projects/"]').forEach(function (link) {
      var slug = link.getAttribute("href").replace(/^\/projects\//, "").replace(/\/$/, "");
      if (slug && !selectedCases.has(slug)) link.setAttribute("href", "/projects");
    });
  }

  function renderHomepageSelection() {
    if (location.pathname !== "/" && location.pathname !== "/index.html") return;
    var cards = Array.from(document.querySelectorAll("article.projects-card"));
    if (!cards.length) return;
    var container = cards[0].parentElement;
    if (!container || container.dataset.curatedHomepage === "true") return;

    container.dataset.curatedHomepage = "true";
    container.innerHTML = featuredCases.map(function (item) {
      var slug = item[0];
      var title = item[1];
      var category = item[2];
      return '<article id="' + slug + '" class="projects-card" data-projects-reveal="true">' +
        '<div class="projects-card-preview" aria-hidden="true"><div class="projects-card-image-wrap">' +
        '<img alt="" loading="lazy" class="projects-card-image" src="/project-previews/' + slug + '.webp"></div>' +
        '<span class="sr-only">Мини-превью сайта: ' + escapeHtml(title) + '</span></div>' +
        '<div class="projects-card-body"><div class="projects-card-meta"><span>' + escapeHtml(category) + '</span><span>Отборный кейс</span></div>' +
        '<h3>' + escapeHtml(title) + '</h3><p class="projects-card-goal">Разбор структуры, визуального решения и пути посетителя к заявке.</p>' +
        '<div class="projects-card-tags"><span>Структура</span><span>Заявка</span></div>' +
        '<div class="projects-card-actions"><a class="projects-card-primary" href="/projects/' + slug + '">Открыть кейс</a></div></div></article>';
    }).join("");
  }

  function enforceCuration() {
    scheduled = false;
    upgradeLegacyMenu();
    setupMenu();
    setupCatalog();
    setupStaticPortfolioNavigation();
    correctPortfolioTotals(document.body);
    repairRemovedCaseLinks();
    renderHomepageSelection();
  }

  function schedule() {
    if (scheduled) return;
    scheduled = true;
    window.requestAnimationFrame(enforceCuration);
  }

  function scheduleWhenSafe() {
    if (document.querySelector('script[src^="/_next/"]') && document.readyState !== "complete") return;
    schedule();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", scheduleWhenSafe, { once: true });
  } else {
    scheduleWhenSafe();
  }

  window.addEventListener("load", schedule, { once: true });
  new MutationObserver(scheduleWhenSafe).observe(document.documentElement, { childList: true, subtree: true });
})();
