import { Code, ExternalLink, ArrowRight, Brain, Globe, BarChart3, GraduationCap, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const featuredProjects = [
  { name: "IvoireProjet", url: "https://www.ivoireprojet.com", desc: "Structuration & orientation de projets", icon: Globe, category: "Portail", screenshot: "/images/projects/ivoireprojet.png" },
  { name: "ASSOJEREB", url: "https://assojereb.ivoireprojet.com", desc: "Plateforme associative communautaire", icon: Globe, category: "Associatif", screenshot: "/images/projects/assojereb.png" },
  { name: "LegalForm CI", url: "https://www.legalform.ci", desc: "Création d'entreprises en ligne", icon: Shield, category: "LegalTech", screenshot: "/images/projects/legalform.png" },
  { name: "Scoly", desc: "E-commerce scolaire & bureautique", icon: GraduationCap, category: "E-commerce", screenshot: "/images/projects/scoly.png" },
  { name: "AGRICAPITAL App", url: "https://www.app.agricapital.ci", desc: "CRM & gestion agricole", icon: BarChart3, category: "CRM", screenshot: "/images/projects/agricapital-app.png" },
];

const PortfolioPreview = () => {
  return (
    <section className="py-16 bg-secondary/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 bg-accent/10 text-accent rounded-full text-sm font-semibold mb-4">
            <Code className="w-4 h-4" /> Développeur Full Stack & IA
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Projets <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">Réalisés</span>
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Applications web, e-commerce, CRM et solutions IA conçus et développés pour des entreprises en Côte d'Ivoire.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5 mb-10">
          {featuredProjects.map((project, index) => {
            const Icon = project.icon;
            const Wrapper = project.url ? 'a' : 'div';
            const wrapperProps = project.url ? { href: project.url, target: "_blank", rel: "noopener noreferrer" } : {};
            return (
              <motion.div
                key={project.name}
                className="group bg-card border border-border rounded-xl overflow-hidden hover:shadow-lg"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                whileHover={{ y: -6, scale: 1.02 }}
              >
                <Wrapper {...wrapperProps} className="block">
                  {project.screenshot && (
                    <div className="h-32 overflow-hidden">
                      <img 
                        src={project.screenshot} 
                        alt={project.name} 
                        className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-110" 
                        loading="lazy" 
                      />
                    </div>
                  )}
                  <div className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center flex-shrink-0">
                        <Icon className="w-4 h-4 text-primary-foreground" />
                      </div>
                      <div>
                        <h3 className="font-bold text-foreground text-sm flex items-center gap-1">
                          {project.name}
                          {project.url && <ExternalLink className="w-3 h-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />}
                        </h3>
                        <span className="text-xs font-medium text-accent">{project.category}</span>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground">{project.desc}</p>
                  </div>
                </Wrapper>
              </motion.div>
            );
          })}
        </div>

        <motion.div 
          className="flex flex-wrap justify-center gap-3 mb-8"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          {["Sites Web & E-commerce", "Applications & CRM", "Intégration IA", "Dashboards", "Formation"].map(s => (
            <span key={s} className="px-3 py-1.5 bg-card border border-border rounded-full text-xs font-medium text-muted-foreground">
              {s}
            </span>
          ))}
        </motion.div>

        <motion.div 
          className="text-center"
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.4 }}
        >
          <Button variant="default" asChild>
            <Link to="/portfolio">
              Voir tout le portfolio <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default PortfolioPreview;
