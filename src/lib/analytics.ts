/**
 * GA4 analytics — safe no-op when no measurement ID is configured.
 * Measurement ID comes from the Google Analytics connector env var.
 */
const MEASUREMENT_ID =
  (import.meta.env.VITE_LOVABLE_CONNECTOR_GOOGLE_ANALYTICS_API_KEY as string | undefined) ||
  (import.meta.env.VITE_GA4_MEASUREMENT_ID as string | undefined) ||
  "";

declare global {
  interface Window {
    dataLayer?: unknown[];
  }
}

let initialized = false;

export const isAnalyticsEnabled = () => Boolean(MEASUREMENT_ID);

export const gtag = (...args: unknown[]) => {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push(args);
};

export const initAnalytics = () => {
  if (initialized || !MEASUREMENT_ID || typeof document === "undefined") return;
  initialized = true;

  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${MEASUREMENT_ID}`;
  document.head.appendChild(script);

  gtag("js", new Date());
  gtag("config", MEASUREMENT_ID, { send_page_view: true });
};

export const trackPageView = (path: string, title?: string) => {
  if (!MEASUREMENT_ID) return;
  gtag("event", "page_view", {
    page_path: path,
    page_location: typeof window !== "undefined" ? window.location.href : undefined,
    page_title: title ?? (typeof document !== "undefined" ? document.title : undefined),
  });
};

export const trackEvent = (name: string, params: Record<string, unknown> = {}) => {
  if (!MEASUREMENT_ID) {
    if (import.meta.env.DEV) console.debug("[analytics:noop]", name, params);
    return;
  }
  gtag("event", name, params);
};

/** CTA click: `location` = page/section, `label` = which CTA. */
export const trackCta = (label: string, location: string, extra: Record<string, unknown> = {}) =>
  trackEvent("cta_click", { cta_label: label, cta_location: location, ...extra });

/** Lead form submitted successfully. */
export const trackLead = (formName: string, extra: Record<string, unknown> = {}) => {
  trackEvent("generate_lead", { form_name: formName, ...extra });
  trackEvent("form_submit", { form_name: formName, ...extra });
};