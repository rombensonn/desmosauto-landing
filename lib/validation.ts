export type LeadPayload = {
  name: string;
  phone: string;
  website?: string;
  privacyPolicyAccepted?: boolean;
  personalDataConsent?: boolean;
  pageUrl?: string;
  source?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  referrer?: string;
};

export type ValidationResult = {
  valid: boolean;
  errors: Partial<Record<"name" | "phone" | "privacyPolicyAccepted" | "personalDataConsent", string>>;
};

export function normalizeLeadPayload(payload: Partial<LeadPayload>): LeadPayload {
  return {
    name: String(payload.name || "").trim(),
    phone: String(payload.phone || "").trim(),
    website: String(payload.website || "").trim(),
    privacyPolicyAccepted: Boolean(payload.privacyPolicyAccepted),
    personalDataConsent: Boolean(payload.personalDataConsent),
    pageUrl: String(payload.pageUrl || "").trim(),
    source: String(payload.source || "").trim(),
    utm_source: String(payload.utm_source || "").trim(),
    utm_medium: String(payload.utm_medium || "").trim(),
    utm_campaign: String(payload.utm_campaign || "").trim(),
    referrer: String(payload.referrer || "").trim()
  };
}

export function validateLeadInput(payload: Pick<LeadPayload, "name" | "phone">): ValidationResult {
  const errors: ValidationResult["errors"] = {};
  const name = payload.name.trim();
  const phone = payload.phone.trim();
  const phoneDigits = phone.replace(/\D/g, "");

  if (name.length < 2) {
    errors.name = "Укажите имя не короче 2 символов.";
  }

  if (!phone) {
    errors.phone = "Укажите номер телефона.";
  } else if (phoneDigits.length < 10 || phoneDigits.length > 15) {
    errors.phone = "Проверьте номер: нужно 10-15 цифр.";
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors
  };
}
