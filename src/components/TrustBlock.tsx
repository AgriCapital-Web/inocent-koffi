import { Lightbulb, Layers3, Rocket, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";

const TrustBlock = () => (
  <section className="py-16 sm:py-24 bg-secondary/20">
    <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">Ma manière de travailler</p>
        <h2 className="mt-3 text-3xl font-bold text-foreground sm:text-4xl">Une chaîne simple : comprendre, construire, déployer.</h2>
        <p className="mt-4 text-muted-foreground">Chaque projet est traité comme un produit à faire vivre, pas comme une simple page à livrer.</p>
      </div>
      <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
        {[
          [Lightbulb, "Comprendre", "Clarifier le besoin, le public et le résultat attendu."],
          [Layers3, "Structurer", "Organiser les parcours, les données et les fonctionnalités."],
          [Rocket, "Construire", "Développer, intégrer, tester et préparer le déploiement."],
          [ShieldCheck, "Faire durer", "Corriger, sécuriser, mesurer et faire évoluer la solution."]
        ].map(([Icon, title, description]) => {
          const I = Icon as typeof Lightbulb;
          return <article key={title as string} className="rounded-2xl border border-border/60 bg-card p-6"><I className="h-7 w-7 text-accent" /><h3 className="mt-4 text-lg font-bold text-foreground">{title as string}</h3><p className="mt-2 text-sm leading-relaxed text-muted-foreground">{description as string}</p></article>;
        })}
      </div>
      <div className="mt-8 flex flex-wrap gap-3">
        <Link to="/portfolio" className="rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground">Voir les réalisations</Link>
        <Link to="/contact" className="rounded-xl border border-border px-5 py-3 text-sm font-semibold text-foreground">Parler d'un projet</Link>
      </div>
    </div>
  </section>
); export default TrustBlock;
