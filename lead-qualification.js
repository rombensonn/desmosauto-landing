(function () {
  "use strict";

  var API_ENDPOINT = "/api/leads.php";
  var FORM_SELECTOR = 'form:has(input[name="name"]):has(input[name="phone"])';
  var FIELD_CLASS = "min-h-12 w-full rounded-lg border border-neutral-300 bg-white px-4 text-base text-neutral-950 transition-colors placeholder:text-neutral-400 focus:border-neutral-950 focus:bg-white";
  var LABEL_CLASS = "mb-2 block text-sm font-bold text-neutral-900";
  var pendingEnhancement = false;

  function escapeHtml(value) {
    return String(value).replace(/[&<>"]/g, function (character) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[character];
    });
  }

  function getSource(form) {
    var existing = form.querySelector('input[name="source"]');
    if (existing && existing.value) return existing.value;

    var honeypot = form.querySelector('input[name="website"]');
    if (honeypot && /-website$/.test(honeypot.id)) {
      return honeypot.id.replace(/-website$/, "");
    }

    return "qualification-form";
  }

  function isCompactForm(form) {
    return Boolean(form.querySelector('input[name="name"]') && form.querySelector('input[name="phone"]'));
  }

  function ensureHiddenInput(form, name, value) {
    var input = form.querySelector('input[name="' + name + '"]');
    if (!input) {
      input = document.createElement("input");
      input.type = "hidden";
      input.name = name;
      form.appendChild(input);
    }
    if (!input.value) input.value = value || "";
    return input;
  }

  function removeCompactExcludedFields(form) {
    form.querySelectorAll("[data-lead-qualification-fields]").forEach(function (group) {
      group.remove();
    });

    var interest = form.querySelector('input[name="portfolioInterest"]');
    if (interest) {
      var interestContainer = interest.closest("label");
      (interestContainer || interest).remove();
    }
  }

  function ensureCompactFields(form, source) {
    removeCompactExcludedFields(form);
    form.dataset.leadMode = "compact";
    ensureHiddenInput(form, "formMode", "compact");
    ensureHiddenInput(form, "source", source);
    ensureHiddenInput(form, "submissionId", "");
  }

  function qualificationMarkup(prefix, source) {
    var safePrefix = escapeHtml(prefix);
    var safeSource = escapeHtml(source);

    return [
      '<div class="grid gap-4 md:grid-cols-2" data-lead-qualification-fields="">',
      '<div><label class="' + LABEL_CLASS + '" for="' + safePrefix + '-business-type">Тип бизнеса</label><select id="' + safePrefix + '-business-type" class="' + FIELD_CLASS + '" name="businessType" required><option value="">Выберите направление</option><option value="Автосервис / СТО">Автосервис / СТО</option><option value="Шиномонтаж">Шиномонтаж</option><option value="Детейлинг">Детейлинг</option><option value="Кузовной ремонт">Кузовной ремонт</option><option value="Диагностика / автоэлектрика">Диагностика / автоэлектрика</option><option value="Магазин автозапчастей">Магазин автозапчастей</option><option value="Другое">Другое</option></select></div>',
      '<div><label class="' + LABEL_CLASS + '" for="' + safePrefix + '-city">Город</label><input id="' + safePrefix + '-city" type="text" autocomplete="address-level2" class="' + FIELD_CLASS + '" name="city" placeholder="Например, Видное" minlength="2" maxlength="100" required></div>',
      '<div><label class="' + LABEL_CLASS + '" for="' + safePrefix + '-current-site">Текущий сайт, если есть</label><input id="' + safePrefix + '-current-site" type="url" inputmode="url" autocomplete="url" class="' + FIELD_CLASS + '" name="currentSite" placeholder="https://" maxlength="500"></div>',
      '<div><label class="' + LABEL_CLASS + '" for="' + safePrefix + '-decision-role">Ваша роль</label><select id="' + safePrefix + '-decision-role" class="' + FIELD_CLASS + '" name="decisionRole" required><option value="">Выберите роль</option><option value="Собственник">Собственник</option><option value="Руководитель">Руководитель</option><option value="Отвечаю за маркетинг">Отвечаю за маркетинг</option><option value="Другое">Другое</option></select></div>',
      '<div class="md:col-span-2"><label class="' + LABEL_CLASS + '" for="' + safePrefix + '-project-goal">Какую задачу должен решить сайт</label><textarea id="' + safePrefix + '-project-goal" class="' + FIELD_CLASS + ' min-h-28 py-3" name="projectGoal" placeholder="Например: получать больше заявок на диагностику и заранее собирать данные об автомобиле" minlength="10" maxlength="500" required></textarea></div>',
      '<div><label class="' + LABEL_CLASS + '" for="' + safePrefix + '-preferred-contact">Как удобнее связаться</label><select id="' + safePrefix + '-preferred-contact" class="' + FIELD_CLASS + '" name="preferredContact" required><option value="">Выберите способ</option><option value="phone">Телефон</option><option value="whatsapp">WhatsApp</option><option value="telegram">Telegram</option></select></div>',
      '<div><label class="' + LABEL_CLASS + '" for="' + safePrefix + '-preferred-contact-time">Удобное время для связи</label><input id="' + safePrefix + '-preferred-contact-time" type="text" class="' + FIELD_CLASS + '" name="preferredContactTime" placeholder="Например, после 15:00" maxlength="100"></div>',
      '<div class="md:col-span-2"><label class="' + LABEL_CLASS + '" for="' + safePrefix + '-decision-date">Когда планируете принять решение</label><input id="' + safePrefix + '-decision-date" type="date" class="' + FIELD_CLASS + '" name="decisionDate"></div>',
      '<label class="md:col-span-2 flex cursor-pointer items-start gap-4 rounded-lg py-1 text-sm leading-6 text-neutral-700" for="' + safePrefix + '-portfolio-interest"><input id="' + safePrefix + '-portfolio-interest" type="checkbox" class="mt-1 h-5 w-5 shrink-0 rounded border-neutral-300 accent-neutral-950" name="portfolioInterest" value="1" required><span>Хочу посмотреть релевантные примеры и обсудить подходящий формат сайта.</span></label>',
      '</div>',
      '<input type="hidden" name="source" value="' + safeSource + '">',
      '<input type="hidden" name="submissionId" value="">'
    ].join("");
  }

  function ensureStatus(form) {
    var status = form.querySelector("[data-lead-status]");
    if (status) {
      status.setAttribute("tabindex", "-1");
      return status;
    }

    status = document.createElement("p");
    status.hidden = true;
    status.className = "text-sm leading-6 text-neutral-700";
    status.setAttribute("data-lead-status", "");
    status.setAttribute("role", "status");
    status.setAttribute("aria-live", "polite");
    status.setAttribute("tabindex", "-1");
    var button = form.querySelector('button[type="submit"], input[type="submit"]');
    form.insertBefore(status, button || null);
    return status;
  }

  function ensureSubmissionId(form) {
    var input = form.querySelector('input[name="submissionId"]');
    if (!input) return "";
    if (input.value) return input.value;

    var source = getSource(form);
    var storageKey = "desmosauto:lead:" + location.pathname + ":" + source;
    var value = "";

    try {
      value = sessionStorage.getItem(storageKey) || "";
    } catch (_) {
      value = "";
    }

    if (!value) {
      if (window.crypto && typeof window.crypto.randomUUID === "function") {
        value = window.crypto.randomUUID();
      } else {
        var bytes = new Uint8Array(16);
        if (window.crypto && typeof window.crypto.getRandomValues === "function") {
          window.crypto.getRandomValues(bytes);
        } else {
          for (var index = 0; index < bytes.length; index += 1) {
            bytes[index] = Math.floor(Math.random() * 256);
          }
        }
        bytes[6] = (bytes[6] & 15) | 64;
        bytes[8] = (bytes[8] & 63) | 128;
        var hex = Array.from(bytes, function (byte) {
          return byte.toString(16).padStart(2, "0");
        }).join("");
        value = [hex.slice(0, 8), hex.slice(8, 12), hex.slice(12, 16), hex.slice(16, 20), hex.slice(20)].join("-");
      }
      try {
        sessionStorage.setItem(storageKey, value);
      } catch (_) {
        // The hidden value still provides idempotency when storage is unavailable.
      }
    }

    input.value = value;
    input.dataset.storageKey = storageKey;
    return value;
  }

  function enhanceForm(form) {
    if (!(form instanceof HTMLFormElement)) return;
    if (!form.querySelector('input[name="name"]') || !form.querySelector('input[name="phone"]')) return;

    form.action = API_ENDPOINT;
    form.method = "post";
    form.noValidate = false;
    form.setAttribute("accept-charset", "UTF-8");

    ["name", "phone"].forEach(function (name) {
      var field = form.querySelector('[name="' + name + '"]');
      if (field) field.required = true;
    });
    var nameField = form.querySelector('[name="name"]');
    if (nameField) {
      nameField.minLength = 2;
      nameField.maxLength = 80;
    }

    var privacy = form.querySelector('[id$="-privacy-policy-accepted"]');
    if (privacy) {
      privacy.name = "privacyPolicyAccepted";
      privacy.value = "1";
      privacy.required = true;
    }

    var consent = form.querySelector('[id$="-personal-data-consent"]');
    if (consent) {
      consent.name = "personalDataConsent";
      consent.value = "1";
      consent.required = true;
    }

    var source = getSource(form);
    var prefix = (form.querySelector('input[name="website"]') || {}).id || source;
    prefix = String(prefix).replace(/-website$/, "").replace(/[^a-zA-Z0-9_-]/g, "-");

    var anchor = privacy && privacy.closest("label");
    if (isCompactForm(form)) {
      ensureCompactFields(form, source);
    } else if (!form.querySelector("[data-lead-qualification-fields]")) {
      var wrapper = document.createElement("div");
      wrapper.innerHTML = qualificationMarkup(prefix, source);
      while (wrapper.firstChild) form.insertBefore(wrapper.firstChild, anchor || null);
    }

    var sourceInput = form.querySelector('input[name="source"]');
    if (sourceInput && !sourceInput.value) sourceInput.value = source;
    ensureStatus(form);
    form.dataset.leadQualificationEnhanced = "true";
  }

  function enhanceAllForms(root) {
    if (root instanceof HTMLFormElement) enhanceForm(root);
    if (!root.querySelectorAll) return;

    try {
      root.querySelectorAll(FORM_SELECTOR).forEach(enhanceForm);
    } catch (_) {
      root.querySelectorAll("form").forEach(enhanceForm);
    }
  }

  function scheduleEnhancement() {
    if (pendingEnhancement) return;
    pendingEnhancement = true;
    requestAnimationFrame(function () {
      pendingEnhancement = false;
      enhanceAllForms(document);
      ensureHomepageDemo();
    });
  }

  function ensureHomepageDemo() {
    var isHome = location.pathname === "/" || location.pathname === "/index.html";
    var existing = document.querySelector("[data-home-demo24]");

    if (!isHome) {
      if (existing) existing.remove();
      return;
    }

    if (!document.querySelector('link[href="/homepage-demo24.css"]')) {
      var stylesheet = document.createElement("link");
      stylesheet.rel = "stylesheet";
      stylesheet.href = "/homepage-demo24.css";
      document.head.appendChild(stylesheet);
    }

    if (existing) return;
    var main = document.querySelector("main");
    var heroSection = main && main.querySelector(":scope > section");
    if (!heroSection) return;

    var section = document.createElement("section");
    section.id = "demo-24";
    section.className = "home-demo24";
    section.setAttribute("aria-labelledby", "demo-24-title");
    section.setAttribute("data-home-demo24", "");
    section.innerHTML = [
      '<div class="home-demo24__container">',
      '<div class="home-demo24__grid">',
      '<div><p class="home-demo24__eyebrow">Демо без предоплаты</p><p class="home-demo24__number">24</p><p class="home-demo24__number-label">часа после заявки на первую версию идеи</p></div>',
      '<div><h2 id="demo-24-title">Демонстрационная версия вашей идеи сайта — за 24 часа после заявки</h2>',
      '<p class="home-demo24__lead">Переводим ваш замысел в визуальное направление, первый экран и ключевую структуру, чтобы вы могли оценить идею до решения о полном проекте.</p>',
      '<div class="home-demo24__steps" aria-label="Как готовим демонстрационную версию">',
      '<article class="home-demo24__step"><span>01 · Заявка</span><p>Получаем имя, телефон и промокод, затем коротко уточняем идею.</p></article>',
      '<article class="home-demo24__step"><span>02 · 24 часа</span><p>Собираем демонстрационную версию с первым экраном и логикой страницы.</p></article>',
      '<article class="home-demo24__step"><span>03 · Решение</span><p>Показываем результат — вы решаете, продолжать ли работу над сайтом.</p></article>',
      '</div>',
      '<div class="home-demo24__actions"><a class="home-demo24__button" href="#lead-form">Получить демо за 24 часа</a><p class="home-demo24__note">Без предоплаты и обязательств продолжать работу после показа.</p></div>',
      '</div></div></div>'
    ].join("");
    heroSection.parentNode.insertBefore(section, heroSection.nextSibling);

    if (location.hash === "#demo-24") {
      var scrollToDemo = function () {
        section.scrollIntoView({ block: "start" });
      };
      requestAnimationFrame(scrollToDemo);
      window.setTimeout(scrollToDemo, 500);
    }
  }

  function setStatus(form, message, isError) {
    var currentForm = form.isConnected
      ? form
      : Array.from(document.querySelectorAll("form")).find(function (candidate) {
          return getSource(candidate) === getSource(form);
        });
    if (!currentForm) return;

    enhanceForm(currentForm);
    var status = ensureStatus(currentForm);
    status.hidden = false;
    status.textContent = message;
    status.setAttribute("role", isError ? "alert" : "status");
    status.className = isError
      ? "text-sm font-semibold leading-6 text-red-700"
      : "text-sm font-semibold leading-6 text-green-800";
    if (isError) status.focus({ preventScroll: true });
  }

  function payloadFrom(form) {
    var data = new FormData(form);
    var query = new URLSearchParams(location.search);
    var payload = {};

    [
      "name", "phone", "promoCode", "businessType", "city", "currentSite",
      "decisionRole", "projectGoal", "preferredContact", "preferredContactTime",
      "decisionDate", "website", "source", "submissionId", "formMode"
    ].forEach(function (key) {
      payload[key] = String(data.get(key) || "").trim();
    });

    payload.portfolioInterest = data.get("portfolioInterest") === "1";
    payload.privacyPolicyAccepted = data.get("privacyPolicyAccepted") === "1";
    payload.personalDataConsent = data.get("personalDataConsent") === "1";
    payload.pageUrl = location.href;
    payload.referrer = document.referrer || "";
    ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"].forEach(function (key) {
      payload[key] = query.get(key) || "";
    });
    return payload;
  }

  function firstServerError(result) {
    if (result && Array.isArray(result.errors) && result.errors.length) {
      return String(result.errors[0]);
    }
    if (result && result.errors && typeof result.errors === "object") {
      var first = Object.values(result.errors)[0];
      if (Array.isArray(first) && first.length) return String(first[0]);
      if (first) return String(first);
    }
    return result && (result.message || result.error)
      ? String(result.message || result.error)
      : "Не удалось отправить данные.";
  }

  async function submitForm(event) {
    var form = event.target;
    if (!(form instanceof HTMLFormElement)) return;
    if (!form.querySelector('input[name="name"]') || !form.querySelector('input[name="phone"]')) return;

    event.preventDefault();
    event.stopImmediatePropagation();
    enhanceForm(form);

    if (form.dataset.leadSubmitting === "true") return;
    if (!form.checkValidity()) {
      form.reportValidity();
      setStatus(form, "Проверьте обязательные поля формы.", true);
      return;
    }

    ensureSubmissionId(form);
    form.dataset.leadSubmitting = "true";
    form.setAttribute("aria-busy", "true");
    var button = form.querySelector('button[type="submit"], input[type="submit"]');
    if (button) button.disabled = true;
    setStatus(form, "Отправляем данные…", false);

    try {
      var response = await fetch(API_ENDPOINT, {
        method: "POST",
        headers: { "Accept": "application/json", "Content-Type": "application/json" },
        body: JSON.stringify(payloadFrom(form)),
        credentials: "same-origin"
      });
      var text = await response.text();
      var result = {};
      try {
        result = text ? JSON.parse(text) : {};
      } catch (_) {
        result = {};
      }

      if (!response.ok || result.success === false || result.ok === false) {
        throw new Error(firstServerError(result));
      }

      var submissionInput = form.querySelector('input[name="submissionId"]');
      if (submissionInput && submissionInput.dataset.storageKey) {
        try {
          sessionStorage.removeItem(submissionInput.dataset.storageKey);
        } catch (_) {
          // No action is needed when browser storage is unavailable.
        }
      }
      form.reset();
      if (submissionInput) submissionInput.value = "";
      setStatus(form, result.message || "Данные отправлены. Мы изучим задачу и свяжемся, чтобы согласовать следующий шаг.", false);
    } catch (error) {
      setStatus(form, error && error.message ? error.message : "Не удалось отправить данные. Попробуйте ещё раз или свяжитесь с нами по телефону.", true);
    } finally {
      form.dataset.leadSubmitting = "false";
      form.removeAttribute("aria-busy");
      if (button && button.isConnected) button.disabled = false;
    }
  }

  document.addEventListener("submit", submitForm, true);
  enhanceAllForms(document);
  ensureHomepageDemo();

  new MutationObserver(scheduleEnhancement).observe(document.documentElement, {
    childList: true,
    subtree: true
  });
})();
