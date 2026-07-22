import { motion } from "framer-motion";
import { Shield, FileCheck, Users, Sprout, Award, TrendingUp, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";

const pillars = [
  { icon: FileCheck, title: "Cadre juridique solide", desc: "AGRICAPITAL SARL — RCCM Daloa, statuts déposés, gouvernance formalisée avec Legal Form et GESMA." },
  { icon: Sprout, title: "620 ha sécurisés", desc: "100+ ha en exploitation, pépinière de 88 660 plants certifiés CNRA, extension programmée." },
  { icon: Shield, title: "Garantie d'écoulement 25 ans", desc: "Contrats d'achat sécurisés avec les industriels — revenus prévisibles pendant tout le cycle." },
  { icon: Users, title: "Équipe pluridisciplinaire", desc: "Agronomes, juristes, financiers et partenaires terrain — 12+ ans d'expérience opérationnelle." },
  { icon: Award, title: "Partenaires reconnus", desc: "CNRA, ANADER, Les Palmistes, Legal Form, GESMA — un écosystème institutionnel structuré." },
  { icon: TrendingUp, title: "Portail Client digital", desc: "Suivi temps réel, documents, paiements sécurisés sur client.agricapital.ci — transparence totale." },
];

const TrustBlock = () => {
  return (
    <section className="py-16 sm:py-24 bg-gradient-to-b from-background via-secondary/20 to-background">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <Badge variant="outline" className="mb-4"><Shield className="w-3 h-3 mr-1" />Preuves & Crédibilité</Badge>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 tracking-tighter-2">
              Pourquoi <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">nous faire confiance</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Des éléments vérifiables — documents officiels, chiffres de terrain, partenaires institutionnels et processus transparents.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {pillars.map((p, i) => {
              const Icon = p.icon;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.05 }}
                  className="group p-6 rounded-2xl bg-card border border-border/50 hover:border-primary/50 hover:shadow-xl transition-all"
                >
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-display font-bold text-lg mb-2">{p.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{p.desc}</p>
                </motion.div>
              );
            })}
          </div>

          <div className="flex flex-wrap gap-3 justify-center">
            <Button asChild size="lg" className="bg-gradient-to-r from-primary to-accent">
              <Link to="/agricapital">Découvrir AgriCapital <ArrowRight className="ml-2 w-4 h-4" /></Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link to="/faq">Consulter la FAQ</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <a href="https://client.agricapital.ci" target="_blank" rel="noopener noreferrer">Portail Client</a>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link to="/contact">Nous contacter</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrustBlock;