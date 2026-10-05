import { Link } from "react-router-dom";
import { Users, ShieldCheck, Briefcase, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/hooks/useLanguage";

const content = {
  fr: {
    badge: "Équipe AgriCapital",
    title: "Un écosystème d'expertise pour sécuriser votre projet",
    description:
      "AgriCapital s'appuie sur une direction engagée, des experts techniques et des partenaires stratégiques pour structurer, sécuriser et exécuter chaque projet agricole avec rigueur.",
    points: ["Leadership terrain", "Encadrement technique", "Partenaires juridiques & stratégiques"],
    cta: "Découvrir l'équipe"
  },
  en: {
    badge: "AgriCapital Team",
    title: "An ecosystem of expertise to secure your project",
    description:
      "AgriCapital relies on committed leadership, technical experts and strategic partners to structure, secure and execute each agricultural project with rigor.",
    points: ["Field leadership", "Technical supervision", "Legal & strategic partners"],
    cta: "Meet the team"
  },
  es: {
    badge: "Equipo AgriCapital",
    title: "Un ecosistema de expertos para asegurar su proyecto",
    description:
      "AgriCapital se apoya en un liderazgo comprometido, expertos técnicos y socios estratégicos para estructurar, asegurar y ejecutar cada proyecto agrícola con rigor.",
    points: ["Liderazgo de campo", "Supervisión técnica", "Socios jurídicos y estratégicos"],
    cta: "Descubrir el equipo"
  },
  de: {
    badge: "AgriCapital-Team",
    title: "Ein Kompetenznetzwerk zur Absicherung Ihres Projekts",
    description:
      "AgriCapital stützt sich auf engagierte Führung, technische Experten und strategische Partner, um jedes landwirtschaftliche Projekt strukturiert, sicher und konsequent umzusetzen.",
    points: ["Praxisnahe Führung", "Technische Begleitung", "Juristische und strategische Partner"],
    cta: "Team entdecken"
  },
  zh: {
    badge: "AgriCapital 团队",
    title: "以专业生态保障您的农业项目",
    description:
      "AgriCapital 依托坚定的管理层、技术专家和战略伙伴，以严谨方式完成每个农业项目的规划、保障与执行。",
    points: ["一线领导力", "技术监督", "法律与战略伙伴"],
    cta: "了解团队"
  },
  ar: {
    badge: "فريق AgriCapital",
    title: "منظومة خبرات تطمئنك على مشروعك",
    description:
      "تعتمد AgriCapital على قيادة ملتزمة وخبراء تقنيين وشركاء استراتيجيين لهيكلة كل مشروع زراعي وتأمينه وتنفيذه باحترافية عالية.",
    points: ["قيادة ميدانية", "إشراف تقني", "شركاء قانونيون واستراتيجيون"],
    cta: "اكتشف الفريق"
  },
} as const;

const icons = [Users, ShieldCheck, Briefcase];

const TeamPreview = () => {
  const { language } = useLanguage();
  const copy = content[language] ?? content.fr;

  return (
    <section className="py-12 sm:py-16 bg-secondary/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto rounded-3xl border border-border/50 bg-card p-6 sm:p-8 lg:p-10 shadow-sm">
          <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
            <div>
              <Badge variant="outline" className="mb-4 border-accent text-accent">
                <Users className="mr-2 h-3.5 w-3.5" />
                {copy.badge}
              </Badge>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground max-w-2xl">
                {copy.title}
              </h2>
              <p className="mt-4 text-sm sm:text-base lg:text-lg text-muted-foreground max-w-2xl leading-relaxed">
                {copy.description}
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Button asChild className="bg-gradient-to-r from-primary to-primary/90">
                  <Link to="/agricapital#equipe">
                    {copy.cta}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>

            <div className="grid gap-3">
              {copy.points.map((point, index) => {
                const Icon = icons[index];
                return (
                  <div key={point} className="flex items-start gap-3 rounded-2xl border border-border/50 bg-background p-4">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">{point}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TeamPreview;