import { Helmet } from "react-helmet-async";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Badge } from "@/components/ui/badge";
import { Calendar, Check, Clock, MapPin, Sprout, Target, TrendingUp, Users, Palmtree } from "lucide-react";

const Evolution = () => {
  const milestones = [
    {
      date: "19 Novembre 2025",
      title: "Lancement Officiel des Activités Terrain",
      description:
        "Démarrage effectif des opérations d'AGRICAPITAL sur le terrain. Cette journée a réuni les premiers souscripteurs, partenaires locaux et membres de l'équipe autour d'un objectif commun : transformer durablement l'agriculture dans la région du Haut-Sassandra.",
      status: "completed",
      images: [
        "/images/gallery/launch-1.jpg",
        "/images/gallery/launch-2.jpg",
        "/images/gallery/launch-3.jpg",
        "/images/gallery/launch-4.jpg",
        "/images/gallery/launch-5.jpg",
        "/images/gallery/launch-6.jpg",
        "/images/gallery/launch-7.jpg",
      ],
    },
    {
      date: "19 Nov - 24 Déc 2025",
      title: "Installation de la Pépinière 100+ Hectares",
      description:
        "Installation complète de notre site de pépinière de plus de 100 hectares avec système d'irrigation moderne et semences certifiées Tenera.",
      status: "completed",
      images: [
        "/images/gallery/nursery-dec-2025-1.jpg",
        "/images/gallery/nursery-palm-real.jpg",
        "/images/gallery/nursery-1.jpg",
        "/images/gallery/nursery-2.jpg",
      ],
    },
    {
      date: "Janvier - Mars 2026",
      title: "Phase de Germination et Suivi",
      description:
        "Suivi intensif des germinations et préparation des substrats. Formation continue des équipes techniques.",
      status: "in_progress",
      images: [
        "/images/gallery/jalon-1.jpg",
        "/images/gallery/jalon-2.jpg",
        "/images/gallery/jalon-3.jpg",
      ],
    },
    {
      date: "Avril - Juin 2026",
      title: "Croissance Pré-Pépinière",
      description:
        "Développement des plants en pré-pépinière avec irrigation contrôlée et suivi phytosanitaire rigoureux.",
      status: "upcoming",
      images: [
        "/images/gallery/jalon-4.jpg",
        "/images/gallery/jalon-5.jpg",
      ],
    },
    {
      date: "Juillet - Décembre 2026",
      title: "Maturation et Distribution",
      description:
        "Plants prêts pour la mise en terre avec 12-14 feuilles développées. Distribution aux producteurs partenaires.",
      status: "upcoming",
      images: [
        "/images/gallery/jalon-6.jpg",
        "/images/gallery/jalon-7.jpg",
      ],
    },
  ];

  const stats = [
    { icon: Sprout, value: "10,000+", label: "Plants en Production" },
    { icon: Target, value: "100+ ha", label: "Site de Pépinière" },
    { icon: Users, value: "250+", label: "Producteurs Accompagnés" },
    { icon: MapPin, value: "30+", label: "Villages Engagés" }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-accent text-accent-foreground"><Check className="w-3 h-3 mr-1" /> Complété</Badge>;
      case "in_progress":
        return <Badge className="bg-primary text-primary-foreground animate-pulse"><Clock className="w-3 h-3 mr-1" /> En cours</Badge>;
      default:
        return <Badge variant="secondary"><Calendar className="w-3 h-3 mr-1" /> À venir</Badge>;
    }
  };

  return (
    <>
      <Helmet>
        <title>Évolution du Projet | AGRICAPITAL - Pépinière de Palmiers à Huile</title>
        <meta name="description" content="Suivez l'évolution du projet AGRICAPITAL : pépinière de palmiers à huile, jalons, photos de progression et impact sur les communautés rurales ivoiriennes." />
        <meta name="keywords" content="AGRICAPITAL, évolution projet, pépinière palmier huile, Côte d'Ivoire, agriculture durable, Inocent KOFFI" />
        <link rel="canonical" href="https://ikoffi.agricapital.ci/evolution" />
        <meta property="og:title" content="Évolution du Projet AGRICAPITAL" />
        <meta property="og:description" content="Découvrez les jalons et la progression de notre pépinière de palmiers à huile certifiés." />
        <meta property="og:image" content="https://ikoffi.agricapital.ci/images/gallery/nursery-dec-2025-1.jpg" />
        <meta property="og:url" content="https://ikoffi.agricapital.ci/evolution" />
        <meta property="og:type" content="website" />
      </Helmet>

      <Navbar />

      <main className="min-h-screen bg-background">
        {/* Hero Section */}
        <section className="relative py-20 lg:py-32 bg-gradient-to-br from-primary/10 via-background to-accent/10 overflow-hidden">
          <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-4xl mx-auto text-center">
              <Badge variant="outline" className="mb-6 text-sm px-4 py-2 border-accent text-accent">
                <Palmtree className="w-4 h-4 mr-2 inline" />
                Timeline Interactive
              </Badge>
              <h1 className="text-4xl lg:text-6xl font-bold mb-6 text-foreground">
                Évolution du{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
                  Projet
                </span>
              </h1>
              <p className="text-lg lg:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                Suivez en temps réel l'avancement de notre pépinière de palmiers à huile et notre impact sur les communautés rurales du Haut-Sassandra.
              </p>
            </div>
          </div>
        </section>

        {/* Stats Grid */}
        <section className="py-12 bg-card border-y">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
              {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <div key={index} className="text-center p-6 rounded-xl bg-background hover:shadow-lg transition-shadow">
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center mx-auto mb-4">
                      <Icon className="w-7 h-7 text-white" />
                    </div>
                    <p className="text-2xl lg:text-3xl font-bold text-foreground">{stat.value}</p>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Timeline Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              <h2 className="text-3xl lg:text-4xl font-bold text-center mb-16 text-foreground">
                Jalons du Projet
              </h2>

              <div className="relative">
                {/* Timeline line */}
                <div className="absolute left-0 md:left-1/2 transform md:-translate-x-1/2 h-full w-1 bg-gradient-to-b from-primary via-accent to-primary/30"></div>

                <div className="space-y-12">
                  {milestones.map((milestone, index) => (
                    <div
                      key={index}
                      className={`relative flex flex-col md:flex-row gap-8 ${
                        index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                      }`}
                    >
                      {/* Content */}
                      <div className={`flex-1 ml-8 md:ml-0 ${index % 2 === 0 ? "md:pr-12 md:text-right" : "md:pl-12 md:text-left"}`}>
                        <div className={`p-6 rounded-2xl border transition-all duration-300 hover:shadow-xl ${
                          milestone.status === "completed"
                            ? "bg-accent/5 border-accent/30"
                            : milestone.status === "in_progress"
                            ? "bg-primary/5 border-primary/30"
                            : "bg-card border-border"
                        }`}>
                          <div className={`flex items-center gap-3 mb-3 flex-wrap ${index % 2 === 0 ? "md:justify-end" : ""}`}>
                            <span className="text-sm font-semibold text-accent flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              {milestone.date}
                            </span>
                            {getStatusBadge(milestone.status)}
                          </div>
                          <h3 className="text-xl font-bold text-foreground mb-3">{milestone.title}</h3>
                          <p className="text-muted-foreground mb-4 leading-relaxed">{milestone.description}</p>

                          {/* Image Gallery */}
                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-4">
                            {milestone.images.map((img, imgIndex) => (
                              <div key={imgIndex} className="relative rounded-xl overflow-hidden aspect-video group">
                                <img
                                  src={img}
                                  alt={`${milestone.title} - Image ${imgIndex + 1}`}
                                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                  loading="lazy"
                                />
                                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors"></div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Timeline dot */}
                      <div className="absolute left-0 md:left-1/2 transform -translate-x-1/2 z-10">
                        <div className={`w-5 h-5 rounded-full border-4 ${
                          milestone.status === "completed"
                            ? "bg-accent border-accent"
                            : milestone.status === "in_progress"
                            ? "bg-primary border-primary animate-pulse"
                            : "bg-background border-muted-foreground/30"
                        }`}></div>
                      </div>

                      {/* Spacer for alternating layout */}
                      <div className="flex-1 hidden md:block"></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-br from-primary/10 via-accent/5 to-background">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl lg:text-4xl font-bold mb-6 text-foreground">
              Rejoignez l'Aventure AGRICAPITAL
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
              Participez à la transformation de l'agriculture ivoirienne et africaine.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="/partenariat" className="inline-flex items-center justify-center px-8 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-colors">
                Devenir Partenaire
              </a>
              <a href="/contact" className="inline-flex items-center justify-center px-8 py-3 border-2 border-accent text-accent rounded-lg font-semibold hover:bg-accent/10 transition-colors">
                Nous Contacter
              </a>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
};

export default Evolution;
