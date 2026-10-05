import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Helmet } from "react-helmet-async";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { HelpCircle, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const categories = [
  {
    title: "Projets digitaux",
    faqs: [
      ["Quels types de projets développez-vous ?", "Sites web, e-commerce, applications, CRM, portails clients, dashboards, automatisations et produits numériques sur mesure."],
      ["Pouvez-vous reprendre un projet existant ?", "Oui. Je peux auditer l'existant, identifier les problèmes, corriger l'architecture et poursuivre le développement sans repartir inutilement de zéro."],
      ["Travaillez-vous avec l'intelligence artificielle ?", "Oui. L'IA peut être intégrée dans les contenus, assistants, automatisations, workflows et fonctionnalités produit selon le besoin réel."],
    ],
  },
  {
    title: "Création & média",
    faqs: [
      ["Proposez-vous de la vidéo et de la création assistée par IA ?", "Oui. Je travaille sur la conception de contenus vidéo, visuels, scénarios et productions assistées par IA."],
      ["Faites-vous aussi de l'audio et de la musique ?", "Oui. L'audio et la musique font partie de mon univers de création et peuvent être abordés comme projets ou contenus."],
    ],
  },
  {
    title: "Collaboration",
    faqs: [
      ["Comment démarre un projet ?", "On commence par clarifier le besoin, le public, les objectifs, les contraintes et le résultat attendu, puis je propose une trajectoire de réalisation."],
      ["Comment suivre un projet ?", "Le parcours peut être structuré en étapes avec livrables, échanges, validations et suivi dans les outils adaptés au projet."],
      ["AgriCapital fait-il partie de vos activités ?", "Oui. AgriCapital est une entreprise et une réalisation importante de mon parcours, mais ce site personnel présente un univers professionnel plus large. Pour les offres et informations officielles d'AgriCapital, utilisez son site officiel."],
    ],
  },
];

const FAQPage = () => {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: categories.flatMap((category) => category.faqs.map(([q, a]) => ({
      "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a },
    }))),
  };

  return (
    <>
      <Helmet>
        <title>FAQ | Inocent KOFFI</title>
        <meta name="description" content="Questions fréquentes sur les projets web, l'intelligence artificielle, la création de contenus et la collaboration avec Inocent KOFFI." />
        <link rel="canonical" href="https://ikoffi.agricapital.ci/faq" />
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      </Helmet>
      <div className="min-h-screen">
        <Navbar />
        <main className="pt-20">
          <section className="py-16 sm:py-24 bg-gradient-to-br from-background via-secondary/20 to-accent/10">
            <div className="container mx-auto w-full px-4 text-center">
              <HelpCircle className="mx-auto h-10 w-10 text-accent" />
              <p className="mt-5 text-xs font-semibold uppercase tracking-[0.18em] text-accent">FAQ</p>
              <h1 className="mt-3 text-4xl font-bold tracking-tight text-foreground sm:text-5xl">Vos questions, des réponses concrètes.</h1>
              <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-muted-foreground">Un aperçu du fonctionnement de mes projets, de mes expertises et de la manière de collaborer.</p>
            </div>
          </section>
          <section className="py-16 bg-background">
            <div className="container mx-auto w-full px-4">
              <div className="space-y-12">
                {categories.map((category) => (
                  <section key={category.title}>
                    <h2 className="mb-5 text-2xl font-bold text-foreground">{category.title}</h2>
                    <Accordion type="single" collapsible className="space-y-3">
                      {category.faqs.map(([q, a]) => (
                        <AccordionItem key={q} value={q} className="rounded-xl border border-border/60 bg-card px-5">
                          <AccordionTrigger className="text-left font-semibold">{q}</AccordionTrigger>
                          <AccordionContent className="leading-relaxed text-muted-foreground">{a}</AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  </section>
                ))}
              </div>
              <div className="mt-12 rounded-2xl border border-primary/20 bg-primary/5 p-6 sm:p-8">
                <p className="font-semibold text-foreground">Vous avez un besoin précis ?</p>
                <Link to="/contact" className="mt-4 inline-flex items-center text-sm font-semibold text-primary hover:underline">Parler d'un projet <ArrowRight className="ml-1.5 h-4 w-4" /></Link>
              </div>
            </div>
          </section>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default FAQPage;
