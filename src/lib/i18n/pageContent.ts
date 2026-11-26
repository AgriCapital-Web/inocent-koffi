// En-têtes des pages Services, Réalisations et Actualités. Baoulé (bci) et dioula (dyu) reprennent les termes du glossaire (baouleGlossary.ts) et du menu ; relecture par un locuteur recommandée.
import { pickHomeLang } from "./homeContent";

export const PAGES = {
  fr: {
    services: { kicker: "Services & tarifs", title: "Une idée. Un produit.", accent: "En ligne.", lead: "Sites web, applications, IA, vidéo, audio et formation : des solutions adaptées à votre projet.", order: "Démarrer une commande", work: "Voir les réalisations" },
    work: { kicker: "Réalisations", title: "Mes", accent: "réalisations", lead: "Des plateformes, applications, sites et solutions numériques conçus pour des entreprises, organisations et projets africains." },
    news: { read: "Lire le reportage", empty: "Aucune publication pour le moment.", title: "Actualités" },
  },
  en: {
    services: { kicker: "Services & pricing", title: "One idea. One product.", accent: "Online.", lead: "Websites, apps, AI, video, audio and training: solutions tailored to your project.", order: "Start an order", work: "See my work" },
    work: { kicker: "Work", title: "My", accent: "work", lead: "Platforms, apps, websites and digital solutions built for African companies, organisations and projects." },
    news: { read: "Read the story", empty: "No posts yet.", title: "News" },
  },
  bci: {
    services: { kicker: "Junman mun nin i sika", title: "Akunndan kun. Junman kun.", accent: "Ɛntɛnɛti su.", lead: "Ɛntɛnɛti su lika, aplikasiɔn, IA, video, ndɛ nin jɔlɛ : junman nga ɔ fata wɔ akunndan’n.", order: "Bo junman kun ase", work: "Nian junman nga n yoli" },
    work: { kicker: "Junman nga n yoli", title: "", accent: "Junman nga n yoli", lead: "Ɛntɛnɛti su lika nin aplikasiɔn nga n yoli man Afrika fiɛ’n be nin junman kpli mun." },
    news: { read: "Kanngan ndɛ’n", empty: "Ndɛ fi nun ɔ.", title: "Ndɛ uflɛ" },
  },
  dyu: {
    services: { kicker: "Baara suguw ni u sɔngɔ", title: "Hakili kelen. Fɛn kelen.", accent: "Ɛntɛrinɛti kan.", lead: "Siti, aplikasiyɔn, IA, wideyo, kumakan ani kalan : baara minnu bɛ bɛn i ka porozɛ ma.", order: "Baara dɔ daminɛ", work: "Baara minnu kɛra" },
    work: { kicker: "Baara minnu kɛra", title: "N ka", accent: "baaraw", lead: "Siti, aplikasiyɔn ani fɛɛrɛ nimerikiw minnu dilanna Afiriki jɛkuluw ni baarakɛyɔrɔw ye." },
    news: { read: "A kalan", empty: "Kibaru si tɛ yen sisan.", title: "Kibaru kuraw" },
  },
} as const;

export const pagesFor = (language: string) => PAGES[pickHomeLang(language)];
