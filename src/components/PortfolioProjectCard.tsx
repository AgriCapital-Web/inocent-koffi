import { ExternalLink, Globe, GraduationCap, LayoutDashboard, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { PortfolioProject } from "@/hooks/usePortfolioProjects";

export default function PortfolioProjectCard({ project }: { project: PortfolioProject; previewTick?: number }) {
  const textOnly = /scoly/i.test(project.title);
  const Icon = textOnly ? GraduationCap : project.category === "crm" ? LayoutDashboard : project.category === "applications" ? Smartphone : Globe;
  const image = textOnly ? null : project.image_url || project.fallback_image_url;
  return <article className="flex h-full min-w-0 flex-col overflow-hidden rounded-lg border border-border bg-card">
    {!textOnly && <div className="relative grid aspect-[16/9] place-items-center overflow-hidden bg-secondary"><Icon className="h-12 w-12 text-muted-foreground/40"/>{image && <img src={image} alt={project.title} className="absolute inset-0 h-full w-full object-contain" loading="lazy" decoding="async" onError={e => { e.currentTarget.hidden = true; }}/>}</div>}
    <div className="flex flex-1 flex-col p-6"><p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">{project.category === "crm" ? "Outil métier / CRM" : project.category === "applications" ? "Application web" : "Web & digital"}</p><h3 className="mt-3 text-xl font-bold">{project.title}</h3><p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">{project.description}</p>{project.technologies.length > 0 && <p className="mt-4 text-xs text-muted-foreground">{project.technologies.join(" · ")}</p>}{!textOnly && project.url && <Button asChild variant="link" className="mt-5 h-auto justify-start p-0"><a href={project.url} target="_blank" rel="noopener noreferrer">{project.category === "crm" ? "Ouvrir l’espace équipe" : "Découvrir le site"} <ExternalLink className="ml-2 h-4 w-4"/></a></Button>}</div>
  </article>;
}
