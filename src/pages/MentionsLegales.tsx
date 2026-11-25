import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Helmet } from "react-helmet-async";

const MentionsLegales = () => {
  return (
    <>
      <Helmet>
        <title>Mentions légales | Inocent KOFFI</title>
        <meta name="description" content="Mentions légales du site ikoffi.agricapital.ci. Informations sur l'éditeur, l'hébergement et les conditions d'utilisation." />
        <link rel="canonical" href="https://ikoffi.agricapital.ci/mentions-legales" />
      </Helmet>
      <div className="min-h-screen">
        <Navbar />
        <main className="pt-20">
          <section className="py-20 bg-background">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto prose prose-lg">
                <h1 className="text-4xl font-bold mb-8 text-foreground">Mentions Légales</h1>

                <section className="mb-8">
                  <h2 className="text-2xl font-bold mb-4 text-foreground">Éditeur du site</h2>
                  <p className="text-muted-foreground">
                    <strong className="text-foreground">Inocent KOFFI</strong><br />
                    Gérant d'AGRICAPITAL SARL<br />
                    Capital social : 5 000 000 FCFA<br />
                    Siège social : Daloa, Haut-Sassandra, Côte d'Ivoire<br />
                    RCCM : CI-01-DAL-2025-B12-13435<br />
                    Email : inocent.koffi@agricapital.ci · innocentkoffi1@gmail.com · inocent.koffi@ivoireprojet.com<br />
                    Téléphone / WhatsApp : +225 07 59 56 60 87
                  </p>
                </section>

                <section className="mb-8">
                  <h2 className="text-2xl font-bold mb-4 text-foreground">Hébergement</h2>
                  <p className="text-muted-foreground">
                    Ce site est hébergé par Lovable (GPT Engineer, Inc.)<br />
                    San Francisco, CA, USA
                  </p>
                </section>

                <section className="mb-8">
                  <h2 className="text-2xl font-bold mb-4 text-foreground">Propriété intellectuelle</h2>
                  <p className="text-muted-foreground">
                    L'ensemble du contenu de ce site (textes, images, vidéos, logos, etc.) est la propriété d'Inocent KOFFI ou de ses partenaires et projets respectifs, sauf mention contraire. Toute reproduction, représentation, modification, publication, adaptation de tout ou partie des éléments du site, quel que soit le moyen ou le procédé utilisé, est interdite sans l'autorisation écrite préalable d'Inocent KOFFI.
                  </p>
                </section>

                <section className="mb-8">
                  <h2 className="text-2xl font-bold mb-4 text-foreground">Protection des données personnelles</h2>
                  <p className="text-muted-foreground">
                    Les données transmises via les formulaires (identité, coordonnées et contenu de la demande) sont utilisées pour répondre aux sollicitations et gérer la relation correspondante. Les demandes de commande et l’espace client peuvent nécessiter des traitements supplémentaires décrits dans les documents contractuels et notices applicables. Les prestataires techniques nécessaires à l’hébergement, à la base de données et aux services demandés peuvent traiter ces informations. Pour exercer vos droits d’accès, de rectification, d’opposition ou de suppression, contactez inocent.koffi@agricapital.ci.
                  </p>
                </section>

                <section className="mb-8">
                  <h2 className="text-2xl font-bold mb-4 text-foreground">Cookies</h2>
                  <p className="text-muted-foreground">
                    Les statistiques Google Analytics, lorsqu’elles sont configurées, restent désactivées tant que vous n’avez pas accepté leur utilisation. Votre choix est enregistré dans le navigateur. Vous pouvez refuser ou modifier ce choix à tout moment avec le lien « Gérer les cookies » en bas de page. Le refus des statistiques n’empêche pas la navigation.
                  </p>
                </section>

                <section className="mb-8">
                  <h2 className="text-2xl font-bold mb-4 text-foreground">Contact</h2>
                  <p className="text-muted-foreground">
                    Pour toute question relative aux présentes mentions légales, vous pouvez nous contacter :<br />
                    Email : inocent.koffi@agricapital.ci · innocentkoffi1@gmail.com · inocent.koffi@ivoireprojet.com<br />
                    Téléphone / WhatsApp : +225 07 59 56 60 87
                  </p>
                </section>
              </div>
            </div>
          </section>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default MentionsLegales;
