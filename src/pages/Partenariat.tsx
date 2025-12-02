import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Partnership from "@/components/Partnership";
import { Helmet } from "react-helmet-async";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Package, GraduationCap, Factory, Users, Heart, Globe } from "lucide-react";

const Partenariat = () => {
  const partnerTypes = [
    {
      icon: TrendingUp,
      title: "Investissement",
      description: "Participez au développement d'un modèle innovant et durable dans la filière palmier à huile, créateur d'emplois, de valeur locale et d'impact communautaire."
    },
    {
      icon: Package,
      title: "Fourniture d'intrants",
      description: "Collaborez avec nous en tant que partenaire fournisseur d'intrants agricoles (plants, outils, produits phytosanitaires, équipements). Ensemble, assurons des plantations performantes, durables et conformes aux standards techniques."
    },
    {
      icon: GraduationCap,
      title: "Partenariat Technique",
      description: "Mobilisons nos expertises pour renforcer l'encadrement : formation, suivi agronomique, bonnes pratiques agricoles, itinéraires techniques, efficacité des rendements. Un partenariat opérationnel pour améliorer durablement les performances des producteurs."
    },
    {
      icon: Factory,
      title: "Industriels & Acheteurs",
      description: "Travaillez avec nous pour l'achat, la transformation et la valorisation des productions agricoles. Nous construisons des relations solides et fiables avec des acteurs industriels, transformateurs et coopératives engagés dans une filière transparente et équitable."
    },
    {
      icon: Users,
      title: "Coopératives & Organisations Paysannes",
      description: "Créons ensemble une dynamique territoriale forte : mobilisation des producteurs, structuration locale, accès aux marchés, partage de bonnes pratiques."
    },
    {
      icon: Heart,
      title: "ONG & Institutions",
      description: "Unissons nos efforts pour des programmes d'impact social : développement rural, autonomisation des producteurs, sécurité alimentaire, résilience climatique et inclusion économique."
    },
    {
      icon: Globe,
      title: "Collaboration Globale",
      description: "Partageons nos expertises pour amplifier l'impact, professionnaliser la filière et soutenir durablement les communautés rurales."
    }
  ];

  return (
    <>
      <Helmet>
        <title>Partenariat - AGRICAPITAL | Devenez Notre Partenaire</title>
        <meta name="description" content="Rejoignez AGRICAPITAL dans la transformation de l'agriculture africaine. Investissement, fourniture d'intrants, partenariat technique et plus." />
        <link rel="canonical" href="https://www.ikoffi.agricapital.ci/partenariat" />
      </Helmet>
      <div className="min-h-screen">
        <Navbar />
        <main className="pt-20">
          {/* Hero Section */}
          <section className="py-20 bg-gradient-to-br from-primary/10 via-background to-accent/10">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto text-center">
                <Badge variant="outline" className="mb-4">Partenariat</Badge>
                <h1 className="text-4xl lg:text-6xl font-bold mb-6 text-foreground">
                  Devenez Notre <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">Partenaire</span>
                </h1>
                <p className="text-xl text-muted-foreground leading-relaxed">
                  Rejoignez-nous dans notre mission de transformer durablement l'agriculture africaine et de bâtir un modèle agricole inclusif, structuré et sans barrière financière.
                </p>
              </div>
            </div>
          </section>

          {/* Partner Types */}
          <section className="py-20 bg-background">
            <div className="container mx-auto px-4">
              <div className="max-w-6xl mx-auto">
                <h2 className="text-3xl lg:text-4xl font-bold mb-12 text-center text-foreground">
                  Types de <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">Partenariat</span>
                </h2>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {partnerTypes.map((type, index) => {
                    const Icon = type.icon;
                    return (
                      <div 
                        key={index}
                        className="group p-6 rounded-2xl bg-card border border-border/50 hover:border-accent/50 hover:shadow-xl transition-all duration-300"
                      >
                        <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                          <Icon className="w-7 h-7 text-white" />
                        </div>
                        <h3 className="text-xl font-bold mb-3 text-foreground">{type.title}</h3>
                        <p className="text-muted-foreground leading-relaxed">{type.description}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </section>

          {/* Partnership Form */}
          <Partnership />
        </main>
        <Footer />
      </div>
    </>
  );
};

export default Partenariat;
