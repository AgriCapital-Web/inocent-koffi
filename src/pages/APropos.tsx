import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Helmet } from "react-helmet-async";
import profilePhoto from "@/assets/profile-photo.webp";
import { ArrowRight, Code2, Brain, Video, Music2 } from "lucide-react";
import { Link } from "react-router-dom";

const APropos = () => (
  <>
    <Helmet>
      <title>À propos | Inocent KOFFI</title>
      <meta name="description" content="Parcours, méthode et univers professionnel d'Inocent KOFFI : entrepreneur Agro & Digital, développeur web, praticien IA et créateur de solutions." />
      <link rel="canonical" href="https://ikoffi.agricapital.ci/a-propos" />
    </Helmet>
    <div className="min-h-screen">
      <Navbar />
      <main className="pt-20">
        <section className="py-16 sm:py-24 bg-gradient-to-br from-background via-secondary/20 to-accent/10">
          <div className="container mx-auto w-full px-4 sm:px-6 lg:px-8">
            <div className="grid items-center gap-10 lg:grid-cols-[0.85fr_1.15fr]">
              <div className="mx-auto w-full max-w-md">
                <img src={profilePhoto} alt="Inocent KOFFI" className="w-full rounded-3xl object-cover shadow-2xl" loading="eager" />
              </div>
              <div>
                <span className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">À propos</span>
                <h1 className="mt-4 text-4xl font-bold tracking-tight text-foreground sm:text-5xl">Inocent KOFFI</h1>
                <p className="mt-4 text-xl font-semibold text-primary">Entrepreneur Agro & Digital · Développeur web · Praticien IA · Créateur de solutions</p>
                <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
                  Je transforme des idées, des besoins métier et des opportunités en solutions digitales concrètes : sites, applications, plateformes, outils métier, contenus et expériences assistées par l'intelligence artificielle.
                </p>
                <p className="mt-4 text-base leading-relaxed text-muted-foreground">
                  Mon parcours relie développement, entrepreneuriat, gestion de projet et expérience terrain. Je travaille avec une logique simple : comprendre le problème, structurer la solution, construire, tester, déployer et faire évoluer.
                </p>
                <div className="mt-8 flex flex-wrap gap-3">
                  <Link to="/expertises" className="inline-flex items-center rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground">Mes expertises <ArrowRight className="ml-2 h-4 w-4" /></Link>
                  <Link to="/portfolio" className="inline-flex items-center rounded-xl border border-border px-5 py-3 text-sm font-semibold text-foreground">Voir mes réalisations</Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 sm:py-20 bg-background">
          <div className="container mx-auto w-full px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent">Un profil transversal</p>
              <h2 className="mt-3 text-3xl font-bold text-foreground sm:text-4xl">Plusieurs métiers, une même logique : créer de la valeur.</h2>
              <p className="mt-4 text-muted-foreground">Le digital n'est pas une fin en soi. Chaque projet doit produire une utilité claire, une meilleure organisation ou une nouvelle possibilité.</p>
            </div>
            <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {[
                [Code2, "Web & solutions digitales", "Concevoir des sites, applications, CRM, portails et outils métier."],
                [Brain, "Intelligence artificielle", "Intégrer l'IA dans les usages, les contenus, l'automatisation et les produits."],
                [Video, "Vidéo & création", "Créer des contenus visuels utiles à la communication et aux projets."],
                [Music2, "Audio & musique", "Explorer la création audio et musicale comme espace d'expression et de production."]
              ].map(([Icon, title, description]) => {
                const I = Icon as typeof Code2;
                return <article key={title as string} className="rounded-2xl border border-border/60 bg-card p-6"><I className="h-7 w-7 text-accent" /><h3 className="mt-4 text-lg font-bold text-foreground">{title as string}</h3><p className="mt-2 text-sm leading-relaxed text-muted-foreground">{description as string}</p></article>;
              })}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  </>
);

export default APropos;
