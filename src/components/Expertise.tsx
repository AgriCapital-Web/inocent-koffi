import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Video, PenTool, Bot, FileText, Lightbulb, GraduationCap, ArrowRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/hooks/useLanguage";
import { getExpertiseContent } from "@/lib/i18n/expertiseContent";

const icons = {
  video: Video,
  pen: PenTool,
  bot: Bot,
  file: FileText,
  lightbulb: Lightbulb,
  grad: GraduationCap,
} as const;

type Props = {
  /** true on the dedicated page: shows every detail. false on Home: compact preview. */
  full?: boolean;
};

const Expertise = ({ full = false }: Props) => {
  const { language } = useLanguage();
  const c = getExpertiseContent(language);

  return (
    <section id="expertises" className="relative py-14 sm:py-20 lg:py-28 overflow-hidden bg-background">
      {/* subtle premium backdrop */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            "radial-gradient(60% 50% at 12% 0%, hsl(var(--primary)) 0%, transparent 60%), radial-gradient(45% 45% at 95% 25%, hsl(var(--accent)) 0%, transparent 60%)",
        }}
      />

      <div className="container relative mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="max-w-3xl"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-card px-3 py-1 text-[11px] sm:text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            {c.badge}
          </span>
          <h2 className="mt-4 font-display text-2xl sm:text-3xl lg:text-5xl font-bold leading-tight text-foreground">
            {c.title}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">{c.titleAccent}</span>
          </h2>
          <p className="mt-5 text-sm sm:text-base lg:text-lg text-muted-foreground">{c.lead}</p>
          <p className="mt-3 text-sm sm:text-base text-muted-foreground/90">{c.lead2}</p>
        </motion.div>

        <div className="mt-10 sm:mt-14 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
          {c.blocks.map((block, i) => {
            const Icon = icons[block.icon];
            const groups = full ? block.groups : block.groups.map((g) => ({ ...g, items: g.items.slice(0, 4) }));
            return (
              <motion.article
                key={block.id}
                initial={{ opacity: 0, y: 32 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, delay: (i % 3) * 0.1 }}
                className="group relative flex h-full flex-col rounded-2xl border border-border/60 bg-card p-5 sm:p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-accent/50 hover:shadow-xl"
              >
                <div className="flex items-start gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent">
                    <Icon className="h-5 w-5 text-primary-foreground" aria-hidden />
                  </div>
                  <h3 className="pt-1 font-display text-base sm:text-lg font-bold text-foreground">
                    <span aria-hidden className="mr-1.5">{block.emoji}</span>
                    {block.title}
                  </h3>
                </div>

                {block.intro && (
                  <p className="mt-3 text-sm text-muted-foreground">{block.intro}</p>
                )}

                <div className="mt-4 space-y-4">
                  {groups.map((g, gi) => (
                    <div key={gi}>
                      {g.label && (
                        <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-primary">{g.label}</p>
                      )}
                      <ul className="space-y-1.5">
                        {g.items.map((item) => (
                          <li key={item} className="flex gap-2 text-sm text-foreground/80">
                            <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-accent" aria-hidden />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </motion.article>
            );
          })}
        </div>

        {/* End-to-end chain */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6 }}
          className="mt-12 sm:mt-16 rounded-2xl border border-border/60 bg-secondary/40 p-6 sm:p-8 lg:p-10"
        >
          <h3 className="font-display text-xl sm:text-2xl lg:text-3xl font-bold text-foreground">{c.chain.title}</h3>
          <p className="mt-3 max-w-3xl text-sm sm:text-base text-muted-foreground">{c.chain.lead}</p>
          <ol className="mt-6 flex flex-wrap items-center gap-2 sm:gap-2.5">
            {c.chain.steps.map((step, i) => (
              <li key={step} className="flex items-center gap-2">
                <span className="rounded-full border border-border bg-card px-3 py-1.5 text-xs sm:text-sm font-semibold text-foreground">
                  {step}
                </span>
                {i < c.chain.steps.length - 1 && (
                  <ArrowRight className="h-3.5 w-3.5 text-muted-foreground" aria-hidden />
                )}
              </li>
            ))}
          </ol>
          <p className="mt-6 max-w-3xl text-sm sm:text-base italic text-muted-foreground">{c.chain.note}</p>
        </motion.div>

        {/* What I can help with */}
        <div className="mt-12 sm:mt-16 grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          <div className="lg:col-span-2">
            <h3 className="font-display text-xl sm:text-2xl lg:text-3xl font-bold text-foreground">{c.help.title}</h3>
            <dl className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {c.help.pairs.map((p) => (
                <motion.div
                  key={p.q}
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 0.45 }}
                  className="rounded-xl border border-border/60 bg-card p-4 sm:p-5"
                >
                  <dt className="text-sm font-bold text-foreground">{p.q}</dt>
                  <dd className="mt-1.5 text-sm text-muted-foreground">{p.a}</dd>
                </motion.div>
              ))}
            </dl>
          </div>

          <aside className="rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/10 via-card to-accent/10 p-6 sm:p-8">
            <h3 className="font-display text-lg sm:text-xl font-bold text-foreground">{c.approach.title}</h3>
            <ul className="mt-4 space-y-3">
              {c.approach.lines.map((line) => (
                <li key={line} className="border-l-2 border-accent pl-3 text-sm sm:text-base font-medium text-foreground/90">
                  {line}
                </li>
              ))}
            </ul>
            <div className="mt-7 flex flex-col gap-3">
              <Button asChild size="lg" className="w-full">
                <Link to="/contact">{c.cta.primary}</Link>
              </Button>
              {!full && (
                <Button asChild variant="outline" size="lg" className="w-full">
                  <Link to="/expertises">
                    {c.cta.secondary}
                    <ArrowRight className="ml-1.5 h-4 w-4" aria-hidden />
                  </Link>
                </Button>
              )}
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
};

export default Expertise;
