import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Helmet } from "react-helmet-async";
import profilePhoto from "@/assets/profile-photo.jpg";

const APropos = () => {
  return (
    <>
      <Helmet>
        <title>À Propos - Inocent KOFFI | Fondateur AGRICAPITAL SARL</title>
        <meta name="description" content="Découvrez le parcours d'Inocent KOFFI, fondateur d'AGRICAPITAL SARL. 12 années d'immersion terrain auprès des producteurs agricoles en Côte d'Ivoire." />
        <link rel="canonical" href="https://www.ikoffi.agricapital.ci/a-propos" />
      </Helmet>
      <div className="min-h-screen">
        <Navbar />
        <main className="pt-20">
          {/* Hero Section */}
          <section className="py-20 bg-gradient-to-br from-background via-secondary/30 to-background">
            <div className="container mx-auto px-4">
              <div className="max-w-6xl mx-auto">
                <div className="text-center mb-12">
                  <h1 className="text-4xl lg:text-6xl font-bold mb-6 text-foreground">
                    À <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">Propos</span>
                  </h1>
                </div>

                <div className="grid lg:grid-cols-2 gap-12 items-start">
                  {/* Photo Section */}
                  <div className="flex justify-center lg:justify-start">
                    <div className="relative">
                      <div className="absolute -inset-4 bg-gradient-to-r from-primary to-accent rounded-3xl blur-2xl opacity-20"></div>
                      <img 
                        src={profilePhoto} 
                        alt="Inocent KOFFI - Fondateur AGRICAPITAL SARL" 
                        className="relative rounded-3xl shadow-2xl max-w-md w-full h-auto object-cover"
                        loading="eager"
                      />
                    </div>
                  </div>

                  {/* Content Section */}
                  <div className="space-y-6">
                    <div className="bg-card rounded-2xl p-6 border border-border/50">
                      <p className="text-lg text-foreground leading-relaxed font-medium">
                        Fondateur et Directeur Général d'<strong className="text-primary">AGRICAPITAL SARL</strong>, Le partenaire idéal des producteurs agricoles, entreprise au capital social de 5 000 000 FCFA, basée à Daloa (Haut-Sassandra) et immatriculée au Registre du Commerce et du Crédit Mobilier sous le numéro CI-01-DAL-2025-B12-13435.
                      </p>
                    </div>

                    <p className="text-lg text-muted-foreground leading-relaxed">
                      AGRICAPITAL est spécialisée dans l'accompagnement agricole et les services intégrés, avec pour mission d'ouvrir l'accès à la filière palmier à huile grâce à un modèle structuré, durable et sans barrière financière, reposant sur un financement adapté et un encadrement professionnel.
                    </p>

                    <div className="flex flex-wrap gap-4 pt-4">
                      <a 
                        href="tel:+2250759566087" 
                        className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors"
                      >
                        <span className="font-medium">07 59 56 60 87</span>
                      </a>
                      <a 
                        href="mailto:contact@agricapital.ci" 
                        className="inline-flex items-center gap-2 px-4 py-2 bg-accent/10 text-accent-foreground rounded-lg hover:bg-accent/20 transition-colors"
                      >
                        <span className="font-medium">contact@agricapital.ci</span>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* 12 Years Experience Section */}
          <section className="py-20 bg-secondary/30">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto">
                <h2 className="text-3xl lg:text-4xl font-bold mb-8 text-center text-foreground">
                  12 années d'<span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">immersion</span> sur le terrain
                </h2>

                <div className="space-y-6 text-lg text-muted-foreground leading-relaxed">
                  <p>
                    De 2012 à 2024, mon modeste parcours professionnel m'a conduit dans plus de <strong className="text-foreground">360 localités</strong> à travers <strong className="text-foreground">8 régions de Côte d'Ivoire</strong> : Loh-Djiboua, Gôh, Nawa, Gboklè, Grands-Ponts, Agnéby-Tiassa, Haut-Sassandra et Marahoué.
                  </p>

                  <p>
                    Cette immersion profonde dans les villages, campements et hameaux m'a permis de :
                  </p>

                  <ul className="space-y-3 pl-6">
                    <li className="flex items-start gap-3">
                      <span className="w-2 h-2 rounded-full bg-accent mt-2 flex-shrink-0"></span>
                      <span>comprendre les réalités quotidiennes des producteurs agricoles ;</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="w-2 h-2 rounded-full bg-accent mt-2 flex-shrink-0"></span>
                      <span>identifier leurs contraintes structurelles ;</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="w-2 h-2 rounded-full bg-accent mt-2 flex-shrink-0"></span>
                      <span>mesurer les potentiels inexploités de nos terres et de nos communautés ;</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="w-2 h-2 rounded-full bg-accent mt-2 flex-shrink-0"></span>
                      <span>analyser les besoins réels pour bâtir un modèle adapté, efficace et durable.</span>
                    </li>
                  </ul>

                  <p className="italic border-l-4 border-accent pl-6 py-2">
                    Ces 12 années d'écoute, d'observation, d'apprentissage et de collaboration ont façonné une compréhension intime du monde paysan et constituent les fondations de ma vision.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Structured Model Section */}
          <section className="py-20 bg-background">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto">
                <h2 className="text-3xl lg:text-4xl font-bold mb-8 text-center text-foreground">
                  La naissance d'un modèle <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">structuré et durable</span>
                </h2>

                <div className="space-y-6 text-lg text-muted-foreground leading-relaxed">
                  <p>
                    De cette expérience est née une ambition : bâtir un <strong className="text-foreground">écosystème agricole intégré</strong>, permettant à chaque jeune Africain de se développer durablement depuis son milieu d'origine grâce à l'agriculture.
                  </p>

                  <p>Ce modèle repose sur :</p>

                  <div className="grid md:grid-cols-2 gap-4">
                    {[
                      "Un financement adapté, pensé pour lever les obstacles financiers",
                      "Un accompagnement technique complet et structuré",
                      "Un suivi technique durable",
                      "Une formation continue",
                      "La transformation locale, pour créer plus de valeur et davantage d'emplois dans les territoires",
                      "Un cadre sécurisé, équitable et sans barrière financière",
                      "Une approche humaine et durable au service des communautés rurales et de la société"
                    ].map((item, index) => (
                      <div key={index} className="flex items-start gap-3 p-4 bg-card rounded-xl border border-border/50">
                        <span className="w-6 h-6 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                          {index + 1}
                        </span>
                        <span className="text-foreground">{item}</span>
                      </div>
                    ))}
                  </div>

                  <p className="text-center text-lg font-medium text-foreground mt-8">
                    Cette vision guide aujourd'hui la mission d'<strong className="text-primary">AGRICAPITAL SARL</strong>, ambitieuse de contribuer à un secteur agricole plus moderne, plus inclusif, générateur d'emplois et véritablement prospère.
                  </p>
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

export default APropos;
