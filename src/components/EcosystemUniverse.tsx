import { motion } from "framer-motion";
import { ArrowRight, ArrowDown, Building2, Smartphone, ShieldCheck, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { plateformes } from "@/data/agricapitalUpdates";
import { trackCta } from "@/lib/analytics";

const icons = [Building2, Smartphone, ShieldCheck];

const EcosystemUniverse = () => {
  return (
    <section id="ecosysteme" className="py-16 sm:py-24 bg-gradient-to-b from-background via-secondary/20 to-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="max-w-3xl mx-auto text-center mb-12"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <Badge variant="outline" className="mb-4">Écosystème officiel</Badge>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            L'univers AgriCapital
          </h2>
          <p className="text-muted-foreground text-base sm:text-lg leading-relaxed">
            Les infrastructures numériques et opérationnelles que je pilote en tant que Fondateur &amp; CEO
            d'AGRICAPITAL SARL : le site institutionnel, la plateforme de gestion des planteurs et
            plantations, et l'espace client sécurisé.
          </p>
        </motion.div>

        {/* Architecture de l'écosystème */}
        <motion.div
          className="max-w-4xl mx-auto mb-14 rounded-2xl border border-border/60 bg-card/70 backdrop-blur-sm p-6 sm:p-8"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <ol className="flex flex-col items-center gap-2 text-center">
            {[
              { label: "Inocent KOFFI", note: "Fondateur & CEO" },
              { label: "AGRICAPITAL SARL", note: "Promoteur agricole & services intégrés" },
              { label: "agricapital.ci", note: "Site institutionnel & offres" },
              { label: "app.agricapital.ci", note: "Gestion des planteurs & plantations" },
              { label: "client.agricapital.ci", note: "Espace client sécurisé" },
            ].map((node, i, arr) => (
              <li key={node.label} className="flex flex-col items-center gap-2">
                <div className="rounded-xl border border-primary/20 bg-primary/5 px-4 py-2">
                  <p className="font-semibold text-foreground text-sm sm:text-base">{node.label}</p>
                  <p className="text-xs text-muted-foreground">{node.note}</p>
                </div>
                {i < arr.length - 1 && <ArrowDown className="w-4 h-4 text-primary/60" aria-hidden="true" />}
              </li>
            ))}
          </ol>
        </motion.div>

        <div className="grid gap-6 lg:grid-cols-3">
          {plateformes.map((p, i) => {
            const Icon = icons[i] ?? Building2;
            return (
              <motion.article
                key={p.name}
                className="flex flex-col rounded-2xl border border-border/60 bg-card p-6 sm:p-7 hover:border-primary/40 hover:shadow-xl transition-all"
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center mb-4">
                  <Icon className="w-6 h-6 text-primary-foreground" aria-hidden="true" />
                </div>
                <h3 className="font-display text-lg sm:text-xl font-bold text-foreground tracking-tight">{p.name}</h3>
                <p className="text-sm text-primary font-medium mt-1">{p.tagline}</p>
                <p className="text-sm text-muted-foreground leading-relaxed mt-3 text-justify">{p.description}</p>
                <ul className="mt-4 space-y-1.5">
                  {p.features.map((f) => (
                    <li key={f} className="text-sm text-foreground/85 flex items-start gap-2">
                      <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-accent shrink-0" aria-hidden="true" />
                      {f}
                    </li>
                  ))}
                </ul>
                <p className="text-xs text-muted-foreground mt-4">
                  <span className="font-semibold text-foreground/80">Pour qui :</span> {p.audience}
                </p>
                <Button asChild className="mt-6 w-full">
                  <a
                    href={p.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => trackCta(p.name.toLowerCase(), "ecosysteme")}
                  >
                    {p.cta}
                    <ArrowRight className="w-4 h-4 ml-2" aria-hidden="true" />
                  </a>
                </Button>
              </motion.article>
            );
          })}
        </div>

        <p className="text-center text-xs text-muted-foreground mt-8 flex items-center justify-center gap-2">
          <ExternalLink className="w-3 h-3" aria-hidden="true" />
          Tous les liens pointent vers les plateformes officielles AgriCapital (HTTPS).
        </p>
      </div>
    </section>
  );
};

export default EcosystemUniverse;
