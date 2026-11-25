import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { disableAnalytics, initAnalytics, trackPageView } from "@/lib/analytics";

const CONSENT_KEY = "agricapital_analytics_consent";

const readChoice = () => {
  try { return localStorage.getItem(CONSENT_KEY); } catch { return null; }
};

const CookieConsent = () => {
  const location = useLocation();
  const [visible, setVisible] = useState(() => readChoice() === null);

  useEffect(() => {
    const show = () => setVisible(true);
    window.addEventListener("agricapital:show-consent", show);
    return () => window.removeEventListener("agricapital:show-consent", show);
  }, []);

  const saveChoice = (next: "accepted" | "rejected") => {
    try { localStorage.setItem(CONSENT_KEY, next); } catch { /* Keep analytics disabled if storage is unavailable. */ }
    setVisible(false);
    if (next === "rejected") disableAnalytics();
    if (next === "accepted") {
      initAnalytics();
      trackPageView(location.pathname + location.search);
    }
    window.dispatchEvent(new Event("agricapital:consent-updated"));
  };

  if (!visible) return null;

  return (
    <section
      role="dialog"
      aria-modal="false"
      aria-label="Préférences de confidentialité"
      className="fixed inset-x-4 bottom-4 z-[100] mx-auto max-w-2xl rounded-2xl border border-border bg-background p-5 text-foreground shadow-2xl"
    >
      <h2 className="text-base font-bold">Votre confidentialité compte</h2>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">
        Les statistiques de fréquentation restent désactivées tant que vous ne les acceptez pas.
        Votre choix peut être modifié à tout moment.{" "}
        <a href="/mentions-legales#confidentialite" className="font-semibold text-primary underline underline-offset-2">
          En savoir plus
        </a>.
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
        <button type="button" onClick={() => saveChoice("rejected")} className="rounded-full border border-primary px-4 py-2 text-sm font-semibold text-primary">
          Refuser
        </button>
        <button type="button" onClick={() => saveChoice("accepted")} className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground">
          Accepter les statistiques
        </button>
      </div>
    </section>
  );
};

export default CookieConsent;
