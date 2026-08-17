import type { Language } from "@/lib/i18n/translations";

export type ExpertiseBlock = {
  id: string;
  icon: "video" | "pen" | "bot" | "file" | "lightbulb" | "grad";
  emoji: string;
  title: string;
  intro?: string;
  groups: { label?: string; items: string[] }[];
};

export type ExpertiseContent = {
  badge: string;
  title: string;
  titleAccent: string;
  lead: string;
  lead2: string;
  blocks: ExpertiseBlock[];
  chain: { title: string; lead: string; steps: string[]; note: string };
  help: { title: string; pairs: { q: string; a: string }[] };
  approach: { title: string; lines: string[] };
  cta: { primary: string; secondary: string };
  seo: { title: string; description: string };
};

const fr: ExpertiseContent = {
  badge: "Mes expertises",
  title: "IA, création & transformation ",
  titleAccent: "digitale",
  lead: "Je mets l’intelligence artificielle, la créativité et mon expérience au service des idées, des projets, des entreprises et des créateurs.",
  lead2: "De l’idée initiale à la réalisation finale, j’accompagne la conception, la structuration, la création et la valorisation de contenus et de projets grâce aux outils numériques et à l’intelligence artificielle.",
  blocks: [
    {
      id: "audiovisuel",
      icon: "video",
      emoji: "🎬",
      title: "Audiovisuel & création vidéo",
      groups: [
        {
          label: "Création de contenus vidéo",
          items: [
            "Micro-documentaires",
            "Films courts",
            "Vidéos explicatives",
            "Films institutionnels",
            "Films publicitaires",
            "Publicités produits et services",
            "Vidéos de présentation d’entreprise",
            "Vidéos pour réseaux sociaux",
            "Capsules éducatives et professionnelles",
            "Storytelling vidéo",
          ],
        },
        {
          label: "Production vidéo assistée par IA",
          items: [
            "Génération de scènes et séquences vidéo avec l’IA",
            "Création de personnages et environnements",
            "Animation d’images",
            "Transformation et amélioration de contenus",
            "Montage vidéo assisté par IA",
            "Création de voix off et narration",
            "Synchronisation et adaptation des dialogues",
            "Création de contenus audiovisuels à partir d’une simple idée",
          ],
        },
      ],
    },
    {
      id: "scenario",
      icon: "pen",
      emoji: "✍🏾",
      title: "Scénario, conception & storytelling",
      intro: "Une bonne vidéo commence toujours par une bonne idée et une bonne structure.",
      groups: [
        {
          items: [
            "Recherche et développement d’idées",
            "Conception de concepts créatifs",
            "Écriture de scénarios",
            "Structuration de scénarios",
            "Découpage en scènes",
            "Écriture de dialogues",
            "Création de scripts publicitaires",
            "Storyboard et direction narrative",
            "Storytelling de marque",
            "Adaptation d’une idée en contenu audiovisuel",
            "Transformation d’un message complexe en contenu simple et compréhensible",
          ],
        },
      ],
    },
    {
      id: "ia-creative",
      icon: "bot",
      emoji: "🤖",
      title: "Intelligence artificielle créative",
      intro: "J’exploite l’IA pour accélérer, améliorer et transformer les processus de création.",
      groups: [
        {
          label: "Création visuelle",
          items: [
            "Génération d’images",
            "Création d’affiches et visuels",
            "Concepts graphiques",
            "Création de personnages",
            "Direction artistique assistée par IA",
            "Retouche et transformation d’images",
            "Création de visuels pour communication digitale",
          ],
        },
        {
          label: "Création audiovisuelle",
          items: [
            "Génération vidéo",
            "Montage assisté par IA",
            "Voix et narration",
            "Création de contenus multimédias",
            "Automatisation de certaines étapes de production",
          ],
        },
        {
          label: "IA & contenu",
          items: [
            "Rédaction assistée par IA",
            "Réécriture et amélioration de textes",
            "Création de contenus pour réseaux sociaux",
            "Synthèse et vulgarisation d’informations",
            "Création de documents professionnels",
            "Structuration de contenus complexes",
          ],
        },
      ],
    },
    {
      id: "documents",
      icon: "file",
      emoji: "📄",
      title: "Documents, structuration & productivité",
      intro: "L’IA ne sert pas uniquement à créer des images ou des vidéos. Je l’utilise également pour concevoir, structurer et améliorer des documents et processus professionnels.",
      groups: [
        {
          items: [
            "Présentations professionnelles",
            "Notes conceptuelles",
            "Propositions commerciales",
            "Plans de projets",
            "Documents stratégiques",
            "Cahiers des charges",
            "Procédures et guides",
            "Supports de formation",
            "Rapports et synthèses",
            "Structuration d’idées et de projets",
            "Organisation et transformation de contenus",
          ],
        },
      ],
    },
    {
      id: "ideation",
      icon: "lightbulb",
      emoji: "💡",
      title: "Idéation & structuration de projets",
      intro: "Une idée mal structurée reste souvent une idée. J’accompagne la transformation d’une idée en projet concret : Idée → Concept → Structuration → Contenu → Prototype → Présentation → Communication.",
      groups: [
        {
          label: "Cela peut concerner",
          items: [
            "Projets entrepreneuriaux",
            "Produits et services",
            "Campagnes de communication",
            "Concepts audiovisuels",
            "Projets digitaux",
            "Projets éducatifs",
            "Innovations utilisant l’IA",
          ],
        },
      ],
    },
    {
      id: "formation",
      icon: "grad",
      emoji: "🎓",
      title: "Formation & accompagnement IA",
      intro: "Je propose également un accompagnement permettant aux professionnels, entrepreneurs, étudiants, créateurs et organisations de mieux comprendre et utiliser l’intelligence artificielle.",
      groups: [
        {
          label: "Formations et accompagnements",
          items: [
            "Initiation à l’intelligence artificielle",
            "Utilisation pratique des outils IA",
            "IA pour la création de contenus",
            "IA pour la communication",
            "IA pour l’audiovisuel",
            "IA pour la productivité professionnelle",
            "Création de prompts efficaces",
            "Mise en place de workflows IA",
            "Accompagnement personnalisé",
            "Formation pratique basée sur des cas réels",
          ],
        },
      ],
    },
  ],
  chain: {
    title: "Une approche de bout en bout",
    lead: "Je ne me limite pas à utiliser des outils d’intelligence artificielle. J’interviens sur l’ensemble de la chaîne :",
    steps: ["Réfléchir", "Structurer", "Écrire", "Créer", "Produire", "Monter", "Optimiser", "Diffuser"],
    note: "Parce qu’avant de produire une belle image ou une belle vidéo, il faut d’abord avoir une idée claire, un message pertinent et une bonne structure.",
  },
  help: {
    title: "Ce que je peux vous aider à faire",
    pairs: [
      { q: "Vous avez une idée ?", a: "Je peux vous aider à la structurer." },
      { q: "Vous avez un produit ?", a: "Je peux vous aider à construire son concept de communication." },
      { q: "Vous avez un message à expliquer ?", a: "Je peux le transformer en contenu clair et audiovisuel." },
      { q: "Vous avez un scénario ?", a: "Je peux le structurer et le transformer en production." },
      { q: "Vous avez besoin d’une vidéo ?", a: "Je peux vous accompagner de l’écriture jusqu’au montage." },
      { q: "Vous souhaitez intégrer l’IA dans votre activité ?", a: "Je peux vous accompagner dans son appropriation et sa mise en pratique." },
    ],
  },
  approach: {
    title: "Mon approche",
    lines: ["L’IA comme outil.", "La créativité comme moteur.", "La stratégie comme direction.", "L’humain comme finalité."],
  },
  cta: { primary: "Discuter de votre projet", secondary: "Voir toutes mes expertises" },
  seo: {
    title: "Mes expertises — IA, création & transformation digitale | Inocent KOFFI",
    description: "Inocent KOFFI : audiovisuel, scénario, intelligence artificielle créative, documents professionnels, idéation et formation IA. De l’idée à la diffusion.",
  },
};

const en: ExpertiseContent = {
  ...fr,
  badge: "My expertise",
  title: "AI, creation & digital ",
  titleAccent: "transformation",
  lead: "I put artificial intelligence, creativity and my experience at the service of ideas, projects, companies and creators.",
  lead2: "From the initial idea to the final delivery, I support the design, structuring, creation and valuation of content and projects through digital tools and artificial intelligence.",
  chain: {
    title: "An end-to-end approach",
    lead: "I do not simply use AI tools. I work across the whole chain:",
    steps: ["Think", "Structure", "Write", "Create", "Produce", "Edit", "Optimise", "Distribute"],
    note: "Because before producing a beautiful image or video, you first need a clear idea, a relevant message and a solid structure.",
  },
  approach: {
    title: "My approach",
    lines: ["AI as a tool.", "Creativity as the engine.", "Strategy as the direction.", "People as the purpose."],
  },
  cta: { primary: "Discuss your project", secondary: "See all my expertise" },
  seo: {
    title: "My expertise — AI, creation & digital transformation | Inocent KOFFI",
    description: "Inocent KOFFI: video, scriptwriting, creative artificial intelligence, professional documents, ideation and AI training. From idea to distribution.",
  },
};

const bci: ExpertiseContent = {
  badge: "Ninnge nga n si be yo",
  title: "IA, yiyilɛ nin mɛn uflɛ ",
  titleAccent: "kacilɛ",
  lead: "N fa aleman ngwlɛlɛ (IA), ngwlɛlɛ nin junman nga n dili be fa uka akunndan mun, junman mun, kpɛnngbɛn mun nin yifuɛ mun.",
  lead2: "Kɛ akunndan'n ba i bo bolɛ nun lele fa ju i wielɛ su, n uka be naan be bo junman'n i su, be siesie i, be yo i, naan be yo i kpa, aleman ngwlɛlɛ nin mmoja nun ninnge mun be lika.",
  blocks: [
    {
      id: "audiovisuel",
      icon: "video",
      emoji: "🎬",
      title: "Desɛn nin nɛn — video yolɛ",
      groups: [
        {
          label: "Video yolɛ",
          items: [
            "Ndɛ kanwlɛ video kanngan",
            "Video kanngan",
            "Video nga be yiyi ninnge nun",
            "Kpɛnngbɛn mun be video",
            "Atɛ bolɛ video",
            "Ninnge nin junman be atɛ bolɛ",
            "Kpɛnngbɛn kle sran mun video",
            "Ɛntɛnɛti aɲia lika video",
            "Like klelɛ nin junman su video kanngan",
            "Ndɛ kanlɛ video nun",
          ],
        },
        {
          label: "Video yolɛ IA i lika",
          items: [
            "Video lika mun nin i bue mun yolɛ IA i lika",
            "Sran nin lika mun be yolɛ",
            "Desɛn mun be kejelɛ",
            "Ninnge kacilɛ naan be yo kpa",
            "Video siesielɛ IA i lika",
            "Nɛn nin ndɛ kanlɛ yolɛ",
            "Ndɛ mun be bo kunlɛ nɛn su",
            "Video yolɛ akunndan kunngba nun",
          ],
        },
      ],
    },
    {
      id: "scenario",
      icon: "pen",
      emoji: "✍🏾",
      title: "Ndɛ klɛlɛ, siesielɛ nin ndɛ kanlɛ",
      intro: "Video kpa'n i bo bo akunndan kpa nin siesielɛ kpa su titi.",
      groups: [
        {
          items: [
            "Akunndan kunlɛ nin i ɲrun kɔlɛ",
            "Akunndan uflɛuflɛ kpɛlɛ",
            "Video ndɛ klɛlɛ",
            "Ndɛ'n i siesielɛ kpa",
            "Ndɛ'n i bualɛ lika lika",
            "Ijɔlɛ ndɛ klɛlɛ",
            "Atɛ bolɛ ndɛ klɛlɛ",
            "Desɛn su ndɛ nin i ɲrun falɛ",
            "Dunman su ndɛ kanlɛ",
            "Akunndan kunngba kacilɛ video",
            "Ndɛ kekle kacilɛ ndɛ pɔpɔ mɔ sran wun i wlɛ",
          ],
        },
      ],
    },
    {
      id: "ia-creative",
      icon: "bot",
      emoji: "🤖",
      title: "Aleman ngwlɛlɛ (IA) nun yiyilɛ",
      intro: "N fa IA naan junman'n kɔ ndɛndɛ, ɔ yo kpa, naan ɔ kaci.",
      groups: [
        {
          label: "Desɛn yolɛ",
          items: [
            "Desɛn yolɛ",
            "Fluwa dandan nin desɛn yolɛ",
            "Desɛn su akunndan mun",
            "Sran nzɔliɛ mun yolɛ",
            "Desɛn su akatua falɛ IA i lika",
            "Desɛn kacilɛ naan ɔ yo kpa",
            "Ɛntɛnɛti su ndɛ kanlɛ desɛn mun",
          ],
        },
        {
          label: "Video nin nɛn yolɛ",
          items: [
            "Video yolɛ",
            "Siesielɛ IA i lika",
            "Nɛn nin ndɛ kanlɛ",
            "Ninnge kwlaa nun yolɛ (multimédia)",
            "Junman wie mun be yolɛ be ngunmin",
          ],
        },
        {
          label: "IA nin ndɛ mun",
          items: [
            "Fluwa klɛlɛ IA i lika",
            "Ndɛ mun be klɛlɛ ekun naan be yo kpa",
            "Ɛntɛnɛti aɲia lika ndɛ mun",
            "Ndɛ mun be bo yiyilɛ ndɛ kpe su",
            "Junman su fluwa mun be yolɛ",
            "Ndɛ kekle mun be siesielɛ",
          ],
        },
      ],
    },
    {
      id: "documents",
      icon: "file",
      emoji: "📄",
      title: "Fluwa mun, siesielɛ nin junman ndɛndɛ yolɛ",
      intro: "IA i junman'n nun-man desɛn nin video ngunmin yolɛ. N fa i wie yo fluwa nin junman atin mun be siesielɛ nin be yo kpa.",
      groups: [
        {
          items: [
            "Junman su ndɛ klelɛ fluwa (présentation)",
            "Akunndan bo su fluwa kanngan",
            "Atɛ yolɛ ndɛ falɛ fluwa",
            "Junman ɲrun kɔlɛ atin",
            "Akunndan dan su fluwa mun",
            "Junman nun ninnge kwlaa be fluwa",
            "Atin nin like klelɛ fluwa",
            "Like klelɛ nun ninnge",
            "Junman su ndɛ nin i bo yiyilɛ",
            "Akunndan nin junman siesielɛ",
            "Ndɛ mun be siesielɛ nin be kacilɛ",
          ],
        },
      ],
    },
    {
      id: "ideation",
      icon: "lightbulb",
      emoji: "💡",
      title: "Akunndan bulɛ nin junman siesielɛ",
      intro: "Akunndan mɔ be siesie-mɛn i kpa'n, ɔ ka akunndan ngunmin. N uka sran naan akunndan'n kaci junman kpa: Akunndan → Ndɛ bo → Siesielɛ → Ndɛ → Nzɔliɛ → Klelɛ → Bolɛ su.",
      groups: [
        {
          label: "I kwla kan ninnge nga be su",
          items: [
            "Atɛ yolɛ junman mun",
            "Ninnge nin junman mun",
            "Ndɛ bolɛ junman dandan",
            "Video su akunndan mun",
            "Ɛntɛnɛti su junman mun",
            "Like klelɛ junman mun",
            "IA su ninnge uflɛuflɛ",
          ],
        },
      ],
    },
    {
      id: "formation",
      icon: "grad",
      emoji: "🎓",
      title: "IA su like klelɛ nin ukalɛ",
      intro: "N kle junman difuɛ mun, atɛ yofuɛ mun, suklu ba mun, yifuɛ mun nin aɲia mun like naan be wun IA i wlɛ kpa naan be fa di junman.",
      groups: [
        {
          label: "Like klelɛ nin ukalɛ",
          items: [
            "IA i bo bolɛ like klelɛ",
            "IA nun ninnge falɛ junman nun",
            "IA fa yo ndɛ nin desɛn",
            "IA fa bo ndɛ (kominikasiɔn)",
            "IA fa yo video",
            "IA fa di junman ndɛndɛ",
            "Kosan kpa usalɛ IA i sɛ (prompt)",
            "IA junman atin mun be siesielɛ",
            "Sran kun i ngunmin ukalɛ",
            "Like klelɛ nga be fa ninnge mɔ be o lɛ sakpa'n be yo i"
          ],
        },
      ],
    },
  ],
  chain: {
    title: "Bo bolɛ lele i wielɛ su",
    lead: "N fa-man IA nun ninnge ngunmin di junman. N di junman'n i bo lele i ti nun:",
    steps: ["Bu akunndan", "Siesie", "Klɛ", "Yo", "Yi i", "Siesie kpa", "Yo i kpa kpa", "Bo su"],
    note: "Afin ka naan be yo desɛn annzɛ video kpa'n, ɔ fata kɛ akunndan'n yo weinwein, ndɛ'n yo kpa, naan siesielɛ'n yo kpa.",
  },
  help: {
    title: "Ninnge nga n kwla uka wɔ nun",
    pairs: [
      { q: "Akunndan kun o ɔ klun?", a: "N kwla uka wɔ naan a siesie i kpa." },
      { q: "Like kun o ɔ sa nun mɔ a to i?", a: "N kwla uka wɔ naan a bo i su ndɛ kpa." },
      { q: "Ndɛ kun o lɛ mɔ a kunndɛ kɛ a yiyi nun?", a: "N kwla kaci i ndɛ nin video mɔ sran wun i wlɛ." },
      { q: "Video ndɛ klɛlɛ o ɔ sa nun?", a: "N kwla siesie i naan n kaci i video." },
      { q: "A kunndɛ video?", a: "N kwla uka wɔ i klɛlɛ nun lele i siesielɛ su." },
      { q: "A kunndɛ kɛ a fa IA di ɔ junman nun?", a: "N kwla kle wɔ i falɛ nin i su junman dilɛ." },
    ],
  },
  approach: {
    title: "N atin",
    lines: ["IA ti junman nun like.", "Ngwlɛlɛ yolɛ ti wunmiɛn.", "Akunndan dan ti atin.", "Sran'n ti i ti nun ndɛ."],
  },
  cta: { primary: "E koko ɔ junman'n su", secondary: "Nian n junman mun be kwlaa" },
  seo: {
    title: "N junman mun — IA, yiyilɛ nin mɛn uflɛ kacilɛ | Inocent KOFFI",
    description: "Inocent KOFFI: video yolɛ, ndɛ klɛlɛ, aleman ngwlɛlɛ (IA), junman su fluwa mun, akunndan siesielɛ nin IA su like klelɛ.",
  },
};

const dyu: ExpertiseContent = {
  ...fr,
  badge: "N ka dɔnniyaw",
  title: "IA, dilanni ani numanko ",
  titleAccent: "yiriwali",
  lead: "N bɛ hakilimaya masin (IA), dilanni fanga ani n ka baarakɛcogo di miiriyaw, porozɛw, sosiyetew ani dilannikɛlaw ma.",
  lead2: "Ka bɔ miiri fɔlɔ la fo a laban na, n bɛ dɛmɛ kɛ labɛnni, ɲɛnabɔli, dilanni ani porozɛw nafa bonyali la numanko baarakɛminɛnw ni IA barika la.",
  chain: {
    title: "Baara kɛcogo laban fo laban",
    lead: "N tɛ IA minɛnw dɔrɔn ka baara kɛ. N bɛ jɔ baara bɛɛ la:",
    steps: ["Miiri", "Labɛn", "Sɛbɛn", "Dilan", "Bɔ", "Ɲɛnabɔ", "Ɲɛtaa", "Jɛnsɛn"],
    note: "Sanni ja ɲuman walima video ɲuman ka bɔ, miiri jɛlen, cikan bɛnnen ani labɛnni ɲuman ka kan ka kɛ fɔlɔ.",
  },
  approach: {
    title: "N ka cogoya",
    lines: ["IA i n'a fɔ baarakɛminɛn.", "Dilanni fanga i n'a fɔ fanga.", "Cogoyalabɛn i n'a fɔ sira.", "Adamaden i n'a fɔ laban."],
  },
  cta: { primary: "An ka baro i ka porozɛ kan", secondary: "N ka dɔnniyaw bɛɛ lajɛ" },
  seo: {
    title: "N ka dɔnniyaw — IA, dilanni ani numanko yiriwali | Inocent KOFFI",
    description: "Inocent KOFFI: video dilanni, sɛbɛnni, hakilimaya masin (IA), baara sɛbɛnw, miiri labɛnni ani IA kalan.",
  },
};

export const expertiseContent: Partial<Record<Language, ExpertiseContent>> = { fr, en, bci, dyu };

export const getExpertiseContent = (language: Language): ExpertiseContent =>
  expertiseContent[language] ?? fr;
