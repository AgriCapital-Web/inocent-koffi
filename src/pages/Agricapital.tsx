import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Helmet } from "react-helmet-async";
import { ExternalLink, ArrowRight, Sprout, LandPlot, ShieldCheck, Leaf, MapPin, Target } from "lucide-react";
import { Button } from "@/components/ui/button";

const offers = [
  {
    name: "PalmInvest",
    eyebrow: "Sans foncier",
    description: "Une solution pour investir dans une plantation de palmier à huile sans posséder de terrain : AgriCapital structure le foncier et le développement de la plantation.",
    points: ["Foncier sécurisé", "Plantation clé en main", "Accompagnement jusqu'à la mise en production"],
    icon: Sprout,
  },
  {
    name: "TerraPalm",
    eyebrow: "Avec foncier",
    description: "Une solution pour les propriétaires fonciers qui souhaitent transformer leur terre en actif agricole productif avec un accompagnement technique et opérationnel.",
    points: ["Le foncier reste au propriétaire", "Mise en valeur de la parcelle", "Suivi agronomique et opérationnel"],
    icon: LandPlot,
  },
  {
    name: "PalmTerroir Essentielle",
    eyebrow: "Accès progressif",
    description: "Une formule pensée pour faciliter l'accès progressif à un projet de plantation de palmier à huile avec un engagement initial puis un paiement mensuel.",
    points: ["Paiement initial : 230 000 FCFA", "3 500 FCFA par mois pendant 36 mois", "Projet structuré et suivi par AgriCapital"],
    icon: ShieldCheck,
  },
];

const Agricapital = () => (
  <>
    <Helmet>
      <title>AgriCapital | Réalisation d'Inocent KOFFI</title>
      <meta
        name="description"
        content="AgriCapital, entreprise agricole fondée par Inocent KOFFI : structuration, création et accompagnement de projets de plantations de palmier à huile en Côte d'Ivoire."
      />
      <link rel="canonical" href="https://ikoffi.agricapital.ci/agricapital" />
    </Helmet>

    <div className="min-h-screen">
      <Navbar />
      <main className="agri-page pt-20">
        <section className="agri-hero">
          <img
            src="/images/agricapital/patrimoine-agricole.webp"
            alt="AgriCapital — patrimoine agricole et plantation de palmier à huile"
            className="agri-hero-image"
            loading="eager"
            fetchPriority="high"
          />
          <div className="agri-hero-overlay" />
          <div className="agri-hero-content site-container">
            <span className="agri-kicker">Réalisation · Agriculture · AgriCapital</span>
            <h1>Investir la terre. Cultiver l'avenir.</h1>
            <p>
              AgriCapital est une entreprise agricole fondée et développée autour d'une ambition simple :
              transformer la terre en projets agricoles structurés, lisibles et suivis dans le temps.
            </p>
            <div className="agri-hero-actions">
              <Button asChild size="lg">
                <a href="https://www.agricapital.ci" target="_blank" rel="noopener noreferrer">
                  Découvrir AgriCapital <ExternalLink className="ml-2 h-4 w-4" />
                </a>
              </Button>
              <a href="#projet" className="agri-scroll-link">Découvrir le projet <ArrowRight className="h-4 w-4" /></a>
            </div>
          </div>
        </section>

        <section id="projet" className="agri-section agri-section-intro">
          <div className="site-container">
            <div className="agri-section-heading">
              <span>Une vision agricole concrète</span>
              <h2>Donner à la terre une vocation patrimoniale et productive.</h2>
              <p>
                AgriCapital s'inscrit dans une approche où le foncier, la plantation et l'accompagnement
                opérationnel sont pensés comme les composantes d'un même projet. L'objectif est de proposer
                une organisation plus claire entre la propriété de la terre, sa mise en valeur et le suivi
                du projet agricole.
              </p>
            </div>

            <div className="agri-pillars">
              <article><Leaf /><div><strong>Terre</strong><span>Structurer et valoriser le foncier agricole.</span></div></article>
              <article><Target /><div><strong>Plantation</strong><span>Transformer une parcelle en projet agricole organisé.</span></div></article>
              <article><MapPin /><div><strong>Terrain</strong><span>Relier la vision patrimoniale à l'exécution opérationnelle.</span></div></article>
            </div>
          </div>
        </section>

        <section className="agri-story agri-story-dark">
          <div className="agri-story-media">
            <img
              src="/images/agricapital/planteur-palmterroir.webp"
              alt="Planteur au milieu d'une plantation de palmier à huile"
              loading="lazy"
            />
          </div>
          <div className="agri-story-copy">
            <span className="agri-kicker">Le terrain au centre</span>
            <h2>Une agriculture qui commence par la réalité de la parcelle.</h2>
            <p>
              Un projet agricole ne se résume pas à une promesse ou à un document commercial.
              Il prend forme sur le terrain : observation de la parcelle, organisation des opérations,
              mise en place de la plantation et suivi de son évolution.
            </p>
            <p>
              Cette logique guide AgriCapital : créer une continuité entre la décision d'investir,
              la terre mobilisée et les étapes concrètes nécessaires à la construction d'un actif agricole.
            </p>
          </div>
        </section>

        <section className="agri-section agri-section-light">
          <div className="site-container">
            <div className="agri-editorial-grid">
              <div className="agri-editorial-copy">
                <span className="agri-kicker agri-kicker-green">Une identité sur le terrain</span>
                <h2>Construire une marque agricole visible, identifiable et proche des opérations.</h2>
                <p>
                  La présence d'AgriCapital sur le terrain traduit aussi une volonté de rendre le projet
                  plus concret. Signalétique, communication et présence des équipes participent à une même
                  démarche : faire comprendre qu'un investissement agricole doit pouvoir être relié à des
                  lieux, à des opérations et à une organisation.
                </p>
                <div className="agri-note">
                  <strong>Investir la terre. Cultiver l'avenir.</strong>
                  <span>Une signature qui relie patrimoine, agriculture et exécution.</span>
                </div>
              </div>
              <figure className="agri-editorial-media">
                <img
                  src="/images/agricapital/enseigne-mural-agricapital.webp"
                  alt="Enseigne murale AgriCapital sur le terrain"
                  loading="lazy"
                />
                <figcaption>Une identité visuelle pensée pour accompagner la présence d'AgriCapital sur le terrain.</figcaption>
              </figure>
            </div>
          </div>
        </section>

        <section className="agri-section agri-section-soft">
          <div className="site-container">
            <div className="agri-section-heading agri-heading-centered">
              <span>Le modèle</span>
              <h2>Trois façons d'entrer dans le projet agricole</h2>
              <p>
                Les offres permettent d'aborder le projet selon la situation de l'investisseur :
                avec ou sans foncier, ou par une formule d'accès progressif.
              </p>
            </div>

            <div className="agri-offers">
              {offers.map((offer) => {
                const Icon = offer.icon;
                return (
                  <article key={offer.name} className="agri-offer-card">
                    <div className="agri-offer-icon"><Icon className="h-6 w-6" /></div>
                    <p className="agri-offer-eyebrow">{offer.eyebrow}</p>
                    <h3>{offer.name}</h3>
                    <p className="agri-offer-description">{offer.description}</p>
                    <ul>
                      {offer.points.map((point) => <li key={point}>{point}</li>)}
                    </ul>
                    <a href="https://www.agricapital.ci" target="_blank" rel="noopener noreferrer">
                      Voir l'offre officielle <ExternalLink className="h-4 w-4" />
                    </a>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        <section className="agri-closing">
          <div className="site-container">
            <div>
              <span className="agri-kicker">AgriCapital</span>
              <h2>Une vision qui prend racine sur le terrain.</h2>
              <p>
                Cette page présente AgriCapital dans le parcours entrepreneurial d'Inocent KOFFI.
                Pour les informations officielles, les conditions contractuelles, les actualités et les démarches,
                consultez directement le site d'AgriCapital.
              </p>
            </div>
            <Button asChild size="lg">
              <a href="https://www.agricapital.ci" target="_blank" rel="noopener noreferrer">
                Accéder au site officiel <ExternalLink className="ml-2 h-4 w-4" />
              </a>
            </Button>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  </>
);

export default Agricapital;
