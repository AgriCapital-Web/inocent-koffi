import { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Code2, Video, Music4, ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/hooks/useLanguage";

type Block = { num: string; title: string; text: string; tags: string[] };

const icons = [Code2, Video, Music4];

const copy: Record<string, { badge: string; title: string; lead: string; cta: string; blocks: Block[] }> = {
  fr: {
    badge: "Mes expertises",
    title: "Trois pôles, une seule promesse",
    lead: "Je transforme vos idées en solutions digitales, créatives et concrètes.",
    cta: "Découvrir mes services",
    blocks: [
      {
        num: "01",
        title: "Web & solutions digitales",
        text: "Sites vitrines, applications web, plateformes, CRM, outils métier et intégrations API.",
        tags: ["Sites web", "Applications", "Plateformes", "CRM", "API"],
      },
      {
        num: "02",
        title: "Vidéo & création IA",
        text: "Publicités, vidéos avec voix off, synchronisation labiale, vidéos personnalisées et contenus IA.",
        tags: ["Publicités", "Voix off", "Lip-sync", "Contenus IA"],
      },
      {
        num: "03",
        title: "Audio & musique",
        text: "Jingles, voix off, créations audio et chansons personnalisées assistées par IA.",
        tags: ["Jingles", "Voix off", "Chansons IA", "Mini-clips"],
      },
    ],
  },
  en: {
    badge: "My expertise",
    title: "Three pillars, one promise",
    lead: "I turn your ideas into digital, creative and concrete solutions.",
    cta: "Explore my services",
    blocks: [
      { num: "01", title: "Web & digital solutions", text: "Showcase sites, web apps, platforms, CRM, business tools and API integrations.", tags: ["Websites", "Apps", "Platforms", "CRM", "API"] },
      { num: "02", title: "Video & AI creation", text: "Ads, voice-over videos, lip-sync, custom videos and AI-generated content.", tags: ["Ads", "Voice-over", "Lip-sync", "AI content"] },
      { num: "03", title: "Audio & music", text: "Jingles, voice-overs, audio production and AI-assisted custom songs.", tags: ["Jingles", "Voice-over", "AI songs", "Mini clips"] },
    ],
  },
  es: {
    badge: "Mis especialidades",
    title: "Tres polos, una sola promesa",
    lead: "Convierto sus ideas en soluciones digitales, creativas y concretas.",
    cta: "Descubrir mis servicios",
    blocks: [
      { num: "01", title: "Web y soluciones digitales", text: "Sitios web, aplicaciones, plataformas, CRM, herramientas de negocio e integraciones API.", tags: ["Sitios web", "Aplicaciones", "Plataformas", "CRM", "API"] },
      { num: "02", title: "Vídeo y creación con IA", text: "Publicidad, vídeos con voz en off, sincronización labial, vídeos personalizados y contenidos IA.", tags: ["Publicidad", "Voz en off", "Lip-sync", "Contenidos IA"] },
      { num: "03", title: "Audio y música", text: "Jingles, voces en off, creaciones de audio y canciones personalizadas con IA.", tags: ["Jingles", "Voz en off", "Canciones IA", "Mini clips"] },
    ],
  },
  de: {
    badge: "Meine Expertise",
    title: "Drei Bereiche, ein Versprechen",
    lead: "Ich verwandle Ihre Ideen in digitale, kreative und konkrete Lösungen.",
    cta: "Meine Leistungen entdecken",
    blocks: [
      { num: "01", title: "Web & digitale Lösungen", text: "Websites, Web-Apps, Plattformen, CRM, Fachanwendungen und API-Integrationen.", tags: ["Websites", "Apps", "Plattformen", "CRM", "API"] },
      { num: "02", title: "Video & KI-Kreation", text: "Werbespots, Videos mit Voice-over, Lippensynchronisation, individuelle Videos und KI-Inhalte.", tags: ["Werbung", "Voice-over", "Lip-Sync", "KI-Inhalte"] },
      { num: "03", title: "Audio & Musik", text: "Jingles, Voice-overs, Audioproduktionen und KI-gestützte individuelle Songs.", tags: ["Jingles", "Voice-over", "KI-Songs", "Mini-Clips"] },
    ],
  },
  zh: {
    badge: "我的专长",
    title: "三大板块，一个承诺",
    lead: "我把您的想法变成数字化、创意且落地的解决方案。",
    cta: "了解我的服务",
    blocks: [
      { num: "01", title: "网站与数字解决方案", text: "展示型网站、网页应用、平台、CRM、业务工具与 API 集成。", tags: ["网站", "应用", "平台", "CRM", "API"] },
      { num: "02", title: "视频与 AI 创作", text: "广告、配音视频、唇形同步、定制视频与 AI 内容。", tags: ["广告", "配音", "唇形同步", "AI 内容"] },
      { num: "03", title: "音频与音乐", text: "宣传音效、配音、音频制作以及 AI 辅助定制歌曲。", tags: ["音效", "配音", "AI 歌曲", "短片"] },
    ],
  },
  ar: {
    badge: "خبراتي",
    title: "ثلاثة مجالات ووعد واحد",
    lead: "أحوّل أفكاركم إلى حلول رقمية وإبداعية وملموسة.",
    cta: "اكتشف خدماتي",
    blocks: [
      { num: "01", title: "الويب والحلول الرقمية", text: "مواقع تعريفية، تطبيقات ويب، منصات، أنظمة CRM، أدوات مهنية وتكامل واجهات API.", tags: ["مواقع", "تطبيقات", "منصات", "CRM", "API"] },
      { num: "02", title: "الفيديو والإبداع بالذكاء الاصطناعي", text: "إعلانات، فيديوهات بتعليق صوتي، مزامنة شفوية، فيديوهات مخصصة ومحتوى بالذكاء الاصطناعي.", tags: ["إعلانات", "تعليق صوتي", "مزامنة", "محتوى IA"] },
      { num: "03", title: "الصوت والموسيقى", text: "جينغل، تعليق صوتي، إنتاج صوتي وأغانٍ مخصصة بمساعدة الذكاء الاصطناعي.", tags: ["جينغل", "تعليق صوتي", "أغانٍ IA", "مقاطع"] },
    ],
  },
  bci: {
    badge: "Ninnge nga n si be yo",
    title: "Junman akpasua nsan, nda kunngba",
    lead: "N fa amun akunndan'n n kaci i ɛntɛnɛti su junman kpakpa mɔ be di junman sakpa.",
    cta: "Nian junman nga n yo be",
    blocks: [
      {
        num: "kun (01)",
        title: "Ɛntɛnɛti su junman nin ndɛ nuan wielɛ",
        text: "Ɛntɛnɛti su lika mun, aplikasiɔn mun, junman lika dandan, CRM, junman ninnge nin API bolɛ nun.",
        tags: ["Ɛntɛnɛti lika", "Aplikasiɔn", "Junman lika", "CRM", "API"],
      },
      {
        num: "nɲɔn (02)",
        title: "Video nin masin akunndan (IA) yilɛ",
        text: "Atɛ bolɛ video, video nga nɛn o su, nuan nin nɛn bolɛ likawlɛ, video nga be yo man sran kunngba, nin IA ninnge mun.",
        tags: ["Atɛ bolɛ", "Nɛn su", "Nuan bolɛ", "IA ninnge"],
      },
      {
        num: "nsan (03)",
        title: "Nɛn nin jue",
        text: "Jingle mun, nɛn kanlɛ, nɛn yilɛ nin jue nga IA uka su be yo man sran kunngba.",
        tags: ["Jingle", "Nɛn", "IA jue", "Video kanngan"],
      },
    ],
  },
  dyu: {
    badge: "N ka dɔnniyaw",
    title: "Baara yɔrɔ saba, layidu kelen",
    lead: "Ne bɛ i ka miiriyaw yɛlɛma ka kɛ ɛntɛrinɛti baara ɲuman ni fɛɛrɛ sɛbɛw ye.",
    cta: "N ka baaraw lajɛ",
    blocks: [
      {
        num: "kelen (01)",
        title: "Ɛntɛrinɛti ni baara fɛɛrɛw",
        text: "Ɛntɛrinɛti yɔrɔw, aplikasɔnw, baara dingiraw, CRM, baarakɛminɛnw ani API basigiliw.",
        tags: ["Siti web", "Aplikasɔn", "Dingira", "CRM", "API"],
      },
      {
        num: "fila (02)",
        title: "Wideyo ni IA dabaali",
        text: "Jagokan wideyow, wideyo ni kumakan, da lamaga bɛnkan, wideyo kɛrɛnkɛrɛnnenw ani IA fɛnw.",
        tags: ["Jagokan", "Kumakan", "Da lamaga", "IA fɛnw"],
      },
      {
        num: "saba (03)",
        title: "Kumakan ni dɔnkili",
        text: "Jingle, kumakan bilali, odiyo dilanni ani dɔnkili kɛrɛnkɛrɛnnenw IA dɛmɛ la.",
        tags: ["Jingle", "Kumakan", "IA dɔnkili", "Wideyo fitini"],
      },
    ],
  },
};

const ExpertiseCarousel = () => {
  const { language } = useLanguage();
  const c = copy[language] ?? copy.fr;
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: "start", dragFree: false });
  const [selected, setSelected] = useState(0);
  const [paused, setPaused] = useState(false);

  const onSelect = useCallback(() => {
    if (emblaApi) setSelected(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi, onSelect]);

  useEffect(() => {
    if (!emblaApi || paused) return;
    const id = window.setInterval(() => emblaApi.scrollNext(), 4500);
    return () => window.clearInterval(id);
  }, [emblaApi, paused]);

  return (
    <section
      id="expertises-carousel"
      className="relative py-14 sm:py-20 overflow-hidden bg-secondary/30"
      aria-labelledby="expertises-carousel-title"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            "radial-gradient(50% 50% at 10% 0%, hsl(var(--primary)) 0%, transparent 60%), radial-gradient(45% 45% at 90% 100%, hsl(var(--accent)) 0%, transparent 60%)",
        }}
      />
      <div className="container relative mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.55 }}
          className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"
        >
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-card px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              {c.badge}
            </span>
            <h2
              id="expertises-carousel-title"
              className="mt-4 font-display text-2xl sm:text-3xl lg:text-4xl font-bold leading-tight text-foreground"
            >
              {c.title}
            </h2>
            <p className="mt-3 text-sm sm:text-base text-muted-foreground">{c.lead}</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => emblaApi?.scrollPrev()}
              aria-label="Précédent"
              className="rounded-full border border-border bg-card p-2 text-foreground transition-colors hover:bg-muted focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            >
              <ChevronLeft className="h-4 w-4" aria-hidden />
            </button>
            <button
              type="button"
              onClick={() => emblaApi?.scrollNext()}
              aria-label="Suivant"
              className="rounded-full border border-border bg-card p-2 text-foreground transition-colors hover:bg-muted focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            >
              <ChevronRight className="h-4 w-4" aria-hidden />
            </button>
          </div>
        </motion.div>

        <div
          className="mt-8 sm:mt-10"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onFocus={() => setPaused(true)}
          onBlur={() => setPaused(false)}
          onTouchStart={() => setPaused(true)}
        >
          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex -ml-4">
              {c.blocks.map((block, i) => {
                const Icon = icons[i % icons.length];
                return (
                  <article
                    key={block.num}
                    className="min-w-0 shrink-0 grow-0 basis-full pl-4 sm:basis-1/2 xl:basis-1/3"
                  >
                    <div className="flex h-full flex-col rounded-2xl border border-border/60 bg-card p-6 sm:p-8 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-accent/50 hover:shadow-xl">
                      <div className="flex items-center justify-between">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent">
                          <Icon className="h-5 w-5 text-primary-foreground" aria-hidden />
                        </div>
                        <span className="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                          {block.num}
                        </span>
                      </div>
                      <h3 className="mt-5 font-display text-lg sm:text-xl font-bold text-foreground">
                        {block.title}
                      </h3>
                      <p className="mt-3 flex-1 text-sm sm:text-base text-muted-foreground">{block.text}</p>
                      <ul className="mt-5 flex flex-wrap gap-2">
                        {block.tags.map((tag) => (
                          <li
                            key={tag}
                            className="rounded-full border border-border bg-secondary/60 px-2.5 py-1 text-[11px] font-medium text-foreground/80"
                          >
                            {tag}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>

          <div className="mt-6 flex items-center justify-between gap-4">
            <div className="flex items-center gap-2" role="tablist" aria-label={c.badge}>
              {c.blocks.map((block, i) => (
                <button
                  key={block.num}
                  type="button"
                  role="tab"
                  aria-selected={selected === i}
                  aria-label={block.title}
                  onClick={() => emblaApi?.scrollTo(i)}
                  className={`h-1.5 rounded-full transition-all ${
                    selected === i ? "w-8 bg-primary" : "w-3 bg-border hover:bg-muted-foreground/40"
                  }`}
                />
              ))}
            </div>
            <Button asChild variant="outline" size="sm">
              <Link to="/services">
                {c.cta}
                <ArrowRight className="ml-1.5 h-4 w-4" aria-hidden />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ExpertiseCarousel;
