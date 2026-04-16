import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Helmet } from "react-helmet-async";
import profilePhoto from "@/assets/profile-photo.jpg";

const APropos = () => {
  return (
    <>
      <Helmet>
        <title>À Propos - Inocent KOFFI | Fondateur & CEO AGRICAPITAL SARL</title>
        <meta name="description" content="Découvrez le parcours d'Inocent KOFFI, fondateur & CEO d'AGRICAPITAL SARL. Agro-entrepreneur et stratège en développement agricole en Côte d'Ivoire." />
        <link rel="canonical" href="https://www.ikoffi.agricapital.ci/a-propos" />
      </Helmet>
      <div className="min-h-screen">
        <Navbar />
        <main className="pt-20">
          {/* Hero Section */}
          <section className="py-12 sm:py-20 bg-gradient-to-br from-background via-secondary/30 to-background">
            <div className="container mx-auto px-4">
              <div className="max-w-6xl mx-auto">
                <div className="text-center mb-8 sm:mb-12">
                  <h1 className="text-3xl sm:text-4xl lg:text-6xl font-bold mb-6 text-foreground">
                    À <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">Propos</span>
                  </h1>
                </div>

                <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 items-start">
                  {/* Photo */}
                  <div className="flex justify-center lg:justify-start">
                    <div className="relative">
                      <div className="absolute -inset-4 bg-gradient-to-r from-primary to-accent rounded-3xl blur-2xl opacity-20"></div>
                      <img 
                        src={profilePhoto} 
                        alt="Inocent KOFFI - Fondateur & CEO AGRICAPITAL SARL" 
                        className="relative rounded-3xl shadow-2xl max-w-sm sm:max-w-md w-full h-auto object-cover"
                        loading="eager"
                      />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="space-y-4 sm:space-y-6">
                    <div className="bg-card rounded-2xl p-4 sm:p-6 border border-border/50">
                      <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-2">Inocent KOFFI</h2>
                      <p className="text-base sm:text-lg text-foreground leading-relaxed font-medium">
                        Fondateur & CEO — <strong className="text-primary">AGRICAPITAL SARL</strong>
                      </p>
                    </div>

                    <p className="text-base sm:text-lg text-muted-foreground leading-relaxed italic">
                      Agro-entrepreneur et Stratège en Développement Agricole
                    </p>
                    <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
                      De 2012 à 2024, Inocent KOFFI a développé une expertise terrain exceptionnelle à travers plus d'une décennie d'immersion au sein des communautés rurales ivoiriennes. Cette connaissance intime du territoire, des réalités agricoles et du potentiel foncier constitue un atout stratégique majeur.
                    </p>
                    <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
                      AgriCapital incarne cette vision : bâtir un écosystème où chaque partie prenante — avec ou sans terrain — trouve sa place et construit un patrimoine tangible, créateur de valeur.
                    </p>
                    <blockquote className="border-l-4 border-accent pl-4 sm:pl-6 py-2 italic text-base sm:text-lg text-foreground">
                      "L'agriculture représente bien plus qu'une activité économique : c'est le fondement de tout patrimoine durable."
                    </blockquote>

                    <div className="flex flex-wrap gap-3 sm:gap-4 pt-4">
                      <a 
                        href="tel:+2250564551717" 
                        className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors text-sm sm:text-base"
                      >
                        <span className="font-medium">05 64 55 17 17</span>
                      </a>
                      <a 
                        href="mailto:contact@agricapital.ci" 
                        className="inline-flex items-center gap-2 px-4 py-2 bg-accent/10 text-accent-foreground rounded-lg hover:bg-accent/20 transition-colors text-sm sm:text-base"
                      >
                        <span className="font-medium">contact@agricapital.ci</span>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* 12 Years */}
          <section className="py-12 sm:py-20 bg-secondary/30">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto">
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-6 sm:mb-8 text-center text-foreground">
                  12 années d'<span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">expertise terrain</span>
                </h2>

                <div className="space-y-4 sm:space-y-6 text-base sm:text-lg text-muted-foreground leading-relaxed">
                  <p>
                    De 2012 à 2024, Inocent KOFFI a parcouru plus de <strong className="text-foreground">360 localités</strong> à travers <strong className="text-foreground">8 régions de Côte d'Ivoire</strong> : Loh-Djiboua, Gôh, Nawa, Gboklè, Grands-Ponts, Agnéby-Tiassa, Haut-Sassandra et Marahoué.
                  </p>

                  <p>Cette expertise terrain permet à AgriCapital de :</p>

                  <ul className="space-y-3 pl-4 sm:pl-6">
                    {[
                      "Identifier et valider techniquement les parcelles à fort potentiel",
                      "Mener des rencontres avec les propriétaires terriens et les communautés locales",
                      "Réaliser la cartographie GPS et la sécurisation des périmètres agricoles",
                      "Évaluer le potentiel agronomique des sols et la capacité de production"
                    ].map((item, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <span className="w-2 h-2 rounded-full bg-accent mt-2 flex-shrink-0"></span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>

                  <p className="italic border-l-4 border-accent pl-4 sm:pl-6 py-2">
                    Cette connaissance intime du territoire et du potentiel foncier est un atout stratégique majeur pour identifier et sécuriser les meilleures terres pour nos clients.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* AgriCapital Model */}
          <section className="py-12 sm:py-20 bg-background">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto">
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-6 sm:mb-8 text-center text-foreground">
                  AgriCapital : <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">le modèle</span>
                </h2>

                <div className="space-y-4 sm:space-y-6 text-base sm:text-lg text-muted-foreground leading-relaxed">
                  <p>
                    La Côte d'Ivoire possède un potentiel agricole considérable, encore largement sous-valorisé. AgriCapital répond à ce double défi en développant un modèle structuré de promotion agricole.
                  </p>
                  <p>
                    L'entreprise conçoit et déploie des <strong className="text-foreground">plantations clé en main</strong>, permettant aux particuliers et professionnels d'accéder à une agriculture productive, tout en étant déchargés des contraintes techniques, foncières et organisationnelles.
                  </p>

                  <div className="grid sm:grid-cols-2 gap-3 sm:gap-4">
                    {[
                      "Plantation clé en main avec 143 plants certifiés/hectare",
                      "Accompagnement complet sur 36 mois de développement",
                      "Garantie d'achat sur 25 ans via partenaires industriels",
                      "Sécurité contractuelle et cadre juridique solide",
                      "Cartographie GPS et traçabilité complète",
                      "Suivi agronomique et 6 visites techniques par cycle"
                    ].map((item, index) => (
                      <div key={index} className="flex items-start gap-3 p-3 sm:p-4 bg-card rounded-xl border border-border/50">
                        <span className="w-6 h-6 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                          ✓
                        </span>
                        <span className="text-foreground text-sm sm:text-base">{item}</span>
                      </div>
                    ))}
                  </div>

                  <p className="text-center text-base sm:text-lg font-medium text-foreground mt-8">
                    <a href="/agricapital" className="text-primary hover:underline font-bold">Découvrir AGRICAPITAL →</a>
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
