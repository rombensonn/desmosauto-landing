(function () {
  var navToggle = document.querySelector(".nav-toggle");
  var siteNav = document.querySelector("#site-nav");
  var stickyCta = document.querySelector("[data-sticky-cta]");
  var form = document.querySelector("[data-lead-form]");
  var submitButton = document.querySelector("[data-submit-button]");
  var statusNode = document.querySelector("[data-form-status]");
  var formStartedAt = Math.floor(Date.now() / 1000);
  var stickyTicking = false;
  var utmNames = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"];

  function setHiddenField(name, value) {
    var field = document.querySelector('[data-hidden-field="' + name + '"]');

    if (field) {
      field.value = value || "";
    }
  }

  function populateHiddenFields() {
    var params = new URLSearchParams(window.location.search);

    utmNames.forEach(function (name) {
      setHiddenField(name, params.get(name));
    });

    setHiddenField("page_url", window.location.href);
    setHiddenField("referrer", document.referrer);
    setHiddenField("user_agent", window.navigator.userAgent);
    setHiddenField("timestamp", new Date().toISOString());
    setHiddenField("form_started_at", String(formStartedAt));
  }

  function setFieldError(name, message) {
    var errorNode = document.querySelector('[data-error-for="' + name + '"]');
    var field = form ? form.querySelector('[name="' + name + '"]') : null;

    if (errorNode) {
      errorNode.textContent = message || "";
    }

    if (field && field.matches("input, select, textarea")) {
      field.setAttribute("aria-invalid", message ? "true" : "false");
    }
  }

  function getField(name) {
    return form ? form.querySelector('[name="' + name + '"]') : null;
  }

  function clearErrors() {
    if (!form) {
      return;
    }

    form.querySelectorAll("[data-error-for]").forEach(function (node) {
      node.textContent = "";
    });

    form.querySelectorAll("[aria-invalid]").forEach(function (node) {
      node.setAttribute("aria-invalid", "false");
    });
  }

  function setStatus(type, message) {
    if (!statusNode) {
      return;
    }

    statusNode.textContent = message || "";
    statusNode.className = "form-status";

    if (message) {
      statusNode.classList.add("is-visible", type === "success" ? "is-success" : "is-error");
    }
  }

  function getPhoneDigits(value) {
    return value.replace(/\D/g, "");
  }

  function formatPhone(value) {
    var digits = getPhoneDigits(value);

    if (digits[0] === "8") {
      digits = "7" + digits.slice(1);
    }

    if (digits[0] !== "7") {
      digits = "7" + digits;
    }

    digits = digits.slice(0, 11);

    var parts = ["+7"];

    if (digits.length > 1) {
      parts.push(" (" + digits.slice(1, 4));
    }

    if (digits.length >= 4) {
      parts[1] += ")";
    }

    if (digits.length > 4) {
      parts.push(" " + digits.slice(4, 7));
    }

    if (digits.length > 7) {
      parts.push("-" + digits.slice(7, 9));
    }

    if (digits.length > 9) {
      parts.push("-" + digits.slice(9, 11));
    }

    return parts.join("");
  }

  function validateForm() {
    var errors = {};
    var requiredFields = ["name", "phone"];

    requiredFields.forEach(function (name) {
      var field = form.querySelector('[name="' + name + '"]');

      if (!field || !field.value.trim()) {
        errors[name] = "Заполните поле.";
      }
    });

    var nameField = getField("name");
    var phoneField = getField("phone");

    if (nameField && nameField.value.trim().length > 0 && nameField.value.trim().length < 2) {
      errors.name = "Укажите имя не короче 2 символов.";
    }

    var phoneDigits = getPhoneDigits(phoneField ? phoneField.value : "");

    if (phoneDigits.length < 10 || phoneDigits.length > 15) {
      errors.phone = "Укажите телефон в международном формате.";
    }

    Object.keys(errors).forEach(function (name) {
      setFieldError(name, errors[name]);
    });

    return errors;
  }

  if (navToggle && siteNav) {
    function setMenuOpen(isOpen) {
      siteNav.classList.toggle("is-open", isOpen);
      navToggle.setAttribute("aria-expanded", String(isOpen));
      navToggle.setAttribute("aria-label", isOpen ? "Закрыть меню" : "Открыть меню");
    }

    navToggle.addEventListener("click", function () {
      setMenuOpen(!siteNav.classList.contains("is-open"));
    });

    siteNav.addEventListener("click", function (event) {
      if (event.target.matches("a")) {
        setMenuOpen(false);
      }
    });

    document.addEventListener("click", function (event) {
      if (!siteNav.classList.contains("is-open")) {
        return;
      }

      if (!siteNav.contains(event.target) && !navToggle.contains(event.target)) {
        setMenuOpen(false);
      }
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && siteNav.classList.contains("is-open")) {
        setMenuOpen(false);
        navToggle.focus();
      }
    });
  }

  if (stickyCta) {
    function updateStickyCta() {
      stickyCta.classList.toggle("is-visible", window.scrollY > window.innerHeight * 0.75);
      stickyTicking = false;
    }

    window.addEventListener("scroll", function () {
      if (!stickyTicking) {
        window.requestAnimationFrame(updateStickyCta);
        stickyTicking = true;
      }
    }, { passive: true });

    updateStickyCta();
  }

  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener("click", function (event) {
      var target = document.querySelector(anchor.getAttribute("href"));

      if (!target) {
        return;
      }

      event.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });

  var phoneInput = getField("phone");

  if (phoneInput) {
    phoneInput.addEventListener("input", function () {
      phoneInput.value = formatPhone(phoneInput.value);
      setFieldError("phone", "");
    });
  }

  if (form) {
    populateHiddenFields();

    form.addEventListener("input", function (event) {
      if (event.target.name) {
        setFieldError(event.target.name.replace("[]", ""), "");
      }
    });

    form.addEventListener("submit", function (event) {
      event.preventDefault();
      clearErrors();
      setStatus("", "");
      populateHiddenFields();

      var errors = validateForm();

      if (Object.keys(errors).length > 0) {
        setStatus("error", "Проверьте поля формы.");
        return;
      }

      submitButton.disabled = true;
      submitButton.textContent = "Отправляем заявку...";

      fetch(form.action, {
        method: "POST",
        body: new FormData(form),
        headers: {
          Accept: "application/json"
        }
      })
        .then(function (response) {
          return response.json().then(function (payload) {
            return { ok: response.ok, payload: payload };
          });
        })
        .then(function (result) {
          if (!result.ok || !result.payload.success) {
            if (result.payload.errors) {
              Object.keys(result.payload.errors).forEach(function (name) {
                setFieldError(name, result.payload.errors[name]);
              });
            }

            setStatus("error", result.payload.message || "Не удалось отправить заявку. Попробуйте еще раз.");
            return;
          }

          form.reset();
          formStartedAt = Math.floor(Date.now() / 1000);
          populateHiddenFields();
          setStatus("success", result.payload.message || "Заявка отправлена. Мы свяжемся с вами.");
        })
        .catch(function () {
          setStatus("error", "Не удалось отправить заявку. Проверьте интернет и попробуйте еще раз.");
        })
        .finally(function () {
          submitButton.disabled = false;
          submitButton.textContent = "Получить демо-сайт";
        });
    });
  }
})();
