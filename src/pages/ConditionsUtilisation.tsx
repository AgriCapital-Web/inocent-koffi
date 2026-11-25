import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Helmet } from "react-helmet-async";

const ConditionsUtilisation = () => (
  <>
    <Helmet>
      <title>Conditions d’utilisation | Inocent KOFFI</title>
      <meta name="description" content="Conditions générales d’utilisation du site personnel d’Inocent KOFFI." />
      <link rel="canonical" href="https://www.ikoffi.agricapital.ci/conditions-utilisation" />
    </Helmet>
    <div className="min-h-screen">
      <Navbar />
      <main className="pt-20">
        <section className="py-16 bg-background">
          <article className="container mx-auto max-w-4xl px-4 prose prose-lg">
            <h1>Conditions générales d’utilisation</h1>
            <p><strong>Dernière mise à jour : 25 novembre 2026</strong></p>
            <h2>Objet</h2>
            <p>Les présentes conditions encadrent l’accès et l’utilisation du site personnel d’Inocent KOFFI. Elles ne régissent pas les applications métier, les espaces clients ni les prestations contractuelles d’AgriCapital SARL.</p>
            <h2>Informations publiées</h2>
            <p>Les contenus présentent un parcours, des projets, des réalisations et des informations générales. Ils ne constituent pas une offre contractuelle, une promesse de rendement ni un conseil juridique, fiscal ou financier. Les engagements relatifs à une prestation ou à une souscription sont définis dans les documents contractuels propres à cette opération.</p>
            <h2>Usage du site</h2>
            <p>L’utilisateur s’engage à ne pas perturber le fonctionnement du site, contourner ses protections, tenter d’accéder à des données qui ne lui sont pas destinées ou transmettre des contenus illicites ou malveillants.</p>
            <h2>Propriété intellectuelle</h2>
            <p>Les textes, photographies, vidéos, marques et autres éléments publiés sont protégés. Toute reproduction substantielle nécessite l’autorisation préalable du titulaire des droits, sauf exception légale.</p>
            <h2>Liens externes et disponibilité</h2>
            <p>Le site peut renvoyer vers des services tiers indépendants. Leur contenu et leur disponibilité ne sont pas contrôlés par l’éditeur. Le site est fourni sans garantie de disponibilité permanente ni d’absence d’erreurs.</p>
            <h2>Contact</h2>
            <p>Pour toute question : <a href="mailto:inocent.koffi@agricapital.ci">inocent.koffi@agricapital.ci</a>.</p>
            <p><a href="/mentions-legales#confidentialite">Consulter les informations relatives aux données personnelles</a>.</p>
          </article>
        </section>
      </main>
      <Footer />
    </div>
  </>
);

export default ConditionsUtilisation;
