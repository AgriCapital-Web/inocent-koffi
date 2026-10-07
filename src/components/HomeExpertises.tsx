import { useEffect, useRef, useState } from "react";
import { Code2, Bot, Video, Music2, GraduationCap, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useLanguage } from "@/hooks/useLanguage";
import { EXPERTISE, pickHomeLang } from "@/lib/i18n/homeContent";

const icons = [Code2, Bot, Video, Music2, GraduationCap];

export default function HomeExpertises() {
  const { language } = useLanguage();
  const c = EXPERTISE[pickHomeLang(language)];
  const track = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  const goTo = (i: number) => {
    const el = track.current;
    const card = el?.children[i] as HTMLElement | undefined;
    if (el && card) el.scrollTo({ left: card.offsetLeft - el.offsetLeft, behavior: "smooth" });
  };

  useEffect(() => {
    if (paused) return;
    const id = window.setInterval(() => goTo((active + 1) % c.items.length), 4500);
    return () => window.clearInterval(id);
  }, [active, paused, c.items.length]);

  const onScroll = () => {
    const el = track.current;
    if (!el) return;
    const w = (el.children[0] as HTMLElement)?.offsetWidth || 1;
    setActive(Math.min(c.items.length - 1, Math.round(el.scrollLeft / w)));
  };

  return (
    <section className="bg-background py-16 sm:py-20 lg:py-24" aria-labelledby="home-expertises">
      <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end">
          <div className="max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">{c.kicker}</p>
            <h2 id="home-expertises" className="mt-3 font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">{c.title}</h2>
          </div>
          <div className="flex gap-2" role="tablist">
            {c.items.map((_, i) => (
              <button key={i} role="tab" aria-selected={active === i} aria-label={`${i + 1}`} onClick={() => goTo(i)} className={`h-2 rounded-full transition-all ${active === i ? "w-8 bg-accent" : "w-2 bg-border"}`} />
            ))}
          </div>
        </div>

        <div
          ref={track}
          onScroll={onScroll}
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onTouchStart={() => setPaused(true)}
          onFocus={() => setPaused(true)}
          className="mt-10 flex snap-x snap-mandatory gap-4 overflow-x-auto pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {c.items.map(([title, text], i) => {
            const Icon = icons[i];
            return (
              <article key={title} className={`flex w-[85%] shrink-0 snap-start flex-col rounded-2xl border p-6 transition-colors sm:w-[46%] lg:w-[31.5%] ${active === i ? "border-accent bg-card shadow-lg" : "border-border bg-card"}`}>
                <div className="flex items-center justify-between">
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary text-primary-foreground"><Icon className="h-5 w-5" aria-hidden /></span>
                  <span className="font-display text-sm font-bold text-muted-foreground">0{i + 1}</span>
                </div>
                <h3 className="mt-5 font-display text-lg font-bold text-foreground">{title}</h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">{text}</p>
                <Link to="/services" className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-primary hover:text-accent">
                  Services <ArrowRight className="h-4 w-4" aria-hidden />
                </Link>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
