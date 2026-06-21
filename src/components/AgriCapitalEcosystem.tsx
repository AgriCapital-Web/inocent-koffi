import { motion } from "framer-motion";
import { ArrowRight, Home, ExternalLink, Sprout, Map, Wrench, ShoppingBag, Handshake, MessageSquare, Newspaper, TrendingUp, BookOpen, Leaf } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const BASE = "https://agricpital.vercel.app";

type Page = {
  href: string;
  category: string;
  title: string;
  desc: string;
  icon: React.ComponentType<{ className?: string }>;
};

const PAGES: Page[] = [
  { href: `${BASE}/solutions/valorisation-fonciere`, category: "Solution", title: "Valorisation foncière", desc: "Nous transformons votre terrain en plantation productive de palmier à huile, de la préparation du sol à l'entrée en production.", icon: Map },
  { href: `${BASE}/solutions/plantation-cle-en-main`, category: "Solution", title: "Plantation clé en main", desc: "Identification, sécurisation foncière et création complète de votre plantation — une solution totalement intégrée.", icon: Sprout },
  { href: `${BASE}/solutions/gestion-de-plantations`, category: "Solution", title: "Gestion de plantations", desc: "Suivi technique, opérationnel et agronomique pour optimiser durablement les performances de votre plantation.", icon: TrendingUp },
  { href: `${BASE}/services/fourniture-intrants`, category: "Service", title: "Fourniture d'intrants", desc: "Accès à des fertilisants, produits phytosanitaires et équipements sélectionnés auprès de fournisseurs reconnus.", icon: ShoppingBag },
  { href: `${BASE}/services/mise-en-place-suivi-plantations`, category: "Service", title: "Mise en place & suivi", desc: "Nos ingénieurs interviennent du défrichage à l'entretien : un accompagnement terrain rigoureux à chaque étape.", icon: Wrench },
  { href: `${BASE}/partenariats`, category: "Écosystème", title: "Partenariats stratégiques", desc: "Banques, transformateurs industriels, fournisseurs et distributeurs : structurez un partenariat à fort potentiel.", icon: Handshake },
  { href: `${BASE}/temoignages`, category: "Communauté", title: "Témoignages", desc: "Découvrez les retours de celles et ceux qui s'intéressent au modèle AgriCapital.", icon: MessageSquare },
  { href: `${BASE}/actualites`, category: "Média", title: "Actualités", desc: "Les dernières nouvelles d'AgriCapital : avancées terrain, partenariats et annonces officielles.", icon: Newspaper },
  { href: `${BASE}/evolution`, category: "Média", title: "Évolution", desc: "Suivez en images la progression réelle de la pépinière et des plantations AgriCapital.", icon: TrendingUp },
  { href: `${BASE}/tresor-foncier`, category: "Bref investisseur", title: "Le trésor caché du foncier agricole", desc: "Pourquoi les terres africaines inexploitées peuvent devenir un patrimoine productif et transmissible.", icon: BookOpen },
  { href: `${BASE}/tresor-palmier`, category: "Bref investisseur", title: "Le trésor caché du palmier à huile", desc: "Un arbre stratégique, productif pendant des décennies et adapté au potentiel ivoirien.", icon: Leaf },
];

const AgriCapitalEcosystem = () => {
  return (
    <section className="py-16 sm:py-20 bg-gradient-to-b from-background via-secondary/20 to-background">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Résumé + retour accueil */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="rounded-3xl border border-primary/20 bg-gradient-to-br from-primary/5 via-card to-accent/5 p-6 sm:p-10 mb-12 shadow-sm"
          >
            <Badge variant="outline" className="mb-4 border-primary text-primary">
              <Sprout className="w-3 h-3 mr-1" /> Écosystème AgriCapital
            </Badge>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4 text-foreground">
              Explorez l'univers <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">agricapital.ci</span>
            </h2>
            <p className="text-muted-foreground leading-relaxed max-w-3xl mb-6">
              AgriCapital est un opérateur agricole intégré : solutions foncières, plantations clé en main, gestion, intrants et garantie d'écoulement. Découvrez chaque page publique du site officiel ci-dessous, ou rejoignez l'accueil pour une vision d'ensemble.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button asChild size="lg" className="bg-gradient-to-r from-primary to-primary/90">
                <a href={`${BASE}/`} target="_blank" rel="noopener noreferrer">
                  <Home className="w-4 h-4 mr-2" />
                  Page d'accueil AgriCapital
                  <ArrowRight className="w-4 h-4 ml-2" />
                </a>
              </Button>
              <Button asChild size="lg" variant="outline">
                <a href="https://wa.me/2250564551717" target="_blank" rel="noopener noreferrer">
                  Parler à un conseiller
                </a>
              </Button>
            </div>
          </motion.div>

          {/* Grille des pages */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {PAGES.map((p, i) => {
              const Icon = p.icon;
              return (
                <motion.a
                  key={p.href}
                  href={p.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.04 }}
                  className="group relative flex flex-col rounded-2xl bg-card border border-border/50 p-5 hover:border-accent/60 hover:shadow-xl transition-all overflow-hidden"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <Badge variant="secondary" className="text-[10px] uppercase tracking-wide">
                      {p.category}
                    </Badge>
                  </div>
                  <h3 className="font-bold text-foreground mb-2 text-base leading-snug">{p.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed flex-1">{p.desc}</p>
                  <span className="mt-4 inline-flex items-center text-sm font-semibold text-primary group-hover:gap-2 transition-all">
                    Découvrir
                    <ExternalLink className="w-3.5 h-3.5 ml-1.5 group-hover:translate-x-0.5 transition-transform" />
                  </span>
                </motion.a>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AgriCapitalEcosystem;