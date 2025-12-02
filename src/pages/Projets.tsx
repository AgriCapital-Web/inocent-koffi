import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Testimonials from "@/components/Testimonials";
import { Helmet } from "react-helmet-async";
import { Badge } from "@/components/ui/badge";
import { MapPin, Users, Target, Calendar } from "lucide-react";

const Projets = () => {
  const stats = [
    {
      icon: MapPin,
      value: "360+",
      label: "Localités Visitées",
      description: "À travers 8 régions de Côte d'Ivoire"
    },
    {
      icon: Users,
      value: "30+",
      label: "Villages Engagés",
      description: "Communautés rurales mobilisées"
    },
    {
      icon: Target,
      value: "500+",
      label: "Hectares Identifiés",
      description: "Terres qualifiées pour le palmier"
    },
    {
      icon: Calendar,
      value: "12",
      label: "Années d'Expérience",
      description: "Immersion terrain (2012-2024)"
    }
  ];

  return (
    <>
      <Helmet>
        <title>Projets & Témoignages - AGRICAPITAL | Transformation Agricole</title>
        <meta name="description" content="Découvrez les projets et réalisations d'AGRICAPITAL SARL. Témoignages des producteurs agricoles partenaires en Côte d'Ivoire." />
        <link rel="canonical" href="https://www.ikoffi.agricapital.ci/projets" />
      </Helmet>
      <div className="min-h-screen">
        <Navbar />
        <main className="pt-20">
          {/* Hero Section */}
          <section className="py-20 bg-gradient-to-br from-background via-secondary/30 to-background">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto text-center">
                <Badge variant="outline" className="mb-4">Projets & Réalisations</Badge>
                <h1 className="text-4xl lg:text-6xl font-bold mb-6 text-foreground">
                  Notre <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">Parcours</span>
                </h1>
                <p className="text-xl text-muted-foreground leading-relaxed">
                  Un travail de fond sur le terrain, au plus près des communautés rurales et des producteurs agricoles
                </p>
              </div>
            </div>
          </section>

          {/* Stats Grid */}
          <section className="py-20 bg-primary text-primary-foreground">
            <div className="container mx-auto px-4">
              <div className="max-w-6xl mx-auto">
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {stats.map((stat, index) => {
                    const Icon = stat.icon;
                    return (
                      <div 
                        key={index}
                        className="p-6 rounded-2xl bg-primary-foreground/10 backdrop-blur-sm border border-primary-foreground/20 text-center"
                      >
                        <Icon className="w-10 h-10 mx-auto mb-4 text-accent" />
                        <p className="text-4xl font-bold mb-2">{stat.value}</p>
                        <p className="text-lg font-semibold mb-2">{stat.label}</p>
                        <p className="text-sm opacity-80">{stat.description}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </section>

          {/* Gallery */}
          <section className="py-20 bg-background">
            <div className="container mx-auto px-4">
              <div className="max-w-6xl mx-auto">
                <h2 className="text-3xl lg:text-4xl font-bold mb-12 text-center text-foreground">
                  En <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">Images</span>
                </h2>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="group relative rounded-2xl overflow-hidden aspect-[4/3] col-span-2 lg:col-span-1 lg:row-span-2">
                    <img 
                      src="/images/agricapital-poster.jpg" 
                      alt="AGRICAPITAL - Présentation" 
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end p-6">
                      <div>
                        <Badge className="mb-2 bg-accent text-accent-foreground">AGRICAPITAL</Badge>
                        <p className="text-white text-lg font-medium">Le partenaire idéal des producteurs agricoles</p>
                      </div>
                    </div>
                  </div>

                  <div className="group relative rounded-2xl overflow-hidden aspect-[4/3]">
                    <img 
                      src="/images/palm-oil-production.jpg" 
                      alt="Production de palmier à huile" 
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex items-end p-4">
                      <p className="text-white font-medium">Filière Palmier à Huile</p>
                    </div>
                  </div>

                  <div className="group relative rounded-2xl overflow-hidden aspect-[4/3]">
                    <img 
                      src="/images/nursery-palm.jpg" 
                      alt="Pépinière de palmiers" 
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex items-end p-4">
                      <p className="text-white font-medium">Pépinières & Formation</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Testimonials */}
          <Testimonials />
        </main>
        <Footer />
      </div>
    </>
  );
};

export default Projets;
