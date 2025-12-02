import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Helmet } from "react-helmet-async";

const MentionsLegales = () => {
  return (
    <>
      <Helmet>
        <title>Mentions Légales - Inocent KOFFI | AGRICAPITAL SARL</title>
        <meta name="description" content="Mentions légales du site ikoffi.agricapital.ci. Informations sur l'éditeur, l'hébergement et les conditions d'utilisation." />
        <link rel="canonical" href="https://www.ikoffi.agricapital.ci/mentions-legales" />
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
                    Fondateur et Directeur Général d'AGRICAPITAL SARL<br />
                    Capital social : 5 000 000 FCFA<br />
                    Siège social : Daloa, Haut-Sassandra, Côte d'Ivoire<br />
                    RCCM : CI-01-DAL-2025-B12-13435<br />
                    Email : Inocent.koffi@agricapital.ci<br />
                    Téléphone : 07 59 56 60 87
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
                    L'ensemble du contenu de ce site (textes, images, vidéos, logos, etc.) est la propriété exclusive d'Inocent KOFFI et d'AGRICAPITAL SARL, sauf mention contraire. Toute reproduction, représentation, modification, publication, adaptation de tout ou partie des éléments du site, quel que soit le moyen ou le procédé utilisé, est interdite sans l'autorisation écrite préalable d'Inocent KOFFI.
                  </p>
                </section>

                <section className="mb-8">
                  <h2 className="text-2xl font-bold mb-4 text-foreground">Protection des données personnelles</h2>
                  <p className="text-muted-foreground">
                    Les informations recueillies via les formulaires de contact, de témoignage et de partenariat sont destinées exclusivement à AGRICAPITAL SARL. Elles ne sont en aucun cas cédées à des tiers. Conformément à la réglementation en vigueur, vous disposez d'un droit d'accès, de rectification et de suppression des données vous concernant. Pour exercer ce droit, veuillez nous contacter à l'adresse : Inocent.koffi@agricapital.ci
                  </p>
                </section>

                <section className="mb-8">
                  <h2 className="text-2xl font-bold mb-4 text-foreground">Cookies</h2>
                  <p className="text-muted-foreground">
                    Ce site utilise des cookies techniques nécessaires à son bon fonctionnement. Ces cookies ne collectent aucune donnée personnelle à des fins publicitaires.
                  </p>
                </section>

                <section className="mb-8">
                  <h2 className="text-2xl font-bold mb-4 text-foreground">Contact</h2>
                  <p className="text-muted-foreground">
                    Pour toute question relative aux présentes mentions légales, vous pouvez nous contacter :<br />
                    Email : Inocent.koffi@agricapital.ci<br />
                    Téléphone : 07 59 56 60 87
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
