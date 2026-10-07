// Textes de l'accueil et du menu. Baoulé (bci) et dioula (dyu) suivent le glossaire de référence (baouleGlossary.ts).
export type HomeLang = "fr" | "en" | "bci" | "dyu";

export const pickHomeLang = (l: string): HomeLang =>
  l === "en" || l === "bci" || l === "dyu" ? l : l === "fr" ? "fr" : "en";

export const NAV = {
  fr: { home: "Accueil", about: "À propos", services: "Services", work: "Réalisations", other: "Autres projets", news: "Actualités", contact: "Contact", cta: "Démarrer un projet" },
  en: { home: "Home", about: "About", services: "Services", work: "Work", other: "Other projects", news: "News", contact: "Contact", cta: "Start a project" },
  bci: { home: "Sua", about: "Min wun ndɛ", services: "Junman mun", work: "Junman nga n yoli", other: "Junman uflɛ mun", news: "Ndɛ uflɛ", contact: "Fa ndɛ man min", cta: "Bo junman kun ase" },
  dyu: { home: "So", about: "N ko kuma", services: "Baara suguw", work: "Baara minnu kɛra", other: "Baara wɛrɛw", news: "Kibaru kuraw", contact: "An ka kuma", cta: "Baara dɔ daminɛ" },
} as const;

export const HERO = {
  fr: {
    kicker: "Site personnel · Daloa, Côte d'Ivoire",
    roles: "Entrepreneur digital · Développeur web · Praticien IA · Créateur de solutions",
    tagline: "Je transforme vos idées en solutions digitales, créatives et concrètes.",
    bio: "Fondateur et gérant d'AgriCapital SARL, je conçois des sites, des applications, des contenus vidéo et audio et des outils d'intelligence artificielle pour les entreprises, les porteurs de projet et les institutions. Mon approche : comprendre le besoin réel, puis livrer une solution utile, de l'idée à la mise en ligne.",
    primary: "Démarrer un projet", secondary: "Voir mes réalisations", services: "Services & tarifs",
  },
  en: {
    kicker: "Personal website · Daloa, Côte d'Ivoire",
    roles: "Digital entrepreneur · Web developer · AI practitioner · Solution creator",
    tagline: "I turn your ideas into digital, creative and concrete solutions.",
    bio: "Founder and managing director of AgriCapital SARL, I design websites, applications, video and audio content and artificial intelligence tools for companies, project owners and institutions. My approach: understand the real need, then deliver a useful solution, from idea to launch.",
    primary: "Start a project", secondary: "See my work", services: "Services & pricing",
  },
  bci: {
    kicker: "Min ɛntɛnɛti su lika · Daloa, Kɔtdivuaa",
    roles: "Junman bo difuɛ · Ɛntɛnɛti su junman yofuɛ · Masin akunndan (IA) · Yifuɛ",
    tagline: "Akunndan nga a lafi'n, n yo i junman ninnge kpa.",
    bio: "Min yɛ n bo AgriCapital SARL ase'n, yɛ min yɛ n kpɛnngbɛn i. N yo ɛntɛnɛti su lika, junman ninnge (aplikasiɔn), videyo nin anyinnyin, ɔ nin masin akunndan (IA) junman sran mun be liɛ. N ti a ndɛ'n su kpa, kɛkɛ n yo junman ng'ɔ ti kpa'n man wɔ.",
    primary: "Bo junman kun ase", secondary: "Nian junman nga n yoli", services: "Junman mun nin be sika",
  },
  dyu: {
    kicker: "N yɛrɛ ka ɛntɛrinɛti yɔrɔ · Daloa, Kodiwari",
    roles: "Baarada dabaga · Ɛntɛrinɛti baarakɛla · Masin hakili (IA) · Dabaga",
    tagline: "N b'i ka hakilinanw yɛlɛma ka kɛ baara nafamaw ye.",
    bio: "Ne de ye AgriCapital SARL sigi ani n ye a ɲɛmɔgɔ ye. N bɛ ɛntɛrinɛti yɔrɔw, baarakɛminɛnw (aplikasɔn), widewo ni kumakan baaraw ani masin hakili (IA) baarakɛminɛnw dilan jɛkuluw ni mɔgɔw ye. N bɛ i mago lajɛ fɔlɔ, o kɔ n bɛ baara nafama di i ma.",
    primary: "Baara dɔ daminɛ", secondary: "Baara minnu kɛra", services: "Baara suguw ni u sɔngɔ",
  },
} as const;

export const EXPERTISE = {
  fr: { kicker: "Mes expertises", title: "Cinq domaines, une seule exigence : des résultats concrets.", items: [
    ["Web & solutions digitales", "Sites vitrines, applications web, plateformes, CRM, outils métier et intégrations API."],
    ["IA & automatisation", "Assistants IA, automatisation des tâches, outils sur mesure et intégration de l'IA dans vos processus."],
    ["Vidéo & création digitale", "Publicités, vidéos avec voix off, synchronisation labiale et contenus pour les réseaux sociaux."],
    ["Audio & musique", "Jingles, voix off, créations sonores et chansons personnalisées assistées par IA."],
    ["Formation & accompagnement", "Formations pratiques au digital et à l'IA, et accompagnement de vos projets de bout en bout."],
  ] },
  en: { kicker: "My expertise", title: "Five fields, one standard: concrete results.", items: [
    ["Web & digital solutions", "Showcase websites, web apps, platforms, CRM, business tools and API integrations."],
    ["AI & automation", "AI assistants, task automation, custom tools and AI integrated into your processes."],
    ["Video & digital creation", "Ads, voice-over videos, lip sync and social media content."],
    ["Audio & music", "Jingles, voice-overs, sound design and AI-assisted custom songs."],
    ["Training & support", "Hands-on digital and AI training, and end-to-end project support."],
  ] },
  bci: { kicker: "Junman nga n si yo'n", title: "Junman nnun, like kunngba : junman ng'ɔ ti kpa.", items: [
    ["Ɛntɛnɛti su lika nin junman ninnge", "Ɛntɛnɛti su lika, aplikasiɔn, junman lika dan, CRM nin API."],
    ["Masin akunndan (IA)", "IA ng'ɔ uka wɔ'n, junman ng'ɔ yo i liɛ, ɔ nin junman ninnge uflɛ."],
    ["Videyo nin yifuɛ junman", "Videyo mun, ndɛ ng'ɔ su videyo'n, ɔ nin ɛntɛnɛti su lika mun be liɛ."],
    ["Anyinnyin nin jue", "Jue kanngan, ndɛ, anyinnyin, ɔ nin jue ng'ɔ ti wɔ ngunmin wɔ liɛ'n."],
    ["Klɛnklɛn nin ukalɛ", "N klɛn sran mun ɛntɛnɛti nin IA, yɛ n uka be junman'n i bo lɛ'n."],
  ] },
  dyu: { kicker: "Ne ka baara suguw", title: "Baara suguya duuru, laɲini kelen : baara nafama.", items: [
    ["Ɛntɛrinɛti yɔrɔw ni baarakɛminɛnw", "Ɛntɛrinɛti yɔrɔw, aplikasɔnw, baara dingiraw, CRM ani API."],
    ["Masin hakili (IA)", "IA dɛmɛbagaw, baara min bɛ kɛ a yɛrɛ ma, ani baarakɛminɛn kuraw."],
    ["Widewo ni dabali", "Kɔnɔnaw, widewo ni kumakan, ani ɛntɛrinɛti jɛkuluw ka widewow."],
    ["Kumakan ni donkili", "Jingeliw, kumakan, mankanw ani i yɛrɛ ka donkiliw."],
    ["Kalan ni dɛmɛ", "Ɛntɛrinɛti ni IA kalanw, ani i ka baara dɛmɛ a daminɛ fo a laban."],
  ] },
} as const;
