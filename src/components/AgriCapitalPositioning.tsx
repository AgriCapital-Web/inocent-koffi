import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Shield, FileCheck, Handshake, TrendingUp, Sprout, Users, ExternalLink,
  CheckCircle2, Target, Compass, Award, Newspaper, ArrowRight, Lock,
  CreditCard, LineChart, FileText, Camera, MessageSquare,
} from "lucide-react";

/**
 * Section stratégique de positionnement AgriCapital — importée depuis agricapital.ci
 * Renforce la crédibilité : Portail Client, Mission, Vision, Engagements, Services, Actualité.
 */
const AgriCapitalPositioning = () => {
  const portalFeatures = [
    { icon: CreditCard, label: "Paiements mensuels sécurisés" },
    { icon: LineChart, label: "Suivi plantation en temps réel" },
    { icon: FileText, label: "Documents & rapports" },
    { icon: Camera, label: "Photos & vidéos terrain" },
    { icon: MessageSquare, label: "Échanges avec l'équipe" },
  ];

  const mission = [
    { icon: Sprout, title: "Accessibilité", desc: "Des formules adaptées à chaque profil, avec ou sans terrain." },
    { icon: Handshake, title: "Accompagnement", desc: "Un suivi agronomique complet sur toute la durée du contrat." },
    { icon: Shield, title: "Sécurité", desc: "Garantie d'écoulement 25 ans et cadre juridique solide." },
  ];

  const commitments = [
    { emoji: "🤝", title: "Transparence Totale", desc: "Contrat et documents cartographiques dès le premier versement. Suivi accessible à tout moment." },
    { emoji: "💡", title: "Excellence Technique", desc: "Plants certifiés, intrants de qualité, suivi agronomique rigoureux, 6 visites techniques par cycle." },
    { emoji: "🌱", title: "Vision Long Terme", desc: "Un modèle conçu sur 28 ans pour bâtir un patrimoine durable et générer des revenus stables." },
    { emoji: "🔍", title: "Sécurité Contractuelle", desc: "Contrats sécurisés, cadre juridique rigoureux, architecture contractuelle robuste." },
  ];

  const services = [
    { icon: Sprout, title: "Plantation Clé en Main", desc: "Plants certifiés, défrichage, piquetage, plantation, intrants et fertilisation — livraison opérationnelle à 36 mois." },
    { icon: Users, title: "Suivi Technique", desc: "Visites techniques, conseil agronomique et accompagnement continu sur toute la durée du contrat." },
    { icon: CheckCircle2, title: "Garantie d'Écoulement", desc: "Débouchés sécurisés et revenus stables via nos partenaires industriels de la filière palmier." },
  ];

  return (
    <>
      {/* ── Portail Client Digital ─────────────────────────── */}
      <section className="py-16 sm:py-20 bg-gradient-to-br from-primary via-primary/95 to-accent/30 text-primary-foreground relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: "radial-gradient(circle at 20% 20%, hsl(var(--accent)) 0%, transparent 40%), radial-gradient(circle at 80% 80%, hsl(var(--gold)) 0%, transparent 40%)",
        }} aria-hidden />
        <div className="container mx-auto px-4 relative">
          <div className="max-w-5xl mx-auto">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <Badge className="bg-accent text-accent-foreground border-0 mb-4">
                <Lock className="w-3 h-3 mr-1" /> Portail sécurisé
              </Badge>
              <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 tracking-tight-1">
                Espace Client Digital AgriCapital
              </h2>
              <p className="text-base sm:text-lg opacity-90 mb-8 max-w-3xl leading-relaxed">
                Un portail sécurisé pour effectuer vos paiements mensuels, suivre l'évolution de votre plantation, accéder à vos documents, rapports, photos et vidéos de terrain, et échanger avec nos équipes tout au long du cycle de production.
              </p>
              <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-3 mb-8">
                {portalFeatures.map((f, i) => {
                  const Icon = f.icon;
                  return (
                    <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-primary-foreground/10 backdrop-blur-sm border border-primary-foreground/15">
                      <Icon className="w-5 h-5 flex-shrink-0 text-accent" />
                      <span className="text-xs sm:text-sm font-medium">{f.label}</span>
                    </div>
                  );
                })}
              </div>
              <Button size="lg" asChild className="bg-accent text-accent-foreground hover:bg-accent/90 font-semibold">
                <a href="https://client.agricapital.ci/" target="_blank" rel="noopener noreferrer">
                  Accéder à mon Espace Client
                  <ArrowRight className="w-4 h-4 ml-2" />
                </a>
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Mission / Vision / Engagements ─────────────────── */}
      <section className="py-16 sm:py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-left mb-12">
              <Badge variant="outline" className="mb-3 border-primary text-primary">
                <Target className="w-3 h-3 mr-1" /> Notre Mission
              </Badge>
              <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 text-foreground tracking-tight-1">
                Rendre l'agriculture{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
                  accessible, rentable et sécurisée
                </span>
              </h2>
            </div>

            <div className="grid md:grid-cols-3 gap-6 mb-16">
              {mission.map((m, i) => {
                const Icon = m.icon;
                return (
                  <motion.div
                    key={i}
                    className="p-6 sm:p-8 rounded-2xl bg-card border border-border/60 hover:border-accent/50 hover:shadow-xl transition-all group"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <Icon className="w-7 h-7 text-white" />
                    </div>
                    <h3 className="font-display text-xl font-bold mb-2 text-foreground">{m.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">{m.desc}</p>
                  </motion.div>
                );
              })}
            </div>

            {/* Engagements */}
            <div className="mb-6">
              <Badge variant="outline" className="mb-3 border-accent text-accent">
                <Award className="w-3 h-3 mr-1" /> Nos Engagements
              </Badge>
              <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold mb-3 text-foreground tracking-tight-1">
                Les fondements de notre relation avec vous
              </h2>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {commitments.map((c, i) => (
                <motion.div
                  key={i}
                  className="p-5 rounded-2xl bg-secondary/40 border border-border/50 hover:border-accent/40 transition-all"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                >
                  <div className="text-3xl mb-3">{c.emoji}</div>
                  <h4 className="font-display font-bold text-foreground mb-2 text-base">{c.title}</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">{c.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Nos Services ───────────────────────────────────── */}
      <section className="py-16 sm:py-20 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="mb-10">
              <Badge variant="outline" className="mb-3 border-primary text-primary">
                <Compass className="w-3 h-3 mr-1" /> Nos Services
              </Badge>
              <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold mb-3 text-foreground tracking-tight-1">
                Une offre <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">complète et intégrée</span>
              </h2>
              <p className="text-muted-foreground max-w-3xl">
                De l'identification du foncier à la commercialisation : AgriCapital pilote chaque étape avec rigueur, transparence et excellence agronomique.
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {services.map((s, i) => {
                const Icon = s.icon;
                return (
                  <div key={i} className="p-6 sm:p-8 rounded-2xl bg-card border border-border/60 hover:border-accent/50 hover:shadow-2xl transition-all group">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-accent to-primary flex items-center justify-center mb-4 group-hover:rotate-6 transition-transform">
                      <Icon className="w-7 h-7 text-white" />
                    </div>
                    <h3 className="font-display text-xl font-bold mb-3 text-foreground">{s.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">{s.desc}</p>
                  </div>
                );
              })}
            </div>

            {/* Chiffres-clés confiance */}
            <div className="mt-12 grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { v: "143", l: "plants Tenera certifiés / ha" },
                { v: "36 mois", l: "de développement encadré" },
                { v: "6", l: "visites techniques par cycle" },
                { v: "25 ans", l: "de garantie d'écoulement" },
              ].map((k, i) => (
                <div key={i} className="p-5 rounded-xl bg-card border border-border/50 text-center">
                  <p className="font-display text-2xl sm:text-3xl font-bold text-primary mb-1">{k.v}</p>
                  <p className="text-xs sm:text-sm text-muted-foreground">{k.l}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Information Memorandum & Actualité ─────────────── */}
      <section className="py-14 sm:py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-primary via-primary/90 to-accent/80 text-primary-foreground p-8 sm:p-12 shadow-2xl">
              <div className="absolute -right-16 -bottom-16 w-64 h-64 rounded-full bg-accent/30 blur-3xl" aria-hidden />
              <div className="relative">
                <Badge className="bg-primary-foreground/15 text-primary-foreground border border-primary-foreground/20 mb-4">
                  <Newspaper className="w-3 h-3 mr-1" /> À la une · Actualité
                </Badge>
                <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold mb-4 tracking-tight-1 max-w-3xl">
                  AGRICAPITAL publie son <span className="text-accent">Information Memorandum</span> pour le développement rural
                </h2>
                <p className="opacity-90 mb-6 max-w-3xl leading-relaxed">
                  AGRICAPITAL SARL rend public son Information Memorandum — document stratégique présentant son modèle de plantations de palmier à huile clé en main en Côte d'Ivoire. Un jalon majeur pour les investisseurs, partenaires institutionnels et acteurs du développement rural.
                </p>
                <div className="flex flex-wrap gap-3">
                  <Button size="lg" asChild className="bg-accent text-accent-foreground hover:bg-accent/90 font-semibold">
                    <a href="https://agricapital.ci/actualites/agricapital-publication-information-memorandum-palmier-huile" target="_blank" rel="noopener noreferrer">
                      Lire le Memorandum
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </a>
                  </Button>
                  <Button size="lg" variant="outline" asChild className="bg-transparent border-primary-foreground/40 text-primary-foreground hover:bg-primary-foreground/10">
                    <a href="https://agricapital.ci/actualites" target="_blank" rel="noopener noreferrer">
                      Toutes les actualités
                      <ExternalLink className="w-4 h-4 ml-2" />
                    </a>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Pourquoi nous faire confiance ──────────────────── */}
      <section className="py-14 sm:py-16 bg-secondary/40">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="mb-8">
              <Badge variant="outline" className="mb-3 border-accent text-accent">
                <TrendingUp className="w-3 h-3 mr-1" /> Pourquoi nous faire confiance
              </Badge>
              <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground tracking-tight-1">
                Des <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">preuves concrètes</span>, pas des promesses
              </h2>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              {[
                "Pépinière opérationnelle en pleine croissance à partir de semences sélectionnées",
                "Équipe dirigeante avec 12 ans d'immersion terrain et expertise fine des communautés rurales ivoiriennes",
                "Modèle juridiquement structuré et sécurisé — RCCM CI-DAL-01-2025-B12-13435",
                "Fort potentiel d'expansion sur l'ensemble du territoire national",
                "Suivi agronomique rigoureux sur toute la durée du contrat (6 visites/cycle)",
                "Transparence contractuelle, traçabilité complète et flux financiers sécurisés",
                "Semences certifiées d'origine Iro Lamé via notre partenaire Les Palmistes",
                "Partenaires stratégiques : Cabinet Legal Form, Cabinet GESMA SARL, MiProjet",
              ].map((point, i) => (
                <div key={i} className="flex items-start gap-3 p-4 rounded-xl bg-card border border-border/50">
                  <CheckCircle2 className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                  <p className="text-sm sm:text-base text-foreground leading-relaxed">{point}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default AgriCapitalPositioning;
