import { Code, ExternalLink, ArrowRight, Brain, Globe, BarChart3, GraduationCap, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const featuredProjects = [
  { name: "Scoly", url: "https://www.scoly.agricapital.ci", desc: "E-commerce scolaire & bureautique", icon: GraduationCap, category: "E-commerce" },
  { name: "LegalForm CI", url: "https://www.legalform.ci", desc: "Création d'entreprises en ligne", icon: Shield, category: "LegalTech" },
  { name: "IvoireProjet", url: "https://www.ivoireprojet.com", desc: "Portail de projets & initiatives", icon: Globe, category: "Portail" },
  { name: "AGRICAPITAL App", url: "https://www.app.agricapital.ci", desc: "CRM & gestion agricole", icon: BarChart3, category: "CRM" },
];

const PortfolioPreview = () => {
  return (
    <section className="py-16 bg-secondary/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
        <div className="text-center mb-12">
          <span className="inline-flex items-center gap-2 px-4 py-2 bg-accent/10 text-accent rounded-full text-sm font-semibold mb-4">
            <Code className="w-4 h-4" /> Développeur Full Stack & IA
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Projets <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">Réalisés</span>
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Applications web, e-commerce, CRM et solutions IA conçus et développés pour des entreprises en Côte d'Ivoire.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
          {featuredProjects.map((project) => {
            const Icon = project.icon;
            return (
              <a
                key={project.name}
                href={project.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group bg-card border border-border rounded-xl p-5 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 block"
              >
                <div className="w-11 h-11 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center mb-3">
                  <Icon className="w-5 h-5 text-primary-foreground" />
                </div>
                <h3 className="font-bold text-foreground mb-1 flex items-center gap-1.5">
                  {project.name}
                  <ExternalLink className="w-3.5 h-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                </h3>
                <span className="text-xs font-medium text-accent">{project.category}</span>
                <p className="text-sm text-muted-foreground mt-1">{project.desc}</p>
              </a>
            );
          })}
        </div>

        {/* Services résumé */}
        <div className="flex flex-wrap justify-center gap-3 mb-8">
          {["Sites Web & E-commerce", "Applications & CRM", "Intégration IA", "Dashboards", "Formation"].map(s => (
            <span key={s} className="px-3 py-1.5 bg-card border border-border rounded-full text-xs font-medium text-muted-foreground">
              {s}
            </span>
          ))}
        </div>

        <div className="text-center">
          <Button variant="default" asChild>
            <Link to="/portfolio">
              Voir tout le portfolio <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default PortfolioPreview;
