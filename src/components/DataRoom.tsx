import { motion } from "framer-motion";
import { Lock, FileText, ShieldCheck, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const DataRoom = () => {
  return (
    <section className="relative py-24 overflow-hidden bg-gradient-to-br from-primary via-primary to-primary/90">
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,hsl(var(--accent))_0%,transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_70%,hsl(var(--accent))_0%,transparent_50%)]" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-5xl mx-auto"
        >
          <div className="rounded-3xl bg-background/5 backdrop-blur-md border border-accent/30 p-8 md:p-14 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.5)]">
            <div className="flex flex-col md:flex-row items-start gap-8">
              <div className="shrink-0 h-16 w-16 rounded-2xl bg-gradient-to-br from-accent to-accent/70 flex items-center justify-center shadow-lg">
                <Lock className="h-8 w-8 text-primary" />
              </div>

              <div className="flex-1 space-y-6">
                <div>
                  <span className="inline-flex items-center gap-2 text-xs font-semibold tracking-[0.2em] uppercase text-accent mb-4">
                    <ShieldCheck className="h-3.5 w-3.5" />
                    Accès sécurisé · NDA numérique
                  </span>
                  <h2 className="text-3xl md:text-5xl font-bold text-primary-foreground leading-tight">
                    AgriCapital Cloud
                    <span className="block text-accent text-2xl md:text-3xl font-medium mt-2">
                      Espace Documentaire Confidentiel
                    </span>
                  </h2>
                </div>

                <p className="text-lg text-primary-foreground/80 leading-relaxed max-w-3xl">
                  Accédez à nos documents stratégiques, présentations et données de manière
                  sécurisée. Signature NDA numérique requise.
                </p>

                <div className="grid sm:grid-cols-3 gap-4 py-2">
                  {[
                    { icon: FileText, label: "Documents stratégiques" },
                    { icon: ShieldCheck, label: "Signature NDA" },
                    { icon: Lock, label: "Accès contrôlé" },
                  ].map((item, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-3 rounded-xl bg-primary-foreground/5 border border-primary-foreground/10 px-4 py-3"
                    >
                      <item.icon className="h-4 w-4 text-accent shrink-0" />
                      <span className="text-sm text-primary-foreground/90 font-medium">
                        {item.label}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="pt-2">
                  <Button
                    asChild
                    size="lg"
                    className="bg-accent hover:bg-accent/90 text-primary font-semibold shadow-[0_10px_30px_-8px_hsl(var(--accent)/0.6)] hover:shadow-[0_15px_40px_-8px_hsl(var(--accent)/0.7)] transition-all"
                  >
                    <a
                      href="https://agricapital.ci/dataroom/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2"
                    >
                      Accéder au portail
                      <ArrowUpRight className="h-4 w-4" />
                    </a>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default DataRoom;