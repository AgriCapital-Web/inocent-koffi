import { motion } from "framer-motion";
import { MapPin, Users, Calendar, Sprout } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";

const StatsStrip = () => {
  const { language } = useLanguage();
  const labels = {
    fr: ["Régions parcourues", "Localités visitées", "Années d'expérience", "Modèle patrimonial"],
    en: ["Regions covered", "Localities visited", "Years of experience", "Heritage model"],
    es: ["Regiones recorridas", "Localidades visitadas", "Años de experiencia", "Modelo patrimonial"],
    de: ["Bereiste Regionen", "Besuchte Orte", "Jahre Erfahrung", "Vermögensmodell"],
    zh: ["走访地区", "走访地点", "年经验", "传承模式"],
    ar: ["مناطق مغطاة", "بلدات زُرناها", "سنوات خبرة", "نموذج إرثي"],
  }[language] || ["Régions parcourues", "Localités visitées", "Années d'expérience", "Modèle patrimonial"];

  const stats = [
    { icon: MapPin, value: "8", label: labels[0] },
    { icon: Users, value: "360+", label: labels[1] },
    { icon: Calendar, value: "12+", label: labels[2] },
    { icon: Sprout, value: "28 ans", label: labels[3] },
  ];

  return (
    <section
      aria-label="Chiffres clés"
      className="relative -mt-8 sm:-mt-10 z-10"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto rounded-2xl sm:rounded-3xl border border-border/60 bg-background/80 backdrop-blur-md shadow-[0_30px_80px_-30px_hsl(var(--ink)/0.35)] overflow-hidden">
          <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-y lg:divide-y-0 divide-border/60">
            {stats.map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.45, delay: i * 0.07 }}
                className="flex items-center gap-3 sm:gap-4 p-4 sm:p-6 lg:p-7"
              >
                <div className="shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-accent/20 to-primary/15 flex items-center justify-center ring-1 ring-accent/30">
                  <s.icon className="w-5 h-5 sm:w-6 sm:h-6 text-accent-foreground" />
                </div>
                <div className="min-w-0">
                  <div className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-foreground leading-none tracking-tight">
                    {s.value}
                  </div>
                  <div className="text-[11px] sm:text-xs uppercase tracking-[0.14em] text-muted-foreground mt-1.5 truncate">
                    {s.label}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default StatsStrip;