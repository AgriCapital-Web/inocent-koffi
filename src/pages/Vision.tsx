import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Helmet } from "react-helmet-async";
import { ArrowRight, Compass, Lightbulb, Layers3, Globe2 } from "lucide-react";
import { Link } from "react-router-dom";

const Vision = () => (
  <>
    <Helmet>
      <title>Vision | Inocent KOFFI</title>
      <meta name="description" content="La vision d'Inocent KOFFI : transformer les idées en solutions utiles, accessibles et durables." />
      <link rel="canonical" href="https://ikoffi.agricapital.ci/vision" />
    </Helmet>
    <div className="min-h-screen">
      <Navbar />
      <main className="pt-20">
        <section className="py-20 sm:py-28 bg-gradient-to-br from-background via-secondary/20 to-accent/10">
          <div className="container mx-auto w-full px-4 sm:px-6 lg:px-8">
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">Vision</span>
            <h1 className="mt-4 text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">Transformer les idées en solutions qui servent réellement.</h1>
            <p className="mt-6 max-w-3xl text-lg leading-relaxed text-muted-foreground">Je crois à un numérique concret : une technologie n'a de valeur que lorsqu'elle répond à un besoin, simplifie une activité, crée une opportunité ou donne à un projet les moyens de grandir.</p>
          </div>
        </section>
        <section className="py-16 sm:py-20 bg-background">
          <div className="container mx-auto w-full px-4 sm:px-6 lg:px-8">
            <div className="grid gap-5 md:grid-cols-2">
              {[
                [Compass, "Partir du besoin", "Comprendre le problème avant de choisir la technologie."],
                [Lightbulb, "Structurer", "Transformer une idée en parcours, contenu, données et fonctionnalités cohérents."],
                [Layers3, "Construire", "Développer des solutions simples à utiliser, maintenables et évolutives."],
                [Globe2, "Déployer & faire évoluer", "Mesurer, corriger, documenter et améliorer dans le temps."]
              ].map(([Icon, title, description]) => {
                const I = Icon as typeof Compass;
                return <article key={title as string} className="rounded-2xl border border-border/60 bg-card p-6"><I className="h-7 w-7 text-accent" /><h2 className="mt-4 text-xl font-bold text-foreground">{title as string}</h2><p className="mt-2 text-muted-foreground">{description as string}</p></article>;
              })}
            </div>
            <div className="mt-10 rounded-2xl border border-primary/20 bg-primary/5 p-6 sm:p-8">
              <p className="text-lg font-semibold text-foreground">L'ambition : construire des solutions africaines utiles, accessibles et capables de durer.</p>
              <Link to="/contact" className="mt-5 inline-flex items-center text-sm font-semibold text-primary hover:underline">Parler d'un projet <ArrowRight className="ml-1.5 h-4 w-4" /></Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  </>
);

export default Vision;
