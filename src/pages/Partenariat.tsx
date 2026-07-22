import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import TrustBlock from "@/components/TrustBlock";
import Partnership from "@/components/Partnership";
import { Helmet } from "react-helmet-async";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Banknote, Wrench, ShoppingCart, Landmark, Handshake, CheckCircle2 } from "lucide-react";
import partenariatPhoto from "@/assets/partenariat-agricapital.webp.asset.json";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";

const Partenariat = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);

  const partnerTypes = [
    {
      icon: Banknote,
      title: "Partenaires financiers",
      description: "Investisseurs, fonds d'impact, banques, institutions financières et structures de financement souhaitant accompagner le développement de projets agricoles productifs et à fort impact économique et social.",
    },
    {
      icon: Wrench,
      title: "Partenaires techniques",
      description: "Agronomes, cabinets spécialisés, centres de recherche, experts agricoles, fournisseurs d'équipements et opérateurs techniques souhaitant contribuer à l'amélioration continue des performances agricoles.",
    },
    {
      icon: ShoppingCart,
      title: "Partenaires commerciaux",
      description: "Acheteurs, transformateurs, distributeurs, exportateurs et industriels souhaitant développer des relations durables avec les producteurs et sécuriser leurs approvisionnements.",
    },
    {
      icon: Landmark,
      title: "Partenaires institutionnels",
      description: "Organisations de développement, ONG, programmes publics et privés, structures d'appui, institutions nationales et internationales engagées dans le développement économique et social des territoires.",
    },
  ];

  const impacts = [
    "Valoriser durablement les terres agricoles",
    "Renforcer les revenus des producteurs",
    "Créer des emplois en milieu rural",
    "Favoriser l'insertion économique des jeunes",
    "Soutenir l'autonomisation économique des femmes",
    "Renforcer les économies locales",
    "Structurer durablement les chaînes de valeur agricoles",
    "Encourager la transformation locale des productions",
    "Participer à la sécurité alimentaire",
    "Développer un patrimoine agricole durable au service des générations futures",
  ];

  return (
    <>
      <Helmet>
        <title>Partenariats — AgriCapital | Construisons une agriculture performante & durable</title>
        <meta name="description" content="AgriCapital recherche des partenaires financiers, techniques, commerciaux et institutionnels engagés dans le développement durable de l'agriculture en Côte d'Ivoire." />
        <link rel="canonical" href="https://www.ikoffi.agricapital.ci/partenariat" />
      </Helmet>
      <div className="min-h-screen">
        <Navbar />
        <main className="pt-20">
          {/* Hero */}
          <section className="py-16 sm:py-20 bg-gradient-to-br from-primary/10 via-background to-accent/10">
            <div className="container mx-auto px-4">
              <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-10 items-center">
                <div>
                  <Badge variant="outline" className="mb-4">Partenariats</Badge>
                  <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 text-foreground leading-tight">
                    Construisons ensemble une agriculture <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">performante, inclusive et durable</span>
                  </h1>
                  <p className="text-base sm:text-lg text-muted-foreground leading-relaxed mb-8 text-justify">
                    Nous recherchons des partenaires engagés dans le développement durable de l'agriculture et la création de valeur au sein des territoires.
                  </p>
                  <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
                    <DialogTrigger asChild>
                      <Button size="lg" className="bg-gradient-to-r from-primary to-primary/90">
                        <Handshake className="w-5 h-5 mr-2" />
                        Soumettre une demande de partenariat
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                      <Partnership />
                    </DialogContent>
                  </Dialog>
                </div>
                <div className="relative">
                  <div className="absolute -inset-3 rounded-3xl bg-gradient-to-br from-primary/30 via-accent/20 to-transparent blur-2xl" aria-hidden />
                  <img
                    src={partenariatPhoto.url}
                    alt="Équipe AgriCapital en réunion dans une plantation de palmiers"
                    className="relative w-full h-auto rounded-2xl shadow-2xl object-cover"
                    loading="eager"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Partner Types */}
          <section className="py-16 sm:py-20 bg-background">
            <div className="container mx-auto px-4">
              <div className="max-w-6xl mx-auto">
                <h2 className="text-3xl lg:text-4xl font-bold mb-3 text-foreground">
                  Nos quatre familles de <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">partenaires</span>
                </h2>
                <p className="text-muted-foreground max-w-3xl mb-10 text-justify">
                  Quatre profils complémentaires pour bâtir une filière agricole performante, transparente et créatrice de valeur partagée.
                </p>
                <div className="grid sm:grid-cols-2 gap-6">
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
                        <p className="text-muted-foreground leading-relaxed text-justify">{type.description}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </section>

          {/* Impact list */}
          <section className="py-16 sm:py-20 bg-secondary/30">
            <div className="container mx-auto px-4">
              <div className="max-w-5xl mx-auto">
                <h2 className="text-3xl lg:text-4xl font-bold mb-3 text-foreground">
                  Ensemble, nous contribuons à
                </h2>
                <p className="text-muted-foreground mb-10 max-w-3xl text-justify">
                  Un impact mesurable pour les territoires, les producteurs et les filières agricoles.
                </p>
                <ul className="grid sm:grid-cols-2 gap-3">
                  {impacts.map((item, i) => (
                    <li key={i} className="flex items-start gap-3 p-4 rounded-xl bg-card border border-border/50">
                      <CheckCircle2 className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                      <span className="text-foreground">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          {/* CTA */}
          <section className="py-16 sm:py-20 bg-primary text-primary-foreground">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto">
                <h2 className="text-3xl lg:text-4xl font-bold mb-6">
                  Vous souhaitez devenir partenaire&nbsp;?
                </h2>
                <p className="text-lg sm:text-xl mb-8 opacity-90 text-justify">
                  Présentez-nous votre projet de collaboration&nbsp;: nos équipes reviennent vers vous rapidement pour étudier ensemble les meilleures synergies.
                </p>
                <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
                  <DialogTrigger asChild>
                    <Button size="lg" variant="secondary" className="bg-accent text-accent-foreground hover:bg-accent/90">
                      <Handshake className="w-5 h-5 mr-2" />
                      Soumettre une demande
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                    <Partnership />
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </section>
          <TrustBlock />
        </main>
        <Footer />
      </div>
    </>
  );
};

export default Partenariat;