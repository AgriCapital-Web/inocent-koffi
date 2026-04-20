import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Helmet } from "react-helmet-async";
import { Target, Heart, Users, Sprout, Globe, Award, Leaf, Shield } from "lucide-react";

const Vision = () => {
  const pillars = [
    {
      icon: Heart,
      title: "Patrimoine Agricole",
      description: "Permettre à chacun de devenir planteur de palmier à huile et de bâtir un patrimoine tangible, créateur de valeur et transmissible."
    },
    {
      icon: Users,
      title: "Accessibilité",
      description: "Des formules adaptées à chaque profil, avec ou sans terrain, pour rendre l'agriculture accessible à tous."
    },
    {
      icon: Sprout,
      title: "Développement Durable",
      description: "Développer les terres sous-exploitées de Côte d'Ivoire et contribuer à l'économie agricole nationale."
    },
    {
      icon: Globe,
      title: "Impact National",
      description: "Offrir une alternative d'investissement concrète et durable, contribuant à la sécurité alimentaire et à la création d'emplois locaux."
    }
  ];

  return (
    <>
      <Helmet>
        <title>Notre Vision - AGRICAPITAL | Patrimoine Agricole Durable</title>
        <meta name="description" content="La vision d'AgriCapital : bâtir un patrimoine agricole durable pour chaque partie prenante. Permettre à chacun de devenir planteur de palmier à huile." />
        <link rel="canonical" href="https://www.ikoffi.agricapital.ci/vision" />
      </Helmet>
      <div className="min-h-screen">
        <Navbar />
        <main className="pt-20">
          {/* Hero */}
          <section className="py-16 sm:py-20 bg-gradient-to-br from-primary/10 via-background to-accent/10 relative overflow-hidden">
            <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
            <div className="container mx-auto px-4 relative z-10">
              <div className="max-w-4xl mx-auto text-center">
                <h1 className="text-3xl sm:text-4xl lg:text-6xl font-bold mb-8 text-foreground">
                  Notre <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">Vision</span>
                </h1>
                
                <div className="bg-card/80 backdrop-blur-sm rounded-3xl p-6 sm:p-8 md:p-12 border border-border/50 shadow-xl">
                  <Leaf className="w-12 h-12 sm:w-16 sm:h-16 text-accent mx-auto mb-6" />
                  <p className="text-lg sm:text-xl lg:text-2xl text-foreground leading-relaxed font-medium">
                    Bâtir un <strong>patrimoine agricole durable</strong> pour chaque partie prenante. Permettre à quiconque le souhaite de posséder sa propre plantation agricole, dans un cadre sécurisé et professionnel.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Core Quote */}
          <section className="py-16 sm:py-20 bg-primary text-primary-foreground">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto text-center">
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-8">
                  La conviction qui nous anime
                </h2>
                <blockquote className="text-lg sm:text-xl lg:text-2xl leading-relaxed italic">
                  "L'agriculture représente bien plus qu'une activité économique : c'est le fondement de tout patrimoine durable. Mon ambition est de permettre à quiconque le souhaite de posséder sa propre plantation agricole, dans un cadre sécurisé et professionnel."
                </blockquote>
                <p className="mt-6 text-sm sm:text-base opacity-80">— Inocent KOFFI, Fondateur d'AGRICAPITAL SARL</p>
              </div>
            </div>
          </section>

          {/* Pillars */}
          <section className="py-16 sm:py-20 bg-background">
            <div className="container mx-auto px-4">
              <div className="max-w-6xl mx-auto">
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-10 text-center text-foreground">
                  Nos <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">Ambitions</span>
                </h2>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {pillars.map((pillar, index) => {
                    const Icon = pillar.icon;
                    return (
                      <div 
                        key={index}
                        className="group p-6 rounded-2xl bg-card border border-border/50 hover:border-accent/50 hover:shadow-xl transition-all duration-300"
                      >
                        <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                          <Icon className="w-7 h-7 text-white" />
                        </div>
                        <h3 className="text-xl font-bold mb-3 text-foreground">{pillar.title}</h3>
                        <p className="text-muted-foreground leading-relaxed">{pillar.description}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </section>

          {/* Commitments */}
          <section className="py-16 sm:py-20 bg-secondary/30">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto text-center">
                <Shield className="w-12 h-12 sm:w-16 sm:h-16 text-accent mx-auto mb-6" />
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-8 text-foreground">
                  Nos Engagements
                </h2>
                <div className="grid sm:grid-cols-2 gap-4 text-left max-w-3xl mx-auto">
                  {[
                    { title: "Transparence Totale", desc: "Contrat et documents cartographiques remis dès le premier versement." },
                    { title: "Excellence Technique", desc: "Plants certifiés, intrants de qualité, suivi agronomique rigoureux." },
                    { title: "Vision Long Terme", desc: "Un modèle conçu sur 28 ans pour bâtir un patrimoine durable." },
                    { title: "Sécurité Contractuelle", desc: "Contrats sécurisés, cadre juridique rigoureux et architecture contractuelle robuste." },
                  ].map((item, i) => (
                    <div key={i} className="p-5 bg-card rounded-xl border border-border/50">
                      <h3 className="font-bold text-foreground mb-2">{item.title}</h3>
                      <p className="text-sm text-muted-foreground">{item.desc}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-10">
                  <a 
                    href="/agricapital" 
                    className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-primary to-primary/90 text-primary-foreground rounded-xl font-semibold hover:shadow-lg transition-all"
                  >
                    Découvrir AGRICAPITAL
                  </a>
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

export default Vision;
