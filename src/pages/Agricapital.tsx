import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import NurserySection from "@/components/NurserySection";
import AgriCapitalEcosystem from "@/components/AgriCapitalEcosystem";
import { Helmet } from "react-helmet-async";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Target, Users, Sprout, TrendingUp, MapPin, Calendar, Building, Shield, CheckCircle, Leaf, BarChart3, Globe, ArrowRight } from "lucide-react";
import AnimatedCounter from "@/components/AnimatedCounter";
import logoAgricapital from "@/assets/logo-agricapital.png";
import plantationPhoto from "@/assets/plantation-cle-en-main.png.asset.json";
import inocentKoffiPhoto from "@/assets/team/inocent-koffi.jpg";
import pierreKouamePhoto from "@/assets/team/pierre-kouame.jpg";
import ericDidoPhoto from "@/assets/team/eric-dido.jpg";
import marcelKonanPhoto from "@/assets/team/marcel-konan.jpg";
import mathieuAngaPhoto from "@/assets/team/mathieu-anga.jpg";
import partnerLegalformPhoto from "@/assets/team/partner-legalform.jpg";
import partnerGesmaPhoto from "@/assets/team/partner-gesma.jpg";
import lesPalmistesLogo from "@/assets/team/les-palmistes.jpeg";
import { motion } from "framer-motion";
import { useLanguage } from "@/hooks/useLanguage";
import { agricapitalContent } from "@/lib/i18n/agricapitalContent";

const Agricapital = () => {
  const { language } = useLanguage();
  const content = agricapitalContent[language] || agricapitalContent.fr;

  // Photos remain shared across all languages — the same people/logos.
  const whyChooseIcons = [Leaf, Users, Shield];
  const teamPhotos = [inocentKoffiPhoto, pierreKouamePhoto, ericDidoPhoto];
  const partnerPhotos = [marcelKonanPhoto, mathieuAngaPhoto, partnerLegalformPhoto, partnerGesmaPhoto, lesPalmistesLogo];

  const whyChoose = content.whyChoose.map((w, i) => ({ ...w, icon: whyChooseIcons[i] || Leaf }));
  const steps = content.steps;
  const capacity = content.capacity;
  const team = content.team.map((m, i) => ({ ...m, photo: teamPhotos[i] }));
  const partners = content.partners.map((p, i) => ({ ...p, photo: partnerPhotos[i] }));

  return (
    <>
      <Helmet>
        <title>AGRICAPITAL SARL - Opérateur & Promoteur Agricole | Palmier à Huile Clé en Main</title>
        <meta name="description" content="AGRICAPITAL SARL, opérateur et promoteur agricole. Créez votre plantation de palmier à huile clé en main en Côte d'Ivoire. Patrimoine durable et sécurisé." />
        <link rel="canonical" href="https://www.ikoffi.agricapital.ci/agricapital" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="AGRICAPITAL SARL — Plantations de palmier à huile clé en main" />
        <meta property="og:description" content="Opérateur agricole intégré en Côte d'Ivoire : sécurisation foncière, plantations clé en main, gestion et garantie d'écoulement sur 25 ans." />
        <meta property="og:url" content="https://www.ikoffi.agricapital.ci/agricapital" />
        <meta property="og:image" content="https://www.ikoffi.agricapital.ci/images/founder-inocent-koffi.jpg" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="AGRICAPITAL SARL — Plantations de palmier à huile clé en main" />
        <meta name="twitter:description" content="Opérateur agricole intégré en Côte d'Ivoire : sécurisation foncière, plantations clé en main, gestion et garantie d'écoulement." />
        <meta name="twitter:image" content="https://www.ikoffi.agricapital.ci/images/founder-inocent-koffi.jpg" />
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          name: "AGRICAPITAL SARL",
          url: "https://www.agricapital.ci",
          logo: "https://www.ikoffi.agricapital.ci/favicon.png",
          founder: { "@type": "Person", name: "Inocent KOFFI" },
          foundingDate: "2025",
          address: { "@type": "PostalAddress", addressLocality: "Daloa", addressRegion: "Haut-Sassandra", addressCountry: "CI" },
          sameAs: ["https://www.agricapital.ci", "https://agricpital.vercel.app"],
          description: "Opérateur et promoteur agricole spécialisé dans la création de plantations de palmier à huile clé en main en Côte d'Ivoire.",
        })}</script>
      </Helmet>
      <div className="min-h-screen">
        <Navbar />
        <main className="pt-20">
          {/* Hero */}
          <section className="py-14 sm:py-20 bg-gradient-to-br from-primary/10 via-background to-accent/10">
            <div className="container mx-auto px-4">
              <div className="max-w-6xl mx-auto">
                <motion.img
                  src={logoAgricapital}
                  alt="AgriCapital Logo"
                  className="h-28 sm:h-36 lg:h-44 mb-8 mx-auto block"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                />
              <div className="grid lg:grid-cols-2 gap-10 items-center">
                <div className="text-left">
                  <motion.p
                    className="text-base sm:text-lg text-primary font-semibold mb-3"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    Investir la terre. Cultiver l'avenir.
                  </motion.p>
                  <motion.h1
                    className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-5 text-foreground leading-tight"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    Votre plantation de palmier à huile, <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">clé en main</span>
                  </motion.h1>
                  <motion.p
                    className="text-base sm:text-lg text-muted-foreground mb-7 leading-relaxed text-justify"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                  >
                    Avec AgriCapital, créez votre plantation de palmier à huile clé en main et bâtissez un patrimoine agricole durable et rentable. Avec ou sans terrain, nous structurons votre projet de A à Z : sécurisation foncière, plantation, suivi agronomique et garantie d'écoulement.
                  </motion.p>
                  <div className="flex flex-wrap gap-3">
                    <Button size="lg" className="bg-gradient-to-r from-primary to-primary/90" asChild>
                      <a href="https://www.agricapital.ci" target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="w-5 h-5 mr-2" />
                        Site officiel
                      </a>
                    </Button>
                    <Button size="lg" variant="outline" asChild>
                      <a href="https://wa.me/2250564551717" target="_blank" rel="noopener noreferrer">
                        Nous contacter
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </a>
                    </Button>
                  </div>
                </div>

                <motion.div
                  className="relative"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4, duration: 0.6 }}
                >
                  <div className="absolute -inset-4 rounded-3xl bg-gradient-to-br from-primary/25 via-accent/20 to-transparent blur-2xl" aria-hidden />
                  <img
                    src={plantationPhoto.url}
                    alt="Équipe AgriCapital remettant un plateau de jeunes plants de palmier à huile au client"
                    className="relative w-full h-auto max-w-md mx-auto drop-shadow-2xl"
                    loading="eager"
                  />
                </motion.div>
              </div>

              {/* Carte d'identité */}
              <div className="mt-10 bg-card rounded-2xl p-5 sm:p-6 border border-border/50 shadow-lg max-w-4xl mx-auto">
                  <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4">Carte d'identité</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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
              </div>
            </div>
          </section>

          {/* Two Profiles */}
          <section className="py-14 sm:py-16 bg-secondary/30">
            <div className="container mx-auto px-4">
              <div className="max-w-5xl mx-auto">
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-3 text-foreground">
                  Deux profils, <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">une ambition</span>
                </h2>
                <p className="text-muted-foreground mb-10 max-w-2xl text-justify">
                  Que vous disposiez ou non d'un terrain, AgriCapital adapte son accompagnement à votre profil et structure un projet sécurisé sur le long terme.
                </p>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-card rounded-2xl p-6 sm:p-8 border border-border/50 hover:border-accent/50 transition-all hover:shadow-lg">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center mb-4">
                      <Users className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-xl font-bold mb-3 text-foreground">Particuliers & Professionnels</h3>
                    <p className="text-muted-foreground leading-relaxed text-justify">Créez votre plantation clé en main, même sans terrain, et bâtissez un patrimoine tangible sur 28 ans.</p>
                  </div>
                  <div className="bg-card rounded-2xl p-6 sm:p-8 border border-border/50 hover:border-accent/50 transition-all hover:shadow-lg">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center mb-4">
                      <Globe className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-xl font-bold mb-3 text-foreground">Propriétaires Terriens</h3>
                    <p className="text-muted-foreground leading-relaxed text-justify">Confiez-nous votre terre et nous la transformons en plantation productive de palmier à huile, sans frais pour vous.</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Why Choose */}
          <section className="py-14 sm:py-16 bg-background">
            <div className="container mx-auto px-4">
              <div className="max-w-6xl mx-auto">
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-10 text-foreground">
                  {content.labels.sectionWhy.replace("AgriCapital", "")}<span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">AgriCapital</span>
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
                        <p className="text-muted-foreground leading-relaxed text-justify">{item.description}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </section>

          {/* Process */}
          <section className="py-14 sm:py-16 bg-secondary/30">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto">
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-10 text-foreground">
                  {content.labels.processIntro}
                </h2>
                <div className="space-y-4">
                  {steps.map((step, i) => (
                    <div key={i} className="flex items-start gap-4 p-5 rounded-xl bg-card border border-border/50 hover:border-accent/30 transition-colors">
                      <span className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold flex-shrink-0 text-sm">
                        {step.num}
                      </span>
                      <div>
                        <h3 className="font-bold text-foreground mb-1">{step.title}</h3>
                        <p className="text-sm text-muted-foreground text-justify">{step.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Operational Capacity */}
          <section className="py-14 sm:py-16 bg-primary text-primary-foreground">
            <div className="container mx-auto px-4">
              <div className="max-w-5xl mx-auto">
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-3">
                  {content.labels.sectionCapacity}
                </h2>
                <p className="opacity-90 mb-10 max-w-2xl text-justify">
                  Une infrastructure opérationnelle déjà en place pour démarrer rapidement et livrer en toute confiance.
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
                  {capacity.map((c, i) => (
                    <div key={i} className="p-4 sm:p-6 rounded-xl bg-primary-foreground/10 border border-primary-foreground/20">
                      <p className="text-2xl sm:text-3xl font-bold mb-2">
                        <AnimatedCounter value={c.value} />
                      </p>
                      <p className="text-xs sm:text-sm opacity-90">{c.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          <NurserySection />

          <AgriCapitalEcosystem />

          {/* Team & Partners */}
          <section id="equipe" className="py-14 sm:py-16 bg-background scroll-mt-24">
            <div className="container mx-auto px-4">
              <div className="max-w-5xl mx-auto">
                <div className="mb-4">
                  <Badge variant="outline" className="mb-3 border-accent text-accent">
                    <Users className="w-3 h-3 mr-1" />
                    {content.labels.sectionTeam}
                  </Badge>
                </div>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4 text-foreground">
                  Leadership & <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">Écosystème</span>
                </h2>
                <p className="text-muted-foreground mb-10 max-w-2xl text-justify">
                  AgriCapital est porté par une équipe fondatrice combinant expertise technique, expérience terrain et rigueur stratégique, soutenue par un réseau de partenaires experts.
                </p>

                <h3 className="text-xl font-bold mb-6 text-foreground">Direction</h3>
                <div className="grid md:grid-cols-3 gap-5 mb-12">
                  {team.map((m, i) => (
                    <div
                      key={i}
                      className="group rounded-2xl bg-card border border-border/50 hover:border-accent/40 hover:shadow-lg transition-all overflow-hidden"
                    >
                      <div className="aspect-[4/5] overflow-hidden bg-secondary/30">
                        <img
                          src={m.photo}
                          alt={`${m.name} — ${m.role}`}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          loading="lazy"
                        />
                      </div>
                      <div className="p-5">
                        <h4 className="font-bold text-foreground text-lg">{m.name}</h4>
                        <p className="text-sm text-primary font-semibold mb-2">{m.role}</p>
                        <p className="text-sm text-muted-foreground leading-relaxed">{m.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <h3 className="text-xl font-bold mb-6 text-foreground">Partenaires Techniques & Stratégiques</h3>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {partners.map((p, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-4 p-4 rounded-xl bg-secondary/40 border border-border/50 hover:border-accent/30 transition-colors"
                    >
                      <div className="w-16 h-16 rounded-xl overflow-hidden bg-background border border-border/50 flex-shrink-0">
                        <img
                          src={p.photo}
                          alt={p.name}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold text-foreground text-sm leading-tight">{p.name}</p>
                        <p className="text-xs text-muted-foreground mt-1">{p.role}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-8">
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
