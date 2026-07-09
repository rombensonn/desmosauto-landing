"use client";

import { ArrowRight, CheckCircle2, Loader2 } from "lucide-react";
import Link from "next/link";
import { ChangeEvent, FormEvent, useEffect, useLayoutEffect, useRef, useState } from "react";
import { validateLeadInput } from "@/lib/validation";

type LeadFormProps = {
  submitLabel?: string;
  source: string;
  compact?: boolean;
};

type FormErrors = Partial<
  Record<"name" | "phone" | "promoCode" | "privacyPolicyAccepted" | "personalDataConsent" | "form", string>
>;
type FormErrorKey = keyof FormErrors;
type PhoneFormatResult = {
  value: string;
  caretPosition?: number;
};

const initialFields = {
  name: "",
  phone: "",
  promoCode: "",
  website: "",
  privacyPolicyAccepted: false,
  personalDataConsent: false
};

const russianPhoneLocalDigitsLimit = 10;

function getDraftKey(source: string) {
  return `desmosauto:lead-draft:${source}`;
}

function getRussianPhoneDigits(value: string) {
  return value.replace(/\D/g, "");
}

function hasRussianCountryPrefix(digits: string) {
  return digits.startsWith("7") || digits.startsWith("8");
}

function getRussianPhoneLocalDigits(value: string) {
  const digits = getRussianPhoneDigits(value);

  if (!digits) {
    return "";
  }

  if (hasRussianCountryPrefix(digits)) {
    return digits.slice(1, russianPhoneLocalDigitsLimit + 1);
  }

  return digits.slice(0, russianPhoneLocalDigitsLimit);
}

function shouldShowRussianPhonePrefix(value: string, localDigits: string) {
  const digits = getRussianPhoneDigits(value);
  const trimmedValue = value.trim();

  return (
    Boolean(localDigits) ||
    digits === "7" ||
    digits === "8" ||
    trimmedValue === "+7" ||
    trimmedValue === "+7 ("
  );
}

function formatRussianPhoneDigits(digits: string, showPrefix = Boolean(digits)): string {
  if (!digits && !showPrefix) {
    return "";
  }

  const parts = {
    code: digits.slice(0, 3),
    first: digits.slice(3, 6),
    second: digits.slice(6, 8),
    third: digits.slice(8, 10)
  };

  let phone = "+7";

  if (parts.code) {
    phone += ` (${parts.code}`;
  }

  if (parts.code.length === 3) {
    phone += ")";
  }

  if (parts.first) {
    phone += ` ${parts.first}`;
  }

  if (parts.second) {
    phone += ` ${parts.second}`;
  }

  if (parts.third) {
    phone += `-${parts.third}`;
  }

  return phone;
}

function formatRussianPhone(value: string): string {
  const localDigits = getRussianPhoneLocalDigits(value);

  return formatRussianPhoneDigits(localDigits, shouldShowRussianPhonePrefix(value, localDigits));
}

function formatPromoCodeInput(value: string) {
  return value.toUpperCase().replace(/\s+/g, "").slice(0, 32);
}

function getLocalDigitOffsetBeforeCaret(value: string, caretPosition: number | null) {
  const safeCaretPosition = caretPosition ?? value.length;
  const digits = getRussianPhoneDigits(value);
  const digitsBeforeCaret = getRussianPhoneDigits(value.slice(0, safeCaretPosition));
  const countryPrefixOffset =
    hasRussianCountryPrefix(digits) && digitsBeforeCaret.length > 0 ? 1 : 0;

  return Math.max(0, digitsBeforeCaret.length - countryPrefixOffset);
}

function removeDigitAtIndex(digits: string, index: number) {
  return `${digits.slice(0, index)}${digits.slice(index + 1)}`;
}

function getCaretPositionForLocalDigitOffset(value: string, localDigitOffset: number) {
  if (!value) {
    return 0;
  }

  if (localDigitOffset <= 0) {
    const codeStartIndex = value.indexOf("(");

    return codeStartIndex === -1 ? value.length : codeStartIndex + 1;
  }

  const digits = getRussianPhoneDigits(value);
  const skipsCountryPrefix = hasRussianCountryPrefix(digits);
  let hasSkippedCountryPrefix = false;
  let localDigitsSeen = 0;

  for (let index = 0; index < value.length; index += 1) {
    if (!/\d/.test(value[index])) {
      continue;
    }

    if (skipsCountryPrefix && !hasSkippedCountryPrefix) {
      hasSkippedCountryPrefix = true;
      continue;
    }

    localDigitsSeen += 1;

    if (localDigitsSeen >= localDigitOffset) {
      return index + 1;
    }
  }

  return value.length;
}

function formatRussianPhoneAfterInput(
  value: string,
  previousValue: string,
  inputType: string,
  caretPosition: number | null
): PhoneFormatResult {
  const nextValue = formatRussianPhone(value);

  if (!inputType.startsWith("delete")) {
    return { value: nextValue };
  }

  const previousLocalDigits = getRussianPhoneLocalDigits(previousValue);
  const nextLocalDigits = getRussianPhoneLocalDigits(value);
  const localDigitOffset = getLocalDigitOffsetBeforeCaret(value, caretPosition);

  if (nextValue !== previousValue || value.length >= previousValue.length) {
    return {
      value: nextValue,
      caretPosition:
        previousLocalDigits.length > nextLocalDigits.length
          ? getCaretPositionForLocalDigitOffset(nextValue, localDigitOffset)
          : undefined
    };
  }

  if (!previousLocalDigits || previousLocalDigits.length !== nextLocalDigits.length) {
    return { value: nextValue };
  }

  const removeIndex = Math.min(previousLocalDigits.length - 1, Math.max(0, localDigitOffset - 1));
  const reducedDigits = removeDigitAtIndex(previousLocalDigits, removeIndex);
  const formattedValue = formatRussianPhoneDigits(reducedDigits, Boolean(reducedDigits));
  const nextLocalDigitOffset = localDigitOffset === 0 ? 0 : localDigitOffset - 1;

  return {
    value: formattedValue,
    caretPosition: getCaretPositionForLocalDigitOffset(formattedValue, nextLocalDigitOffset)
  };
}

function getLeadContext() {
  const searchParams = new URLSearchParams(window.location.search);

  return {
    pageUrl: window.location.href,
    referrer: document.referrer,
    utm_source: searchParams.get("utm_source") || "",
    utm_medium: searchParams.get("utm_medium") || "",
    utm_campaign: searchParams.get("utm_campaign") || ""
  };
}

function getRegistrableHost(hostname: string) {
  return hostname.toLowerCase().replace(/^www\./, "");
}

function resolveLeadEndpoint(endpoint: string) {
  if (typeof window === "undefined") {
    return endpoint;
  }

  try {
    const targetUrl = new URL(endpoint, window.location.origin);
    const currentUrl = new URL(window.location.href);
    const isSameSite =
      targetUrl.protocol === currentUrl.protocol &&
      getRegistrableHost(targetUrl.hostname) === getRegistrableHost(currentUrl.hostname);

    if (isSameSite) {
      return `${targetUrl.pathname}${targetUrl.search}${targetUrl.hash}`;
    }

    return targetUrl.toString();
  } catch {
    return "/api/leads.php";
  }
}

export function LeadForm({ submitLabel = "Получить демо за сутки", source, compact = false }: LeadFormProps) {
  const [fields, setFields] = useState(initialFields);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const phoneInputRef = useRef<HTMLInputElement>(null);
  const nextPhoneCaretPositionRef = useRef<number | null>(null);
  const endpoint = process.env.NEXT_PUBLIC_LEAD_ENDPOINT || "/api/leads.php";
  const draftKey = getDraftKey(source);

  useLayoutEffect(() => {
    const nextPhoneCaretPosition = nextPhoneCaretPositionRef.current;
    nextPhoneCaretPositionRef.current = null;
    const phoneInput = phoneInputRef.current;

    if (nextPhoneCaretPosition === null || !phoneInput || document.activeElement !== phoneInput) {
      return;
    }

    const safeCaretPosition = Math.min(nextPhoneCaretPosition, fields.phone.length);
    phoneInput.setSelectionRange(safeCaretPosition, safeCaretPosition);
  }, [fields.phone]);

  useEffect(() => {
    let frameId = 0;

    try {
      const savedDraft = window.sessionStorage.getItem(draftKey);

      if (!savedDraft) {
        return undefined;
      }

      const parsedDraft = JSON.parse(savedDraft) as Partial<typeof initialFields>;

      frameId = window.requestAnimationFrame(() => {
        setFields((current) => ({
          ...current,
          name: typeof parsedDraft.name === "string" ? parsedDraft.name : current.name,
          phone: typeof parsedDraft.phone === "string" ? parsedDraft.phone : current.phone,
          promoCode: typeof parsedDraft.promoCode === "string" ? parsedDraft.promoCode : current.promoCode
        }));
      });
    } catch {
      window.sessionStorage.removeItem(draftKey);
    }

    return () => {
      if (frameId) {
        window.cancelAnimationFrame(frameId);
      }
    };
  }, [draftKey]);

  useEffect(() => {
    try {
      if (!fields.name && !fields.phone && !fields.promoCode) {
        window.sessionStorage.removeItem(draftKey);
        return;
      }

      window.sessionStorage.setItem(
        draftKey,
        JSON.stringify({
          name: fields.name,
          phone: fields.phone,
          promoCode: fields.promoCode
        })
      );
    } catch {
      // Session storage can be unavailable in strict browser privacy modes.
    }
  }, [draftKey, fields.name, fields.phone, fields.promoCode]);

  function validateCurrentFields() {
    const result = validateLeadInput(fields);
    const nextErrors: FormErrors = { ...result.errors };

    if (!fields.privacyPolicyAccepted) {
      nextErrors.privacyPolicyAccepted = "Подтвердите ознакомление с политикой обработки персональных данных.";
    }

    if (!fields.personalDataConsent) {
      nextErrors.personalDataConsent = "Подтвердите согласие на обработку персональных данных.";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  function clearErrors(...keys: FormErrorKey[]) {
    setErrors((current) => {
      let hasChanges = false;
      const nextErrors = { ...current };

      for (const key of keys) {
        if (nextErrors[key]) {
          delete nextErrors[key];
          hasChanges = true;
        }
      }

      return hasChanges ? nextErrors : current;
    });
  }

  function handlePhoneChange(event: ChangeEvent<HTMLInputElement>) {
    const { selectionStart, value } = event.target;
    const inputType = "inputType" in event.nativeEvent ? String(event.nativeEvent.inputType) : "";

    setFields((current) => ({
      ...current,
      phone: (() => {
        const nextPhone = formatRussianPhoneAfterInput(value, current.phone, inputType, selectionStart);
        nextPhoneCaretPositionRef.current = nextPhone.caretPosition ?? null;

        return nextPhone.value;
      })()
    }));
    clearErrors("phone");
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSuccessMessage("");

    if (!validateCurrentFields()) {
      return;
    }

    setIsSubmitting(true);
    setErrors({});

    try {
      const response = await fetch(resolveLeadEndpoint(endpoint), {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name: fields.name,
          phone: fields.phone,
          promoCode: fields.promoCode,
          website: fields.website,
          privacyPolicyAccepted: fields.privacyPolicyAccepted,
          personalDataConsent: fields.personalDataConsent,
          ...getLeadContext(),
          source
        })
      });

      const result = await response.json().catch(() => null);

      if (!response.ok || result?.ok === false) {
        const fallbackMessage =
          response.status === 404
            ? "Не найден обработчик заявки. Проверьте, что api/leads.php загружен в корень сайта."
            : "Не удалось отправить заявку. Проверьте поля и попробуйте ещё раз.";

        setErrors({
          name: result?.errors?.name,
          phone: result?.errors?.phone,
          promoCode: result?.errors?.promoCode,
          privacyPolicyAccepted: result?.errors?.privacyPolicyAccepted,
          personalDataConsent: result?.errors?.personalDataConsent,
          form: result?.message || fallbackMessage
        });
        return;
      }

      setSuccessMessage(
        result?.message ||
          "Заявка отправлена. Мы свяжемся с вами и уточним, какой сайт нужен вашему автосервису."
      );
      window.sessionStorage.removeItem(draftKey);
      setFields(initialFields);
    } catch {
      setErrors({
        form: "Не удалось связаться с обработчиком заявки. Проверьте, что api/leads.php доступен на этом домене."
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form className="grid gap-4" onSubmit={handleSubmit} noValidate>
      <div className="hidden" aria-hidden="true">
        <label htmlFor={`${source}-website`}>Сайт</label>
        <input
          id={`${source}-website`}
          name="website"
          tabIndex={-1}
          autoComplete="off"
          value={fields.website}
          onChange={(event) => setFields((current) => ({ ...current, website: event.target.value }))}
        />
      </div>

      <div className={`grid gap-4 ${compact ? "md:grid-cols-2" : ""}`}>
        <div>
          <label className="mb-2 block text-sm font-bold text-neutral-900" htmlFor={`${source}-name`}>
            Имя
          </label>
          <input
            id={`${source}-name`}
            name="name"
            type="text"
            autoComplete="name"
            value={fields.name}
            onChange={(event) => {
              setFields((current) => ({ ...current, name: event.target.value }));
              clearErrors("name");
            }}
            className="min-h-12 w-full rounded-lg border border-neutral-300 bg-white px-4 text-base text-neutral-950 transition-colors placeholder:text-neutral-400 focus:border-neutral-950 focus:bg-white"
            placeholder="Как к вам обращаться"
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? `${source}-name-error` : undefined}
          />
          {errors.name ? (
            <p id={`${source}-name-error`} className="mt-2 text-sm font-semibold text-red-700" role="alert">
              {errors.name}
            </p>
          ) : null}
        </div>

        <div>
          <label className="mb-2 block text-sm font-bold text-neutral-900" htmlFor={`${source}-phone`}>
            Телефон
          </label>
          <input
            id={`${source}-phone`}
            name="phone"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            ref={phoneInputRef}
            value={fields.phone}
            onChange={handlePhoneChange}
            className="min-h-12 w-full rounded-lg border border-neutral-300 bg-white px-4 text-base text-neutral-950 transition-colors placeholder:text-neutral-400 focus:border-neutral-950 focus:bg-white"
            placeholder="+7 (999) 999 99-99"
            maxLength={18}
            aria-invalid={Boolean(errors.phone)}
            aria-describedby={errors.phone ? `${source}-phone-error` : undefined}
          />
          {errors.phone ? (
            <p id={`${source}-phone-error`} className="mt-2 text-sm font-semibold text-red-700" role="alert">
              {errors.phone}
            </p>
          ) : null}
        </div>

        <div className={compact ? "md:col-span-2" : ""}>
          <label className="mb-2 block text-sm font-bold text-neutral-900" htmlFor={`${source}-promo-code`}>
            Промокод, если есть
          </label>
          <input
            id={`${source}-promo-code`}
            name="promoCode"
            type="text"
            autoComplete="off"
            value={fields.promoCode}
            onChange={(event) => {
              setFields((current) => ({ ...current, promoCode: formatPromoCodeInput(event.target.value) }));
              clearErrors("promoCode");
            }}
            className="min-h-12 w-full rounded-lg border border-neutral-300 bg-white px-4 text-base text-neutral-950 transition-colors placeholder:text-neutral-400 focus:border-neutral-950 focus:bg-white"
            placeholder="Например, DEMO24"
            maxLength={32}
            aria-invalid={Boolean(errors.promoCode)}
            aria-describedby={errors.promoCode ? `${source}-promo-code-error` : undefined}
          />
          {errors.promoCode ? (
            <p id={`${source}-promo-code-error`} className="mt-2 text-sm font-semibold text-red-700" role="alert">
              {errors.promoCode}
            </p>
          ) : null}
        </div>
      </div>

      <label
        className="flex cursor-pointer items-start gap-4 rounded-lg py-1 text-sm leading-6 text-neutral-700"
        htmlFor={`${source}-privacy-policy-accepted`}
      >
        <input
          id={`${source}-privacy-policy-accepted`}
          type="checkbox"
          checked={fields.privacyPolicyAccepted}
          onChange={(event) => {
            setFields((current) => ({ ...current, privacyPolicyAccepted: event.target.checked }));
            clearErrors("privacyPolicyAccepted");
          }}
          className="mt-1 h-5 w-5 shrink-0 rounded border-neutral-300 accent-neutral-950"
          aria-invalid={Boolean(errors.privacyPolicyAccepted)}
          aria-labelledby={`${source}-privacy-policy-label`}
          aria-describedby={errors.privacyPolicyAccepted ? `${source}-privacy-error` : undefined}
          required
        />
        <span id={`${source}-privacy-policy-label`}>
          Я ознакомлен(а) с{" "}
          <Link
            className="font-semibold text-neutral-950 underline underline-offset-4"
            href="/privacy-policy"
            onClick={(event) => event.stopPropagation()}
          >
            Политикой конфиденциальности и обработки персональных данных
          </Link>
          .
        </span>
      </label>
      {errors.privacyPolicyAccepted ? (
        <p id={`${source}-privacy-error`} className="-mt-2 text-sm font-semibold text-red-700" role="alert">
          {errors.privacyPolicyAccepted}
        </p>
      ) : null}

      <label
        className="flex cursor-pointer items-start gap-4 rounded-lg py-1 text-sm leading-6 text-neutral-700"
        htmlFor={`${source}-personal-data-consent`}
      >
        <input
          id={`${source}-personal-data-consent`}
          type="checkbox"
          checked={fields.personalDataConsent}
          onChange={(event) => {
            setFields((current) => ({ ...current, personalDataConsent: event.target.checked }));
            clearErrors("personalDataConsent");
          }}
          className="mt-1 h-5 w-5 shrink-0 rounded border-neutral-300 accent-neutral-950"
          aria-invalid={Boolean(errors.personalDataConsent)}
          aria-labelledby={`${source}-personal-data-label`}
          aria-describedby={errors.personalDataConsent ? `${source}-personal-data-error` : undefined}
          required
        />
        <span id={`${source}-personal-data-label`}>
          Даю{" "}
          <Link
            className="font-semibold text-neutral-950 underline underline-offset-4"
            href="/personal-data-consent"
            onClick={(event) => event.stopPropagation()}
          >
            согласие на обработку персональных данных
          </Link>
          .
        </span>
      </label>
      {errors.personalDataConsent ? (
        <p id={`${source}-personal-data-error`} className="-mt-2 text-sm font-semibold text-red-700" role="alert">
          {errors.personalDataConsent}
        </p>
      ) : null}

      {errors.form ? (
        <p className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-800" role="alert">
          {errors.form}
        </p>
      ) : null}

      {successMessage ? (
        <p
          className="flex items-start gap-2 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm font-semibold text-green-800"
          role="status"
        >
          <CheckCircle2 aria-hidden="true" className="mt-0.5 shrink-0" size={18} />
          {successMessage}
        </p>
      ) : null}

      <button type="submit" className="btn-primary w-full" disabled={isSubmitting}>
        {isSubmitting ? <Loader2 aria-hidden="true" className="animate-spin" size={18} /> : null}
        {isSubmitting ? "Отправляем заявку" : submitLabel}
        {!isSubmitting ? <ArrowRight aria-hidden="true" size={18} /> : null}
      </button>
    </form>
  );
}
