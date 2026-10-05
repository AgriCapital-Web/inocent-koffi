import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Helmet } from "react-helmet-async";
import { ExternalLink, ArrowRight, Sprout, LandPlot, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

const offers = [
  {
    name: "PalmInvest",
    eyebrow: "Sans foncier",
    description: "Une solution pour investir dans une plantation de palmier à huile sans posséder de terrain : AgriCapital structure le foncier et le développement de la plantation.",
    points: ["Foncier sécurisé", "Plantation clé en main", "Accompagnement jusqu'à la mise en production"],
    icon: Sprout,
  },
  {
    name: "TerraPalm",
    eyebrow: "Avec foncier",
    description: "Une solution pour les propriétaires fonciers qui souhaitent transformer leur terre en actif agricole productif avec un accompagnement technique et opérationnel.",
    points: ["Le foncier reste au propriétaire", "Mise en valeur de la parcelle", "Suivi agronomique et opérationnel"],
    icon: LandPlot,
  },
  {
    name: "PalmTerroir Essentielle",
    eyebrow: "Accès progressif",
    description: "Une formule pensée pour faciliter l'accès progressif à un projet de plantation de palmier à huile avec un engagement initial puis un paiement mensuel.",
    points: ["Paiement initial : 230 000 FCFA", "3 500 FCFA par mois pendant 36 mois", "Projet structuré et suivi par AgriCapital"],
    icon: ShieldCheck,
  },
];

const Agricapital = () => (
  <>
    <Helmet>
      <title>AgriCapital | Réalisation d'Inocent KOFFI</title>
      <meta name="description" content="AgriCapital est l'un des projets entrepreneuriaux d'Inocent KOFFI. Découvrez les trois offres et accédez au site officiel d'AgriCapital." />
      <link rel="canonical" href="https://ikoffi.agricapital.ci/agricapital" />
    </Helmet>

    <div className="min-h-screen">
      <Navbar />
      <main className="pt-20">
        <section className="relative overflow-hidden py-20 sm:py-28 bg-gradient-to-br from-background via-secondary/30 to-accent/10">
          <div className="container mx-auto w-full px-4 sm:px-6 lg:px-8">
            <span className="inline-flex rounded-full border border-accent/30 bg-accent/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-accent-foreground">
              Réalisation · Agriculture
            </span>
            <h1 className="mt-5 text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">AgriCapital</h1>
            <p className="mt-5 max-w-3xl text-lg leading-relaxed text-muted-foreground">
              Une entreprise agricole que j'ai fondée et développée autour de la structuration, de la création et de l'accompagnement de plantations de palmier à huile en Côte d'Ivoire.
            </p>
            <p className="mt-4 max-w-3xl text-base leading-relaxed text-muted-foreground">
              Cette page présente uniquement le projet dans mon parcours. Pour les informations officielles, les conditions contractuelles, les actualités et les démarches, rendez-vous sur le site d'AgriCapital.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg">
                <a href="https://www.agricapital.ci" target="_blank" rel="noopener noreferrer">
                  Site officiel AgriCapital <ExternalLink className="ml-2 h-4 w-4" />
                </a>
              </Button>
              <Button asChild variant="outline" size="lg">
                <a href="https://www.agricapital.ci" target="_blank" rel="noopener noreferrer">
                  Découvrir les offres <ArrowRight className="ml-2 h-4 w-4" />
                </a>
              </Button>
            </div>
          </div>
        </section>

        <section className="py-16 sm:py-20 bg-background">
          <div className="container mx-auto w-full px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent">Les trois offres</p>
              <h2 className="mt-3 text-3xl font-bold text-foreground sm:text-4xl">Trois façons d'entrer dans le projet agricole</h2>
              <p className="mt-4 text-muted-foreground">Présentation synthétique issue du positionnement commercial du projet. Les conditions à jour restent celles du site officiel.</p>
            </div>

            <div className="mt-10 grid gap-5 lg:grid-cols-3">
              {offers.map((offer) => {
                const Icon = offer.icon;
                return (
                  <article key={offer.name} className="rounded-2xl border border-border/60 bg-card p-6 shadow-sm">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent text-primary-foreground">
                      <Icon className="h-6 w-6" />
                    </div>
                    <p className="mt-5 text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">{offer.eyebrow}</p>
                    <h3 className="mt-2 text-2xl font-bold text-foreground">{offer.name}</h3>
                    <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{offer.description}</p>
                    <ul className="mt-5 space-y-2">
                      {offer.points.map((point) => <li key={point} className="text-sm text-foreground/80">• {point}</li>)}
                    </ul>
                    <a href="https://www.agricapital.ci" target="_blank" rel="noopener noreferrer" className="mt-6 inline-flex items-center text-sm font-semibold text-primary hover:underline">
                      Voir sur le site officiel <ExternalLink className="ml-1.5 h-4 w-4" />
                    </a>
                  </article>
                );
              })}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  </>
);

export default Agricapital;
