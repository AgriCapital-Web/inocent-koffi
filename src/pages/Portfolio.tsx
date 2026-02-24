import { Helmet } from "react-helmet-async";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ExternalLink, Code, Brain, Globe, BarChart3, GraduationCap, Shield, Smartphone, Layers } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const projects = [
  {
    name: "Scoly",
    url: "https://www.scoly.agricapital.ci",
    description: "Plateforme e-commerce scolaire & bureautique pour la Côte d'Ivoire. Catalogue complet, paiement Mobile Money (KkiaPay), livraison gratuite, module IA intégré.",
    tech: ["React 18", "TypeScript", "Supabase", "KkiaPay", "IA Gemini", "TipTap"],
    category: "E-commerce",
    icon: GraduationCap,
  },
  {
    name: "LegalForm CI",
    url: "https://www.legalform.ci",
    description: "Plateforme de création d'entreprises en ligne. SARL, EI, ONG, Association — démarches simplifiées avec suivi en temps réel et assistant juridique IA.",
    tech: ["React 18", "TypeScript", "Supabase", "KkiaPay", "IA GPT", "PDF Gen"],
    category: "LegalTech",
    icon: Shield,
  },
  {
    name: "IvoireProjet",
    url: "https://www.ivoireprojet.com",
    description: "Portail de projets et initiatives en Côte d'Ivoire. Vitrine pour porteurs de projets, associations et organisations communautaires.",
    tech: ["React", "TypeScript", "Supabase", "Tailwind CSS"],
    category: "Portail",
    icon: Globe,
  },
  {
    name: "AGRICAPITAL App",
    url: "https://www.app.agricapital.ci",
    description: "Application de gestion interne AGRICAPITAL. CRM agricole, suivi des producteurs, gestion des parcelles et reporting.",
    tech: ["React", "Supabase", "Dashboard", "Analytics"],
    category: "CRM / Gestion",
    icon: BarChart3,
  },
  {
    name: "AGRICAPITAL Pay",
    url: "https://www.pay.agricapital.ci",
    description: "Solution de paiement intégrée pour les opérations AGRICAPITAL. Transactions sécurisées et suivi financier.",
    tech: ["React", "KkiaPay", "Supabase", "Fintech"],
    category: "Fintech",
    icon: Smartphone,
  },
  {
    name: "IA Pour Tous",
    url: "https://www.iapourtous.vercel.app",
    description: "Plateforme de vulgarisation et d'accès à l'intelligence artificielle. Outils IA accessibles à tous, formations et démonstrations.",
    tech: ["React", "IA", "Vercel", "API OpenAI"],
    category: "Intelligence Artificielle",
    icon: Brain,
  },
  {
    name: "NANAN",
    url: "#",
    description: "L'Écosystème Numérique Africain Souverain — projet visionnaire. 8 sous-plateformes interconnectées : Chat, Social, Work, Pro, Tube, Pay, Mail, Learn.",
    tech: ["Vision", "Souveraineté numérique", "Architecture Full Stack"],
    category: "Projet Visionnaire",
    icon: Layers,
  },
];

const services = [
  { icon: Globe, title: "Sites Web & E-commerce", desc: "Boutiques en ligne, vitrines, marketplaces — conception sur mesure" },
  { icon: Code, title: "Applications & CRM", desc: "Outils métier sur mesure, gestion interne, automatisation" },
  { icon: Brain, title: "Intégration IA", desc: "Chatbots, génération de contenu, automatisation intelligente" },
  { icon: BarChart3, title: "Dashboards & Analytics", desc: "Tableaux de bord, rapports, suivi en temps réel" },
  { icon: GraduationCap, title: "Formation & Accompagnement", desc: "Initiation et prise en main de vos plateformes" },
];

const techStack = [
  "React 18", "TypeScript", "Vite", "Tailwind CSS", "Shadcn/ui", "Supabase", "PostgreSQL",
  "Edge Functions (Deno)", "KkiaPay", "Framer Motion", "TipTap", "React Query",
  "IA Gemini / GPT", "Node.js", "REST API", "Vercel", "PWA",
];

const Portfolio = () => {
  return (
    <>
      <Helmet>
        <title>Portfolio - Inocent KOFFI | Développeur Full Stack & IA</title>
        <meta name="description" content="Portfolio d'Inocent KOFFI — Développeur Full Stack, praticien IA. Découvrez mes projets : Scoly, LegalForm, AGRICAPITAL, IvoireProjet et plus." />
      </Helmet>

      <div className="min-h-screen">
        <Navbar />

        {/* Hero */}
        <section className="pt-24 pb-16 bg-gradient-to-br from-background via-secondary to-background">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-4xl">
            <span className="inline-block px-4 py-2 bg-accent/10 text-accent rounded-full text-sm font-semibold mb-6">
              <Code className="inline w-4 h-4 mr-2" />
              Développeur Full Stack & Praticien IA
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-6">
              Mes <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">Réalisations</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Conception et développement d'applications web, e-commerce, CRM et solutions IA
              pour des entreprises et organisations en Côte d'Ivoire et en Afrique.
            </p>
          </div>
        </section>

        {/* Projects Grid */}
        <section className="py-16 bg-background">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center mb-12 text-foreground">
              Projets <span className="text-accent">Réalisés</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
              {projects.map((project) => {
                const Icon = project.icon;
                return (
                  <div
                    key={project.name}
                    className="group relative bg-card border border-border rounded-2xl p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                        <Icon className="w-6 h-6 text-primary-foreground" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-foreground">{project.name}</h3>
                        <span className="text-xs font-medium text-accent">{project.category}</span>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mb-4 leading-relaxed">{project.description}</p>
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {project.tech.map((t) => (
                        <span key={t} className="px-2 py-0.5 bg-muted text-muted-foreground rounded text-xs">{t}</span>
                      ))}
                    </div>
                    {project.url !== "#" && (
                      <a
                        href={project.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:text-accent transition-colors"
                      >
                        Visiter <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}
                    {project.url === "#" && (
                      <span className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground">
                        🚀 En développement
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Services */}
        <section className="py-16 bg-secondary/30">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
            <h2 className="text-3xl font-bold text-center mb-12 text-foreground">
              Services <span className="text-accent">Proposés</span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map((s) => {
                const Icon = s.icon;
                return (
                  <div key={s.title} className="bg-card border border-border rounded-xl p-6 text-center hover:shadow-lg transition-shadow">
                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center mx-auto mb-4">
                      <Icon className="w-7 h-7 text-primary-foreground" />
                    </div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">{s.title}</h3>
                    <p className="text-sm text-muted-foreground">{s.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Tech Stack */}
        <section className="py-16 bg-background">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl text-center">
            <h2 className="text-3xl font-bold mb-8 text-foreground">
              Stack <span className="text-accent">Technique</span>
            </h2>
            <div className="flex flex-wrap justify-center gap-3">
              {techStack.map((tech) => (
                <span
                  key={tech}
                  className="px-4 py-2 bg-secondary border border-border rounded-full text-sm font-medium text-foreground hover:bg-accent/10 hover:border-accent transition-colors"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 bg-gradient-to-r from-primary to-primary/80">
          <div className="container mx-auto px-4 text-center max-w-3xl">
            <h2 className="text-3xl font-bold text-primary-foreground mb-4">Un projet en tête ?</h2>
            <p className="text-primary-foreground/80 mb-8 text-lg">
              Disponible pour tout projet local ou à distance — Daloa, Abidjan, Côte d'Ivoire et au-delà.
            </p>
            <Button size="lg" variant="secondary" asChild>
              <Link to="/contact">Me Contacter</Link>
            </Button>
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
};

export default Portfolio;
