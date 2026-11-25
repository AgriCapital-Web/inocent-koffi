/**
 * GA4 analytics — no-op until the visitor has explicitly accepted statistics.
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

const hasAnalyticsConsent = () => {
  try {
    return localStorage.getItem("agricapital_analytics_consent") === "accepted";
  } catch {
    return false;
  }
};

export const isAnalyticsEnabled = () => Boolean(MEASUREMENT_ID) && hasAnalyticsConsent();

export const gtag = (...args: unknown[]) => {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push(args);
};

export const initAnalytics = () => {
  if (!MEASUREMENT_ID || typeof document === "undefined" || !hasAnalyticsConsent()) return;
  if (initialized) {
    gtag("consent", "update", { analytics_storage: "granted", ad_storage: "denied", ad_user_data: "denied", ad_personalization: "denied" });
    return;
  }
  initialized = true;

  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${MEASUREMENT_ID}`;
  document.head.appendChild(script);

  gtag("js", new Date());
  gtag("config", MEASUREMENT_ID, { send_page_view: false });
  gtag("consent", "update", { analytics_storage: "granted", ad_storage: "denied", ad_user_data: "denied", ad_personalization: "denied" });
};

export const disableAnalytics = () => {
  if (typeof document !== "undefined") {
    gtag("consent", "update", { analytics_storage: "denied", ad_storage: "denied", ad_user_data: "denied", ad_personalization: "denied" });
    document.cookie.split(";").forEach((part) => {
      const name = part.trim().split("=")[0];
      if (name.startsWith("_ga")) {
        document.cookie = `${name}=; Max-Age=0; path=/`;
        document.cookie = `${name}=; Max-Age=0; path=/; domain=.ikoffi.agricapital.ci`;
      }
    });
  }
};

export const trackPageView = (path: string, title?: string) => {
  if (!isAnalyticsEnabled()) return;
  initAnalytics();
  gtag("event", "page_view", {
    page_path: path,
    page_location: typeof window !== "undefined" ? window.location.href : undefined,
    page_title: title ?? (typeof document !== "undefined" ? document.title : undefined),
  });
};

export const trackEvent = (name: string, params: Record<string, unknown> = {}) => {
  if (!isAnalyticsEnabled()) {
    if (import.meta.env.DEV) console.debug("[analytics:noop]", name, params);
    return;
  }
  initAnalytics();
  gtag("event", name, params);
};

export const trackCta = (label: string, location: string, extra: Record<string, unknown> = {}) =>
  trackEvent("cta_click", { cta_label: label, cta_location: location, ...extra });

export const trackLead = (formName: string, extra: Record<string, unknown> = {}) => {
  trackEvent("generate_lead", { form_name: formName, ...extra });
  trackEvent("form_submit", { form_name: formName, ...extra });
};
