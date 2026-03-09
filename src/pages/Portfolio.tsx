import { Helmet } from "react-helmet-async";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ExternalLink, Code, Brain, Globe, BarChart3, GraduationCap, Shield, Smartphone, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const projects = [
  {
    name: "IvoireProjet",
    url: "https://www.ivoireprojet.com",
    description: "Plateforme panafricaine de structuration et d'orientation de projets. Structuration ISO 21500, label qualité MIPROJET, accompagnement de bout en bout.",
    tech: ["React", "TypeScript", "Supabase", "Tailwind CSS"],
    category: "Portail de Projets",
    icon: Globe,
    screenshot: "/images/projects/ivoireprojet.png",
    color: "from-emerald-600 to-emerald-800",
  },
  {
    name: "ASSOJEREB",
    url: "https://assojereb.ivoireprojet.com",
    description: "Plateforme communautaire de l'Association des Jeunes Ressortissants de Brongonzué. Gestion des membres, cotisations, actualités et espace membre intégré.",
    tech: ["React", "TypeScript", "Supabase", "Tailwind CSS"],
    category: "Plateforme Associative",
    icon: Users,
    screenshot: "/images/projects/assojereb.png",
    color: "from-cyan-600 to-teal-700",
  },
  {
    name: "LegalForm CI",
    url: "https://www.legalform.ci",
    description: "Plateforme de création d'entreprises en ligne. SARL, EI, ONG, Association — démarches simplifiées avec suivi en temps réel et assistant juridique IA.",
    tech: ["React 18", "TypeScript", "Supabase", "KkiaPay", "IA GPT", "PDF Gen"],
    category: "LegalTech",
    icon: Shield,
    screenshot: "/images/projects/legalform.png",
    color: "from-teal-600 to-teal-800",
  },
  {
    name: "Scoly",
    description: "Plateforme e-commerce scolaire & bureautique pour la Côte d'Ivoire. Catalogue complet, paiement Mobile Money (KkiaPay), livraison gratuite, module IA intégré.",
    tech: ["React 18", "TypeScript", "Supabase", "KkiaPay", "IA Gemini", "TipTap"],
    category: "E-commerce",
    icon: GraduationCap,
    screenshot: "/images/projects/scoly.png",
    color: "from-blue-600 to-indigo-800",
  },
  {
    name: "AGRICAPITAL App",
    url: "https://www.app.agricapital.ci",
    description: "Application de gestion interne AGRICAPITAL. CRM agricole, suivi des producteurs, gestion des parcelles et reporting avancé.",
    tech: ["React", "Supabase", "Dashboard", "Analytics"],
    category: "CRM / Gestion",
    icon: BarChart3,
    screenshot: "/images/projects/agricapital-app.png",
    color: "from-green-600 to-green-800",
  },
  {
    name: "IA Pour Tous",
    url: "https://www.iapourtous.vercel.app",
    description: "Plateforme de vulgarisation et d'accès à l'intelligence artificielle. Formations pratiques à partir de 500 FCFA/semaine. 11+ secteurs, 50+ modules.",
    tech: ["React", "IA", "Vercel", "API OpenAI"],
    category: "Intelligence Artificielle",
    icon: Brain,
    screenshot: "/images/projects/iapourtous.png",
    color: "from-indigo-700 to-purple-900",
  },
  {
    name: "AGRICAPITAL Pay",
    description: "Solution de paiement intégrée pour les opérations AGRICAPITAL. Transactions sécurisées et suivi financier.",
    tech: ["React", "KkiaPay", "Supabase", "Fintech"],
    category: "Fintech",
    icon: Smartphone,
    color: "from-amber-600 to-orange-700",
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

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const Portfolio = () => {
  return (
    <>
      <Helmet>
        <title>Portfolio - Inocent KOFFI | Développeur Web & Praticien IA</title>
        <meta name="description" content="Portfolio d'Inocent KOFFI — Visionnaire, Entrepreneur Social, Développeur Web, Praticien IA & Formateur. Découvrez mes projets : LegalForm, AGRICAPITAL, IvoireProjet, ASSOJEREB et plus." />
      </Helmet>

      <div className="min-h-screen">
        <Navbar />

        {/* Hero */}
        <section className="pt-24 pb-12 sm:pb-16 bg-gradient-to-br from-background via-secondary to-background">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-4xl">
            <motion.span 
              className="inline-block px-4 py-2 bg-accent/10 text-accent rounded-full text-xs sm:text-sm font-semibold mb-6"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <Code className="inline w-4 h-4 mr-2" />
              Visionnaire | Entrepreneur Social | Développeur Web | Praticien IA & Formateur
            </motion.span>
            <motion.h1 
              className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-foreground mb-4 sm:mb-6"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Mes <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">Réalisations</span>
            </motion.h1>
            <motion.p 
              className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              Visionnaire | Entrepreneur agricole, développeur web et praticien de l'intelligence artificielle, avec plus de 12 années d'immersion terrain
              en Côte d'Ivoire — au service du développement commercial, le recouvrement de créances, de l'agriculture, de l'innovation numérique et du développement local.
            </motion.p>
          </div>
        </section>

        {/* Projects Grid */}
        <section className="py-12 sm:py-16 bg-background">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.h2 
              className="text-2xl sm:text-3xl font-bold text-center mb-8 sm:mb-12 text-foreground"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              Projets <span className="text-accent">Réalisés</span>
            </motion.h2>
            <motion.div 
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 max-w-7xl mx-auto"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
            >
              {projects.map((project) => {
                const Icon = project.icon;
                return (
                  <motion.div
                    key={project.name}
                    variants={itemVariants}
                    whileHover={{ y: -8, scale: 1.02 }}
                    className="group relative bg-card border border-border rounded-2xl overflow-hidden hover:shadow-2xl transition-shadow duration-300"
                  >
                    {project.screenshot ? (
                      <div className="relative h-40 sm:h-48 overflow-hidden">
                        <img 
                          src={project.screenshot} 
                          alt={`${project.name} - Capture d'écran`}
                          className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-110"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-card via-card/20 to-transparent" />
                        <div className="absolute top-3 right-3">
                          <span className="px-3 py-1 bg-background/90 backdrop-blur-sm text-xs font-semibold text-accent rounded-full border border-border/50">
                            {project.category}
                          </span>
                        </div>
                      </div>
                    ) : (
                      <div className={`relative h-40 sm:h-48 bg-gradient-to-br ${project.color} flex items-center justify-center`}>
                        <Icon className="w-16 h-16 text-white/30" />
                        <div className="absolute top-3 right-3">
                          <span className="px-3 py-1 bg-white/20 backdrop-blur-sm text-xs font-semibold text-white rounded-full">
                            {project.category}
                          </span>
                        </div>
                      </div>
                    )}

                    <div className="p-4 sm:p-6">
                      <div className="flex items-center gap-3 mb-3">
                        <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${project.color} flex items-center justify-center flex-shrink-0`}>
                          <Icon className="w-5 h-5 text-white" />
                        </div>
                        <h3 className="text-lg font-bold text-foreground">{project.name}</h3>
                      </div>
                      
                      <p className="text-sm text-muted-foreground mb-4 leading-relaxed line-clamp-3">{project.description}</p>
                      
                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {project.tech.map((t) => (
                          <span key={t} className="px-2 py-0.5 bg-muted text-muted-foreground rounded text-xs font-medium">{t}</span>
                        ))}
                      </div>
                      
                      {project.url ? (
                        <a
                          href={project.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:text-accent transition-colors"
                        >
                          Visiter le site <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground">
                          Projet interne
                        </span>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          </div>
        </section>

        {/* Services */}
        <section className="py-12 sm:py-16 bg-secondary/30">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
            <motion.h2 
              className="text-2xl sm:text-3xl font-bold text-center mb-8 sm:mb-12 text-foreground"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              Services <span className="text-accent">Proposés</span>
            </motion.h2>
            <motion.div 
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              {services.map((s) => {
                const Icon = s.icon;
                return (
                  <motion.div 
                    key={s.title} 
                    variants={itemVariants}
                    whileHover={{ y: -4 }}
                    className="bg-card border border-border rounded-xl p-4 sm:p-6 text-center hover:shadow-lg transition-shadow"
                  >
                    <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center mx-auto mb-4">
                      <Icon className="w-6 h-6 sm:w-7 sm:h-7 text-primary-foreground" />
                    </div>
                    <h3 className="text-base sm:text-lg font-semibold text-foreground mb-2">{s.title}</h3>
                    <p className="text-sm text-muted-foreground">{s.desc}</p>
                  </motion.div>
                );
              })}
            </motion.div>
          </div>
        </section>

        {/* Tech Stack */}
        <section className="py-12 sm:py-16 bg-background">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl text-center">
            <motion.h2 
              className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 text-foreground"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
            >
              Stack <span className="text-accent">Technique</span>
            </motion.h2>
            <motion.div 
              className="flex flex-wrap justify-center gap-2 sm:gap-3"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              {techStack.map((tech, i) => (
                <motion.span
                  key={tech}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.03 }}
                  whileHover={{ scale: 1.1 }}
                  className="px-3 sm:px-4 py-1.5 sm:py-2 bg-secondary border border-border rounded-full text-xs sm:text-sm font-medium text-foreground hover:bg-accent/10 hover:border-accent transition-colors cursor-default"
                >
                  {tech}
                </motion.span>
              ))}
            </motion.div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-12 sm:py-16 bg-gradient-to-r from-primary to-primary/80">
          <motion.div 
            className="container mx-auto px-4 text-center max-w-3xl"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl sm:text-3xl font-bold text-primary-foreground mb-4">Un projet en tête ?</h2>
            <p className="text-primary-foreground/80 mb-6 sm:mb-8 text-base sm:text-lg">
              Disponible pour tout projet local ou à distance — Daloa, Abidjan, Côte d'Ivoire et au-delà.
            </p>
            <Button size="lg" variant="secondary" asChild>
              <Link to="/contact">Me Contacter</Link>
            </Button>
          </motion.div>
        </section>

        <Footer />
      </div>
    </>
  );
};

export default Portfolio;
