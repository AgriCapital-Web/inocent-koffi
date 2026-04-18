import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import NurserySection from "@/components/NurserySection";
import { Helmet } from "react-helmet-async";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Target, Users, Sprout, TrendingUp, MapPin, Calendar, Building, Shield, CheckCircle, Leaf, BarChart3, Globe, ArrowRight } from "lucide-react";
import logoAgricapital from "@/assets/logo-agricapital.png";
import { motion } from "framer-motion";

const Agricapital = () => {
  const whyChoose = [
    {
      icon: Leaf,
      title: "Patrimoine Durable",
      description: "Constituez un actif agricole tangible qui prend de la valeur dans le temps. Une alternative concrète pour diversifier vos investissements."
    },
    {
      icon: Users,
      title: "Accompagnement Complet",
      description: "De la sécurisation foncière à la commercialisation : AgriCapital gère l'ensemble du processus avec rigueur et transparence."
    },
    {
      icon: Shield,
      title: "Sécurité Contractuelle",
      description: "Contrats certifiés, documents cartographiques GPS, cadre juridique solide — chaque étape est sécurisée et transparente."
    }
  ];

  const steps = [
    { num: "01", title: "Identification, Validation & Sécurisation Foncière", desc: "AgriCapital identifie et sécurise des terres adaptées, en partenariat avec les propriétaires terriens." },
    { num: "02", title: "Référencement & Cartographie", desc: "Polygonage GPS, cartographie détaillée et référencement complet de chaque parcelle." },
    { num: "03", title: "Engagement & Formalisation", desc: "Choisissez votre formule d'accompagnement. Remise de votre contrat sécurisé et plan cartographique personnalisé." },
    { num: "04", title: "Développement de la Plantation — 36 mois", desc: "143 plants certifiés par hectare, défrichage, piquetage, plantation, intrants et fertilisation. 6 visites techniques." },
    { num: "05", title: "Remise de la Plantation", desc: "Plantation productive livrée clé en main. Suivi agronomique inclus, fourniture d'intrants et garantie d'achat." },
  ];

  const capacity = [
    { value: "120 ha", label: "de pépinière en croissance active" },
    { value: "50 ha", label: "disponibles pour plantation immédiate" },
    { value: "500+ ha", label: "de terres identifiées" },
    { value: "25 ans", label: "de garantie d'achat et suivi" },
  ];

  const team = [
    { name: "Inocent KOFFI", role: "Fondateur & CEO", desc: "Entrepreneur et stratège, vision globale et coordination du déploiement." },
    { name: "Koffi Pierre KOUAMÉ", role: "Conseiller Stratégique", desc: "10+ ans d'expérience en gouvernance organisationnelle et sécurisation foncière." },
    { name: "Éric Stéphane DIDO", role: "Responsable Développement Commercial", desc: "Stratégie commerciale, déploiement terrain et développement du portefeuille clients." },
  ];

  const partners = [
    { name: "Dr Marcel KONAN — MiProjet", role: "Structuration de Projets & Stratégie" },
    { name: "Cabinet Legal Form", role: "Expertise Juridique" },
    { name: "Kouamé Mathieu ANGA", role: "Agronomie & Suivi de Plantation" },
    { name: "Cabinet GESMA SARL", role: "Expertise Comptable & Fiscale" },
    { name: "Les Palmistes", role: "Fournisseur de semences certifiées Iro Lamé" },
  ];

  return (
    <>
      <Helmet>
        <title>AGRICAPITAL SARL - Opérateur & Promoteur Agricole | Palmier à Huile Clé en Main</title>
        <meta name="description" content="AGRICAPITAL SARL, opérateur et promoteur agricole. Créez votre plantation de palmier à huile clé en main en Côte d'Ivoire. Patrimoine durable et sécurisé." />
        <link rel="canonical" href="https://www.ikoffi.agricapital.ci/agricapital" />
      </Helmet>
      <div className="min-h-screen">
        <Navbar />
        <main className="pt-20">
          {/* Hero */}
          <section className="py-16 sm:py-20 bg-gradient-to-br from-primary/10 via-background to-accent/10">
            <div className="container mx-auto px-4">
              <div className="max-w-6xl mx-auto text-center">
                <motion.img 
                  src={logoAgricapital} 
                  alt="AgriCapital Logo" 
                  className="h-16 sm:h-20 mx-auto mb-6"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                />
                <motion.p 
                  className="text-lg sm:text-xl text-primary font-semibold mb-4"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  Investir la terre. Cultiver l'avenir.
                </motion.p>
                <motion.h1 
                  className="text-3xl sm:text-4xl lg:text-6xl font-bold mb-6 text-foreground"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  Votre plantation de palmier à huile, <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">clé en main</span>
                </motion.h1>
                <motion.p 
                  className="text-base sm:text-lg text-muted-foreground max-w-3xl mx-auto mb-8 leading-relaxed"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  Avec AgriCapital, créez votre plantation de palmier à huile clé en main et bâtissez ensemble votre patrimoine agricole durable et rentable. Avec ou sans terrain, AgriCapital structure votre projet de A à Z.
                </motion.p>

                <div className="bg-card rounded-2xl p-6 sm:p-8 border border-border/50 shadow-lg mb-8 max-w-4xl mx-auto">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
                    <div className="flex items-center gap-3">
                      <Building className="w-5 h-5 text-primary flex-shrink-0" />
                      <div className="text-left">
                        <p className="text-xs text-muted-foreground">Capital Social</p>
                        <p className="font-bold text-foreground text-sm">5 000 000 FCFA</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <MapPin className="w-5 h-5 text-primary flex-shrink-0" />
                      <div className="text-left">
                        <p className="text-xs text-muted-foreground">Siège</p>
                        <p className="font-bold text-foreground text-sm">Daloa, Haut-Sassandra</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Calendar className="w-5 h-5 text-primary flex-shrink-0" />
                      <div className="text-left">
                        <p className="text-xs text-muted-foreground">RCCM</p>
                        <p className="font-bold text-foreground text-sm">CI-DAL-01-2025-B12-13435</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Button size="lg" className="bg-gradient-to-r from-primary to-primary/90" asChild>
                    <a href="https://www.agricapital.ci" target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="w-5 h-5 mr-2" />
                      Visiter le Site Officiel
                    </a>
                  </Button>
                  <Button size="lg" variant="outline" asChild>
                    <a href="https://wa.me/2250564551717" target="_blank" rel="noopener noreferrer">
                      Nous Contacter
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </a>
                  </Button>
                </div>
              </div>
            </div>
          </section>

          {/* Two Profiles */}
          <section className="py-16 bg-secondary/30">
            <div className="container mx-auto px-4">
              <div className="max-w-5xl mx-auto">
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-10 text-center text-foreground">
                  Deux profils, <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">une ambition</span>
                </h2>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-card rounded-2xl p-6 sm:p-8 border border-border/50 hover:border-accent/50 transition-all hover:shadow-lg">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center mb-4">
                      <Users className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-xl font-bold mb-3 text-foreground">Particuliers & Professionnels</h3>
                    <p className="text-muted-foreground leading-relaxed">Créez votre plantation clé en main, même sans terrain, et bâtissez un patrimoine tangible sur 28 ans.</p>
                  </div>
                  <div className="bg-card rounded-2xl p-6 sm:p-8 border border-border/50 hover:border-accent/50 transition-all hover:shadow-lg">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center mb-4">
                      <Globe className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-xl font-bold mb-3 text-foreground">Propriétaires Terriens</h3>
                    <p className="text-muted-foreground leading-relaxed">Confiez-nous votre terre et nous la transformons en plantation productive de palmier à huile, sans frais pour vous.</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Why Choose */}
          <section className="py-16 bg-background">
            <div className="container mx-auto px-4">
              <div className="max-w-6xl mx-auto">
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-10 text-center text-foreground">
                  Pourquoi choisir <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">AgriCapital</span> ?
                </h2>
                <div className="grid md:grid-cols-3 gap-6">
                  {whyChoose.map((item, i) => {
                    const Icon = item.icon;
                    return (
                      <div key={i} className="group p-6 rounded-2xl bg-card border border-border/50 hover:border-accent/50 hover:shadow-xl transition-all">
                        <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                          <Icon className="w-7 h-7 text-white" />
                        </div>
                        <h3 className="text-xl font-bold mb-3 text-foreground">{item.title}</h3>
                        <p className="text-muted-foreground leading-relaxed">{item.description}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </section>

          {/* Process */}
          <section className="py-16 bg-secondary/30">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto">
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-10 text-center text-foreground">
                  Un processus structuré en <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">5 étapes</span>
                </h2>
                <div className="space-y-4">
                  {steps.map((step, i) => (
                    <div key={i} className="flex items-start gap-4 p-5 rounded-xl bg-card border border-border/50 hover:border-accent/30 transition-colors">
                      <span className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold flex-shrink-0 text-sm">
                        {step.num}
                      </span>
                      <div>
                        <h3 className="font-bold text-foreground mb-1">{step.title}</h3>
                        <p className="text-sm text-muted-foreground">{step.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Operational Capacity */}
          <section className="py-16 bg-primary text-primary-foreground">
            <div className="container mx-auto px-4">
              <div className="max-w-5xl mx-auto text-center">
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-10">
                  Notre Capacité Opérationnelle
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
                  {capacity.map((c, i) => (
                    <div key={i} className="p-4 sm:p-6 rounded-xl bg-primary-foreground/10 border border-primary-foreground/20">
                      <p className="text-2xl sm:text-3xl font-bold mb-2">{c.value}</p>
                      <p className="text-xs sm:text-sm opacity-90">{c.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          <NurserySection />

          {/* Team & Partners */}
          <section id="equipe" className="py-16 bg-background scroll-mt-24">
            <div className="container mx-auto px-4">
              <div className="max-w-5xl mx-auto">
                <div className="text-center mb-6">
                  <Badge variant="outline" className="mb-3 border-accent text-accent">
                    <Users className="w-3 h-3 mr-1" />
                    L'Équipe AgriCapital
                  </Badge>
                </div>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4 text-center text-foreground">
                  Leadership & <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">Écosystème</span>
                </h2>
                <p className="text-center text-muted-foreground mb-10 max-w-2xl mx-auto">
                  AgriCapital est porté par une équipe fondatrice combinant expertise technique, expérience terrain et rigueur stratégique, soutenue par un réseau de partenaires experts.
                </p>

                <h3 className="text-xl font-bold mb-6 text-foreground">Direction</h3>
                <div className="grid md:grid-cols-3 gap-4 mb-10">
                  {team.map((m, i) => (
                    <div key={i} className="p-5 rounded-xl bg-card border border-border/50 hover:border-accent/30 transition-colors">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold mb-3">
                        {m.name.charAt(0)}
                      </div>
                      <h4 className="font-bold text-foreground">{m.name}</h4>
                      <p className="text-sm text-primary font-medium mb-2">{m.role}</p>
                      <p className="text-sm text-muted-foreground">{m.desc}</p>
                    </div>
                  ))}
                </div>

                <h3 className="text-xl font-bold mb-6 text-foreground">Partenaires Techniques & Stratégiques</h3>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {partners.map((p, i) => (
                    <div key={i} className="flex items-start gap-3 p-4 rounded-xl bg-secondary/50 border border-border/50">
                      <CheckCircle className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-semibold text-foreground text-sm">{p.name}</p>
                        <p className="text-xs text-muted-foreground">{p.role}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="text-center mt-8">
                  <Button variant="outline" asChild>
                    <a href="https://www.agricapital.ci" target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="w-4 h-4 mr-2" />
                      En savoir plus sur agricapital.ci
                    </a>
                  </Button>
                </div>
              </div>
            </div>
          </section>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default Agricapital;
