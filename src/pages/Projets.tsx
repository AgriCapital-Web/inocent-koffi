import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { ArrowRight, ExternalLink, Globe, LayoutDashboard, Sprout, Users } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
const plantation = { url: "/images/agricapital/plantation-cle-en-main.webp" };
const patrimoine = { url: "https://dmmcy0pwk6bqi.cloudfront.net/0c4c37cc51ecc3beea94513bd8e1506e41aa2922" };

const interfaces = [
  { icon: Globe, title: "Le site officiel", label: "Découvrir AgriCapital", url: "https://www.agricapital.ci", domain: "www.agricapital.ci", text: "La vision, les offres et les informations officielles d’AgriCapital. Le point d’entrée pour découvrir l’entreprise et envisager un projet agricole." },
  { icon: LayoutDashboard, title: "L’application métier", label: "Accéder à l’espace de gestion", url: "https://app.agricapital.ci", domain: "app.agricapital.ci", text: "Un outil métier et CRM que j’ai développé pour les besoins opérationnels d’AgriCapital. Un environnement réservé aux équipes pour organiser et accompagner le développement de ses activités." },
  { icon: Users, title: "Le portail client", label: "Accéder à mon espace client", url: "https://client.agricapital.ci", domain: "client.agricapital.ci", text: "Un espace personnalisé que j’ai développé pour nos clients : suivi en temps réel de leur plantation et échanges transparents avec l’équipe opérationnelle." },
];
export default function Projets() {
  const title = "Autres projets — AgriCapital | Inocent KOFFI";
  const description = "AgriCapital, initiative personnelle d’Inocent KOFFI, fondateur et gérant : rendre l’agriculture productive plus accessible. Site officiel, application métier et portail client.";
  return <><Helmet><title>{title}</title><meta name="description" content={description}/><meta property="og:title" content={title}/><meta property="og:description" content={description}/><meta property="og:type" content="website"/><meta name="twitter:card" content="summary_large_image"/></Helmet><Navbar/>
    <main>
      <section className="bg-primary text-primary-foreground">
        <div className="mx-auto max-w-6xl px-4 pb-12 pt-28 sm:px-6 sm:pt-32 lg:px-8">
          <p className="text-xs font-semibold uppercase tracking-widest text-accent">Autres projets · Mon initiative entrepreneuriale</p>
          <h1 className="mt-5 font-display text-5xl font-extrabold sm:text-7xl">AgriCapital</h1>
          <p className="mt-5 max-w-3xl font-display text-2xl leading-snug sm:text-3xl">Rendre l’agriculture productive plus accessible.</p>
          <p className="mt-6 max-w-2xl leading-relaxed text-primary-foreground/80">J’ai fondé AgriCapital SARL et j’en assure la gérance. Une initiative qui relie ma vision entrepreneuriale à un objectif concret : structurer des projets agricoles utiles et accessibles.</p>
          <div className="mt-7 flex flex-wrap gap-3"><Button asChild className="bg-accent text-accent-foreground hover:bg-accent/90"><a href="https://www.agricapital.ci" target="_blank" rel="noopener noreferrer">Découvrir AgriCapital <ExternalLink className="ml-2 h-4 w-4"/></a></Button><Button asChild variant="outline" className="border-primary-foreground/30 bg-transparent text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"><Link to="/partenariat">Devenir partenaire <ArrowRight className="ml-2 h-4 w-4"/></Link></Button></div>
        </div>
      </section>
      <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-10">
          <figure className="flex min-h-[320px] items-center justify-center overflow-hidden rounded-xl border border-border bg-muted/30 p-4">
            <img src={patrimoine.url} alt="AgriCapital — Votre patrimoine agricole prend racine ici" width="320" height="228" className="h-auto w-full max-w-[520px] object-contain" loading="lazy" decoding="async" onError={(e) => { e.currentTarget.src = plantation.url; }} />
          </figure>
          <div className="mx-auto max-w-3xl text-center">
            <Sprout className="mx-auto h-8 w-8 text-accent"/>
            <h2 className="mt-4 text-3xl font-bold">Une vision qui se structure, étape après étape.</h2>
            <p className="mt-5 leading-relaxed text-muted-foreground">La construction d’AgriCapital se poursuit avec le déploiement des outils nécessaires à son fonctionnement. J’ai conçu deux interfaces complémentaires : l’une pour les équipes, l’autre pour les clients.</p>
            <p className="mt-5 font-display text-xl font-semibold">Deux interfaces. Deux usages. Une même vision.</p>
            <Button asChild variant="link" className="mt-4 h-auto p-0"><Link to="/agricapital">En savoir plus sur l’initiative <ArrowRight className="ml-2 h-4 w-4"/></Link></Button>
          </div>
          <figure className="flex min-h-[320px] items-center justify-center overflow-hidden rounded-xl border border-border bg-muted/30 p-4">
            <img src={plantation.url} alt="Plantation clé en main présentée par AgriCapital" width="800" height="600" className="h-[520px] w-full object-cover object-[center_bottom]" loading="lazy" decoding="async" onError={(e) => { e.currentTarget.src = patrimoine.url; }} />
          </figure>
        </div>
      </section>
      <section className="border-y border-border bg-secondary/40"><div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8"><p className="text-xs font-semibold uppercase tracking-widest text-accent">L’écosystème digital</p><h2 className="mt-3 text-3xl font-bold">Trois accès, au service d’AgriCapital.</h2><div className="mt-8 grid gap-5 md:grid-cols-3">{interfaces.map(({icon:Icon,...item})=><article key={item.domain} className="flex min-w-0 flex-col rounded-lg border border-border bg-card p-6"><Icon className="h-7 w-7 text-accent"/><h3 className="mt-5 text-xl font-bold">{item.title}</h3><p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">{item.text}</p><p className="mt-5 break-all text-xs text-muted-foreground">{item.domain}</p><Button asChild variant="link" className="mt-3 h-auto justify-start whitespace-normal p-0 text-left"><a href={item.url} target="_blank" rel="noopener noreferrer">{item.label} <ExternalLink className="ml-2 h-4 w-4 shrink-0"/></a></Button></article>)}</div></div></section>
      <section className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-6 px-4 py-14 sm:px-6 md:flex-row md:items-center lg:px-8"><div><h2 className="text-2xl font-bold">Construisons une agriculture plus accessible.</h2><p className="mt-3 text-muted-foreground">Un projet agricole, une collaboration ou une question sur AgriCapital ?</p></div><Button asChild><a href="https://www.agricapital.ci/contact" target="_blank" rel="noopener noreferrer">Contacter AgriCapital <ArrowRight className="ml-2 h-4 w-4"/></a></Button></section>
    </main><Footer/></>;
}
