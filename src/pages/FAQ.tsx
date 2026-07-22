import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Helmet } from "react-helmet-async";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { HelpCircle, MessageCircle, Phone } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import TrustBlock from "@/components/TrustBlock";

const categories = [
  {
    title: "AGRICAPITAL & mission",
    faqs: [
      { q: "Qu'est-ce qu'AGRICAPITAL SARL ?", a: "AGRICAPITAL SARL est un opérateur et promoteur agricole ivoirien basé à Daloa, spécialisé dans la création de plantations de palmier à huile clé en main. Notre mission : offrir un patrimoine agricole durable, rentable et sécurisé sur 25 ans." },
      { q: "Qui est le Gérant d'AGRICAPITAL ?", a: "Inocent KOFFI est Gérant d'AGRICAPITAL SARL. Fort de 12+ ans d'expérience terrain avec les producteurs de Côte d'Ivoire, il porte la vision Agro-Impact : transformation agricole pour une Afrique prospère." },
      { q: "Où sont vos plantations ?", a: "Notre siège se trouve à Daloa, Haut-Sassandra. Nous exploitons 620 ha sécurisés dont 100+ ha en production active, avec une pépinière centrale de 88 660 plants certifiés CNRA." },
    ],
  },
  {
    title: "Offre plantation clé en main",
    faqs: [
      { q: "Que comprend l'offre clé en main ?", a: "Nous prenons en charge l'intégralité du cycle : sécurisation foncière (titres, ACD), défrichement, plantation à densité optimale (143 plants/ha), suivi agronomique CNRA/ANADER, entretien, récolte et commercialisation avec garantie d'écoulement 25 ans." },
      { q: "Quelle est la superficie minimale ?", a: "Nous accompagnons des projets à partir de 5 ha, avec des lots configurables jusqu'à plusieurs centaines d'hectares selon vos objectifs patrimoniaux." },
      { q: "Quel est le rendement attendu ?", a: "Le palmier à huile atteint sa maturité à 3-4 ans. En pleine production (année 7+), les rendements se situent entre 10-15 tonnes/ha de régimes, valorisés via nos contrats industriels." },
      { q: "Comment la garantie d'écoulement fonctionne-t-elle ?", a: "AGRICAPITAL signe pour vous des contrats d'achat long terme avec les industriels partenaires. Vos régimes sont automatiquement collectés et payés — pas de risque commercial." },
    ],
  },
  {
    title: "Sécurité, juridique & transparence",
    faqs: [
      { q: "Comment le foncier est-il sécurisé ?", a: "Chaque parcelle fait l'objet d'un accompagnement juridique complet (Legal Form, GESMA) : bornage, ACD, immatriculation. Vous recevez un dossier complet vérifiable." },
      { q: "Quels partenaires institutionnels ?", a: "Nous travaillons avec CNRA (recherche), ANADER (vulgarisation), Les Palmistes (industriel), Legal Form et GESMA (juridique), ainsi qu'avec les autorités coutumières et administratives locales." },
      { q: "Existe-t-il un portail de suivi ?", a: "Oui — client.agricapital.ci est notre Portail Client digital : suivi temps réel de votre plantation, documents officiels, historique des paiements, communication avec l'équipe." },
      { q: "AGRICAPITAL est-elle une société régulière ?", a: "AGRICAPITAL SARL est immatriculée au RCCM de Daloa, avec statuts publiés, gouvernance formalisée et comptabilité tenue par un cabinet agréé. Un Information Memorandum détaillé est disponible sur demande." },
    ],
  },
  {
    title: "Investissement & partenariat",
    faqs: [
      { q: "Comment devenir partenaire ou investisseur ?", a: "Contactez-nous via le formulaire de la page Partenariat ou par email à inocent.koffi@agricapital.ci. Nous accueillons investisseurs, partenaires techniques, institutionnels et distributeurs." },
      { q: "Quels sont les tickets d'entrée ?", a: "Les tickets démarrent selon la taille du lot souhaité. Un rendez-vous individuel permet de calibrer votre projet (patrimoine familial, diversification, structuration diaspora)." },
      { q: "Y a-t-il un accompagnement pour la diaspora ?", a: "Oui — nous avons structuré un parcours dédié diaspora avec visites virtuelles, procurations, reporting mensuel et interlocuteur unique." },
    ],
  },
];

const FAQPage = () => {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: categories.flatMap((c) => c.faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    }))),
  };

  return (
    <>
      <Helmet>
        <title>FAQ AgriCapital — Plantations palmier à huile clé en main | Inocent KOFFI</title>
        <meta name="description" content="Toutes les réponses sur AGRICAPITAL SARL : offre plantation clé en main, sécurisation foncière, rendements, garantie d'écoulement 25 ans, investissement et partenariat." />
        <link rel="canonical" href="https://inocent-koffi.lovable.app/faq" />
        <meta property="og:title" content="FAQ AgriCapital — Questions fréquentes" />
        <meta property="og:description" content="Rendements, sécurisation foncière, garantie d'écoulement, investissement : toutes les réponses AgriCapital." />
        <meta property="og:url" content="https://inocent-koffi.lovable.app/faq" />
        <meta property="og:type" content="website" />
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      </Helmet>
      <div className="min-h-screen">
        <Navbar />
        <main className="pt-20">
          <section className="py-16 sm:py-24 bg-gradient-to-br from-primary/10 via-background to-accent/10">
            <div className="container mx-auto px-4 max-w-4xl text-center">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <Badge variant="outline" className="mb-4"><HelpCircle className="w-3 h-3 mr-1" />FAQ AgriCapital</Badge>
                <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 tracking-tighter-2">
                  Vos questions, <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">nos réponses</span>
                </h1>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  Tout ce que vous devez savoir sur AGRICAPITAL SARL, notre offre plantation clé en main et notre modèle de patrimoine agricole sécurisé.
                </p>
              </motion.div>
            </div>
          </section>

          <section className="py-16 bg-background">
            <div className="container mx-auto px-4 max-w-4xl space-y-12">
              {categories.map((cat, ci) => (
                <div key={ci}>
                  <h2 className="font-display text-2xl sm:text-3xl font-bold mb-6 tracking-tight">{cat.title}</h2>
                  <Accordion type="single" collapsible className="space-y-3">
                    {cat.faqs.map((f, i) => (
                      <AccordionItem key={i} value={`${ci}-${i}`} className="bg-card rounded-xl border-2 border-border/50 px-6 hover:border-primary/30">
                        <AccordionTrigger className="text-left font-semibold py-5">{f.q}</AccordionTrigger>
                        <AccordionContent className="text-muted-foreground pb-5 leading-relaxed">{f.a}</AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </div>
              ))}
            </div>
          </section>

          <TrustBlock />

          <section className="py-16 bg-gradient-to-br from-primary/5 to-accent/5">
            <div className="container mx-auto px-4 max-w-3xl text-center">
              <h2 className="font-display text-3xl sm:text-4xl font-bold mb-4">Une question spécifique ?</h2>
              <p className="text-muted-foreground mb-8">Notre équipe répond sous 24-48h.</p>
              <div className="flex flex-wrap gap-3 justify-center">
                <Button asChild size="lg" className="bg-gradient-to-r from-primary to-accent">
                  <a href="https://wa.me/2250759566087" target="_blank" rel="noopener noreferrer"><MessageCircle className="mr-2 w-4 h-4" />WhatsApp</a>
                </Button>
                <Button asChild size="lg" variant="outline">
                  <a href="tel:+2250759566087"><Phone className="mr-2 w-4 h-4" />+225 07 59 56 60 87</a>
                </Button>
                <Button asChild size="lg" variant="outline">
                  <Link to="/contact">Formulaire de contact</Link>
                </Button>
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