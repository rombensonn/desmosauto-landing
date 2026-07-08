"use client";

import { ArrowRight, CheckCircle2, Loader2 } from "lucide-react";
import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { validateLeadInput } from "@/lib/validation";

type LeadFormProps = {
  submitLabel?: string;
  source: string;
  compact?: boolean;
};

type FormErrors = Partial<
  Record<"name" | "phone" | "privacyPolicyAccepted" | "personalDataConsent" | "form", string>
>;

const initialFields = {
  name: "",
  phone: "",
  website: "",
  privacyPolicyAccepted: false,
  personalDataConsent: false
};

function getDraftKey(source: string) {
  return `desmosauto:lead-draft:${source}`;
}

function formatRussianPhone(value: string): string {
  let digits = value.replace(/\D/g, "");

  if (digits.startsWith("8")) {
    digits = `7${digits.slice(1)}`;
  }

  if (digits.startsWith("7")) {
    digits = digits.slice(1);
  }

  digits = digits.slice(0, 10);

  if (!digits) {
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

export function LeadForm({ submitLabel = "Получить демо за сутки", source, compact = false }: LeadFormProps) {
  const [fields, setFields] = useState(initialFields);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const endpoint = process.env.NEXT_PUBLIC_LEAD_ENDPOINT || "/api/leads.php";
  const draftKey = getDraftKey(source);

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
          phone: typeof parsedDraft.phone === "string" ? parsedDraft.phone : current.phone
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
      if (!fields.name && !fields.phone) {
        window.sessionStorage.removeItem(draftKey);
        return;
      }

      window.sessionStorage.setItem(
        draftKey,
        JSON.stringify({
          name: fields.name,
          phone: fields.phone
        })
      );
    } catch {
      // Session storage can be unavailable in strict browser privacy modes.
    }
  }, [draftKey, fields.name, fields.phone]);

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

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSuccessMessage("");

    if (!validateCurrentFields()) {
      return;
    }

    setIsSubmitting(true);
    setErrors({});

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name: fields.name,
          phone: fields.phone,
          website: fields.website,
          privacyPolicyAccepted: fields.privacyPolicyAccepted,
          personalDataConsent: fields.personalDataConsent,
          source
        })
      });

      const result = await response.json().catch(() => ({}));

      if (!response.ok || result.ok === false) {
        setErrors({
          name: result.errors?.name,
          phone: result.errors?.phone,
          privacyPolicyAccepted: result.errors?.privacyPolicyAccepted,
          personalDataConsent: result.errors?.personalDataConsent,
          form: result.message || "Не удалось отправить заявку. Проверьте поля и попробуйте ещё раз."
        });
        return;
      }

      setSuccessMessage(
        result.message ||
          "Заявка отправлена. Мы свяжемся с вами и уточним, какой сайт нужен вашему автосервису."
      );
      window.sessionStorage.removeItem(draftKey);
      setFields(initialFields);
    } catch {
      setErrors({
        form:
          "Не удалось связаться с обработчиком заявки. Проверьте PHP endpoint или укажите NEXT_PUBLIC_LEAD_ENDPOINT."
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
            onBlur={validateCurrentFields}
            onChange={(event) => setFields((current) => ({ ...current, name: event.target.value }))}
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
            value={fields.phone}
            onBlur={validateCurrentFields}
            onChange={(event) =>
              setFields((current) => ({ ...current, phone: formatRussianPhone(event.target.value) }))
            }
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
      </div>

      <div className="flex items-start gap-3 text-sm leading-6 text-neutral-700">
        <input
          id={`${source}-privacy-policy-accepted`}
          type="checkbox"
          checked={fields.privacyPolicyAccepted}
          onChange={(event) =>
            setFields((current) => ({ ...current, privacyPolicyAccepted: event.target.checked }))
          }
          className="mt-1 h-5 w-5 rounded border-neutral-300 accent-neutral-950"
          aria-invalid={Boolean(errors.privacyPolicyAccepted)}
          aria-labelledby={`${source}-privacy-policy-label`}
          aria-describedby={errors.privacyPolicyAccepted ? `${source}-privacy-error` : undefined}
          required
        />
        <p id={`${source}-privacy-policy-label`}>
          Я ознакомлен(а) с{" "}
          <Link className="font-semibold text-neutral-950 underline underline-offset-4" href="/privacy-policy">
            Политикой конфиденциальности и обработки персональных данных
          </Link>
          .
        </p>
      </div>
      {errors.privacyPolicyAccepted ? (
        <p id={`${source}-privacy-error`} className="-mt-2 text-sm font-semibold text-red-700" role="alert">
          {errors.privacyPolicyAccepted}
        </p>
      ) : null}

      <div className="flex items-start gap-3 text-sm leading-6 text-neutral-700">
        <input
          id={`${source}-personal-data-consent`}
          type="checkbox"
          checked={fields.personalDataConsent}
          onChange={(event) =>
            setFields((current) => ({ ...current, personalDataConsent: event.target.checked }))
          }
          className="mt-1 h-5 w-5 rounded border-neutral-300 accent-neutral-950"
          aria-invalid={Boolean(errors.personalDataConsent)}
          aria-labelledby={`${source}-personal-data-label`}
          aria-describedby={errors.personalDataConsent ? `${source}-personal-data-error` : undefined}
          required
        />
        <p id={`${source}-personal-data-label`}>
          Даю{" "}
          <Link className="font-semibold text-neutral-950 underline underline-offset-4" href="/personal-data-consent">
            согласие на обработку персональных данных
          </Link>
          .
        </p>
      </div>
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
