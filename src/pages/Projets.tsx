import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { ExternalLink } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";

type Site = { id: string; name: string; description: string | null; url: string; logo_url: string | null; category: string | null };

const FALLBACK: Site[] = [
  { id: "1", name: "AgriCapital", description: "Société agricole que j'ai fondée et que je dirige, à Daloa.", url: "https://agricapital.ci", logo_url: null, category: "Agro" },
  { id: "2", name: "Espace client AgriCapital", description: "Suivi en ligne pour les clients d'AgriCapital.", url: "https://client.agricapital.ci", logo_url: null, category: "Agro" },
  { id: "3", name: "Application AgriCapital", description: "Outil de gestion interne d'AgriCapital.", url: "https://app.agricapital.ci", logo_url: null, category: "Agro" },
  { id: "4", name: "SMS Pro Mobile", description: "Plateforme d'envoi de SMS professionnels.", url: "https://smspromobile.com", logo_url: null, category: "Digital" },
  { id: "5", name: "Scoly", description: "Plateforme pour l'éducation.", url: "https://scoly.ci", logo_url: null, category: "Éducation" },
];

export default function Projets() {
  const [sites, setSites] = useState<Site[]>(FALLBACK);
  useEffect(() => {
    supabase.from("sites").select("id,name,description,url,logo_url,category").eq("is_published", true).order("sort_order")
      .then(({ data }) => { if (data && data.length) setSites(data as Site[]); });
  }, []);

  return (
    <>
      <Helmet>
        <title>Autres projets | Inocent KOFFI</title>
        <meta name="description" content="Les autres projets et plateformes d'Inocent KOFFI : AgriCapital, SMS Pro Mobile, Scoly et plus." />
        <link rel="canonical" href="https://ikoffi.agricapital.ci/autres-projets" />
      </Helmet>
      <Navbar />
      <main className="bg-background">
        <section className="bg-primary text-primary-foreground">
          <div className="container mx-auto max-w-6xl px-4 pb-14 pt-28 sm:px-6 sm:pt-32 lg:px-8">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">Autres projets</p>
            <h1 className="mt-4 font-display text-4xl font-extrabold tracking-tight sm:text-6xl">Ce que je construis à côté.</h1>
            <p className="mt-5 max-w-2xl text-base text-primary-foreground/80 sm:text-lg">Entreprises et plateformes que j'ai lancées ou que j'accompagne.</p>
          </div>
        </section>
        <section className="container mx-auto grid max-w-6xl gap-5 px-4 py-14 sm:grid-cols-2 sm:px-6 lg:grid-cols-3 lg:px-8">
          {sites.map((s) => (
            <a key={s.id} href={s.url} target="_blank" rel="noopener noreferrer" className="group flex min-w-0 flex-col rounded-2xl border border-border bg-card p-6 transition-colors hover:border-accent">
              <div className="flex items-center gap-3">
                {s.logo_url ? <img src={s.logo_url} alt="" className="h-10 w-10 rounded-lg object-contain" loading="lazy" /> : <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary font-display font-bold text-primary-foreground">{s.name[0]}</span>}
                {s.category && <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">{s.category}</span>}
              </div>
              <h2 className="mt-5 font-display text-xl font-bold text-foreground">{s.name}</h2>
              {s.description && <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">{s.description}</p>}
              <span className="mt-5 inline-flex min-w-0 items-center gap-1.5 break-all text-sm font-semibold text-primary group-hover:text-accent">
                {s.url.replace(/^https?:\/\//, "")} <ExternalLink className="h-4 w-4 shrink-0" aria-hidden />
              </span>
            </a>
          ))}
        </section>
      </main>
      <Footer />
    </>
  );
}
