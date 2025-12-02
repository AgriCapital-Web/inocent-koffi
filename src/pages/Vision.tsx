import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Helmet } from "react-helmet-async";
import { Target, Heart, Users, Sprout, Globe, Award } from "lucide-react";

const Vision = () => {
  const pillars = [
    {
      icon: Heart,
      title: "Dignité des Producteurs",
      description: "Les agriculteurs ne doivent plus être condamnés à lutter seuls ni être perçus par la jeunesse comme un symbole d'échec, mais devenir des modèles de réussite, de dignité et de prospérité."
    },
    {
      icon: Users,
      title: "Autonomisation",
      description: "Élever le statut des producteurs, renforcer leur autonomie, créer des opportunités d'emplois locaux."
    },
    {
      icon: Sprout,
      title: "Écosystème Durable",
      description: "Bâtir un écosystème agricole capable d'inspirer la jeunesse, les familles, les communautés rurales et les futures générations en Afrique."
    },
    {
      icon: Globe,
      title: "Impact Continental",
      description: "Une agriculture africaine moderne, inclusive et prospère qui contribue au développement économique et social du continent."
    }
  ];

  return (
    <>
      <Helmet>
        <title>Ma Vision - Inocent KOFFI | Transformation Agricole Africaine</title>
        <meta name="description" content="Découvrez la vision d'Inocent KOFFI pour une agriculture africaine transformée : dignité des producteurs, autonomisation et développement durable." />
        <link rel="canonical" href="https://www.ikoffi.agricapital.ci/vision" />
      </Helmet>
      <div className="min-h-screen">
        <Navbar />
        <main className="pt-20">
          {/* Hero Section */}
          <section className="py-20 bg-gradient-to-br from-primary/10 via-background to-accent/10 relative overflow-hidden">
            <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
            <div className="container mx-auto px-4 relative z-10">
              <div className="max-w-4xl mx-auto text-center">
                <h1 className="text-4xl lg:text-6xl font-bold mb-8 text-foreground">
                  Ma <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">Vision</span> & Mon Engagement
                </h1>
                
                <div className="bg-card/80 backdrop-blur-sm rounded-3xl p-8 md:p-12 border border-border/50 shadow-xl">
                  <Target className="w-16 h-16 text-accent mx-auto mb-6" />
                  <p className="text-xl lg:text-2xl text-foreground leading-relaxed font-medium">
                    Passionné par la transformation agricole à fort impact <strong>économique</strong>, <strong>social</strong>, <strong>communautaire</strong> et <strong>environnemental</strong>, je suis convaincu que l'agriculture constitue le socle de toute économie durable.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Core Belief Section */}
          <section className="py-20 bg-primary text-primary-foreground">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto text-center">
                <h2 className="text-3xl lg:text-4xl font-bold mb-8">
                  Mon engagement repose sur une conviction forte
                </h2>
                <blockquote className="text-xl lg:text-2xl leading-relaxed italic">
                  "Les agriculteurs ne doivent plus être condamnés à lutter seuls ni être perçus par la jeunesse comme un symbole d'échec, mais devenir des <strong>modèles de réussite</strong>, de <strong>dignité</strong> et de <strong>prospérité</strong>."
                </blockquote>
              </div>
            </div>
          </section>

          {/* Ambition Section */}
          <section className="py-20 bg-background">
            <div className="container mx-auto px-4">
              <div className="max-w-6xl mx-auto">
                <h2 className="text-3xl lg:text-4xl font-bold mb-12 text-center text-foreground">
                  Mon <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">Ambition</span>
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

          {/* Impact Goals */}
          <section className="py-20 bg-secondary/30">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto text-center">
                <Award className="w-16 h-16 text-accent mx-auto mb-6" />
                <h2 className="text-3xl lg:text-4xl font-bold mb-8 text-foreground">
                  Une Vision pour l'Afrique
                </h2>
                <p className="text-xl text-muted-foreground leading-relaxed mb-8">
                  Mon ambition est d'<strong className="text-foreground">élever le statut des producteurs</strong>, renforcer leur autonomie, créer des opportunités d'emplois locaux, et bâtir un écosystème agricole capable d'inspirer la jeunesse, les familles, les communautés rurales et les futures générations en Afrique.
                </p>
                <a 
                  href="/agricapital" 
                  className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-primary to-primary/90 text-primary-foreground rounded-xl font-semibold hover:shadow-lg transition-all"
                >
                  Découvrir AGRICAPITAL
                </a>
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
