/**
 * Contenus officiels importés depuis agricapital.ci (source institutionnelle).
 * RÈGLE : les textes sont conservés à l'identique. Seules la structure,
 * la disposition et la mise en page sont adaptées à ce site personnel.
 */

export const AGRICAPITAL_URL = "https://agricapital.ci";
export const AGRICAPITAL_APP_URL = "https://app.agricapital.ci";
export const AGRICAPITAL_CLIENT_URL = "https://client.agricapital.ci";

export type Actualite = {
  slug: string;
  category: string;
  date: string; // ISO
  dateLabel: string;
  title: string;
  excerpt: string;
  /** Paragraphes repris intégralement depuis agricapital.ci. */
  content: string[];
  image: string;
  imageAlt: string;
  sourceUrl: string;
  stats?: { value: string; label: string }[];
};

export const actualites: Actualite[] = [
  {
    slug: "inauguration-premier-bureau-proximite-gonate",
    category: "Bureau de proximité",
    date: "2026-08-01",
    dateLabel: "1er août 2026 — Gonaté, Daloa",
    title: "AgriCapital ouvre son premier bureau de proximité",
    excerpt:
      "Premier bureau de proximité AgriCapital, inauguré le 1er août 2026 à Gonaté (département de Daloa).",
    content: [
      "Premier bureau de proximité AgriCapital, inauguré le 1er août 2026 à Gonaté (département de Daloa).",
      "The opening of the Gonaté office marks the official launch of the operational rollout of our agricultural asset creation and management model, closer to rural territories.",
      "A dedicated desk for information, support and contracting, close to landowners and subscribers.",
    ],
    image: "https://agricapital.ci/inauguration/bureau-gonate-enseigne.webp",
    imageAlt:
      "Enseigne du bureau de proximité AgriCapital à Gonaté, inauguré par Inocent KOFFI",
    sourceUrl: "https://agricapital.ci/actualites",
    stats: [
      { value: "1er", label: "bureau de proximité" },
      { value: "100+", label: "participants" },
      { value: "Gonaté", label: "département de Daloa" },
      { value: "20 000+", label: "plants en pépinière" },
    ],
  },
  {
    slug: "ouverture-officielle-avec-nos-partenaires",
    category: "Inauguration",
    date: "2026-08-01",
    dateLabel: "1er août 2026 — Gonaté",
    title: "An official opening with our partners",
    excerpt:
      "Local authorities, landowners, technical partners and clients gathered around the AgriCapital model.",
    content: [
      "Local authorities, landowners, technical partners and clients gathered around the AgriCapital model.",
      "Une cérémonie très suivie.",
      "Présentation du modèle économique.",
    ],
    image: "https://agricapital.ci/inauguration/inauguration-assemblee.webp",
    imageAlt:
      "Cérémonie d'inauguration AgriCapital à Gonaté avec les autorités et partenaires",
    sourceUrl: "https://agricapital.ci",
  },
  {
    slug: "modele-creation-gestion-actifs-agricoles",
    category: "Vision & modèle",
    date: "2026-08-01",
    dateLabel: "1er août 2026",
    title: "A model for creating and managing agricultural assets",
    excerpt:
      "Land securing, plantation development and technical monitoring throughout the contract.",
    content: [
      "Land securing, plantation development and technical monitoring throughout the contract.",
      "Présentation du modèle économique.",
      "Remise symbolique.",
    ],
    image: "https://agricapital.ci/inauguration/inauguration-prise-parole.webp",
    imageAlt:
      "Inocent KOFFI présente le modèle économique AgriCapital lors de l'inauguration de Gonaté",
    sourceUrl: "https://agricapital.ci",
  },
  {
    slug: "11-conseillers-commerciaux-rejoignent-agricapital",
    category: "Réseau commercial",
    date: "2026-07-20",
    dateLabel: "Juillet 2026",
    title: "11 sales advisors join AgriCapital",
    excerpt:
      "First onboarding and training session for our sales network: history, vision, offers and standards.",
    content: [
      "First onboarding and training session for our sales network: history, vision, offers and standards.",
      "Building a sustainable company relies as much on its teams as on its business model.",
      "Trained, committed and aligned teams.",
    ],
    image: "https://agricapital.ci/formation/formation-groupe-cohorte.webp",
    imageAlt:
      "Session de formation des 11 conseillers commerciaux AgriCapital en Côte d'Ivoire",
    sourceUrl: "https://agricapital.ci",
  },
  {
    slug: "organisation-structuree-ancree-sur-le-terrain",
    category: "Nos équipes",
    date: "2026-08-01",
    dateLabel: "1er août 2026",
    title: "A structured organisation rooted in the field",
    excerpt:
      "AgriCapital is progressively building a solid organisation able to support its partners over the long term.",
    content: [
      "AgriCapital is progressively building a solid organisation able to support its partners over the long term.",
      "L'équipe AgriCapital et ses partenaires.",
      "Accueil et accompagnement de proximité.",
    ],
    image: "https://agricapital.ci/inauguration/inauguration-groupe.webp",
    imageAlt:
      "L'équipe AgriCapital et ses partenaires réunis à Gonaté autour d'Inocent KOFFI",
    sourceUrl: "https://agricapital.ci",
  },
  {
    slug: "plus-de-20000-plants-en-pepiniere",
    category: "Pépinière",
    date: "2026-08-01",
    dateLabel: "1er août 2026",
    title: "Plus de 20 000 plants en pépinière",
    excerpt:
      "Building your sustainable agricultural heritage — AgriCapital supports individuals and businesses in creating professional oil palm plantations in Côte d'Ivoire.",
    content: [
      "Plus de 20 000 plants en pépinière.",
      "AgriCapital supports individuals and businesses in creating professional oil palm plantations in Côte d'Ivoire.",
    ],
    image: "https://agricapital.ci/inauguration/pepiniere-plants-palmier.webp",
    imageAlt:
      "Pépinière AgriCapital de plants de palmier à huile Tenera à Gonaté, Côte d'Ivoire",
    sourceUrl: "https://agricapital.ci",
  },
  {
    slug: "palminvest-terrapalm-deux-voies",
    category: "Nos offres",
    date: "2026-07-15",
    dateLabel: "Juillet 2026",
    title: "PalmInvest & TerraPalm : deux voies vers le patrimoine agricole",
    excerpt:
      "Avec ou sans foncier, AgriCapital conçoit, développe et accompagne votre plantation de palmier à huile jusqu'à sa mise en production.",
    content: [
      "Avec ou sans foncier, AgriCapital conçoit, développe et accompagne votre plantation de palmier à huile jusqu'à sa mise en production.",
      "PalmInvest — AgriCapital sécurise le foncier et crée pour vous une plantation de palmier à huile clé en main, remise productive à 36 mois.",
      "TerraPalm — Votre foncier dort ? Nous le transformons en plantation productive. Vous restez propriétaire, nous assurons toute la mise en valeur.",
    ],
    image: "https://agricapital.ci/formation/formation-presentation-offres.webp",
    imageAlt:
      "Présentation des offres PalmInvest et TerraPalm d'AgriCapital par Inocent KOFFI",
    sourceUrl: "https://agricapital.ci",
  },
  {
    slug: "tresor-cache-foncier-agricole",
    category: "Bref investisseur",
    date: "2026-06-10",
    dateLabel: "Juin 2026",
    title: "Le trésor caché du foncier agricole",
    excerpt:
      "Un bref essentiel pour comprendre pourquoi les terres africaines inexploitées peuvent devenir un patrimoine productif et transmissible.",
    content: [
      "Un bref essentiel pour comprendre pourquoi les terres africaines inexploitées peuvent devenir un patrimoine productif et transmissible.",
    ],
    image: "https://agricapital.ci/assets/vavoua-land-2026-Dc1J-vmw.jpg",
    imageAlt:
      "Foncier agricole sécurisé par AgriCapital à Vavoua, Côte d'Ivoire",
    sourceUrl: "https://agricapital.ci/tresor-foncier",
  },
  {
    slug: "tresor-cache-palmier-a-huile",
    category: "Bref investisseur",
    date: "2026-06-10",
    dateLabel: "Juin 2026",
    title: "Le trésor caché du palmier à huile",
    excerpt:
      "Un bref clair sur un arbre stratégique, présent dans le quotidien, productif pendant des décennies et adapté au potentiel ivoirien.",
    content: [
      "Un bref clair sur un arbre stratégique, présent dans le quotidien, productif pendant des décennies et adapté au potentiel ivoirien.",
    ],
    image: "https://agricapital.ci/assets/palm-mature-fruits-BH2YZTPx.jpg",
    imageAlt:
      "Régimes de palmier à huile mûrs dans une plantation AgriCapital en Côte d'Ivoire",
    sourceUrl: "https://agricapital.ci/tresor-palmier",
  },
  {
    slug: "espace-client-digital-agricapital",
    category: "Portail sécurisé",
    date: "2026-05-20",
    dateLabel: "Mai 2026",
    title: "Espace Client Digital AgriCapital",
    excerpt:
      "Un portail sécurisé vous permettant d'effectuer vos paiements mensuels, de suivre l'évolution de votre plantation, d'accéder à vos documents, rapports, photos et vidéos de terrain, et d'échanger avec nos équipes tout au long du cycle de production.",
    content: [
      "Un portail sécurisé vous permettant d'effectuer vos paiements mensuels, de suivre l'évolution de votre plantation, d'accéder à vos documents, rapports, photos et vidéos de terrain, et d'échanger avec nos équipes tout au long du cycle de production.",
      "Paiements mensuels · Suivi plantation · Documents & rapports · Photos & vidéos terrain · Échanges avec l'équipe.",
    ],
    image: "https://agricapital.ci/inauguration/inauguration-accueil-client.webp",
    imageAlt:
      "Accueil et accompagnement de proximité des clients AgriCapital à Gonaté",
    sourceUrl: "https://client.agricapital.ci/",
  },
];

export const getActualite = (slug?: string) =>
  actualites.find((a) => a.slug === slug);

/** Offres officielles AgriCapital — textes conservés à l'identique. */
export const offres = [
  {
    name: "PalmInvest",
    eyebrow: "Vous n'avez pas de terre",
    description:
      "AgriCapital sécurise le foncier et crée pour vous une plantation de palmier à huile clé en main, remise productive à 36 mois.",
    points: [
      "Foncier sécurisé et cartographié",
      "Plantation clé en main",
      "Garantie d'écoulement 25 ans",
    ],
    cta: "Découvrir PalmInvest",
    url: "https://agricapital.ci/palminvest",
    image: "https://agricapital.ci/assets/palm-mature-plantation-DcAJotdr.jpg",
    imageAlt: "Plantation de palmier à huile mature développée par AgriCapital",
  },
  {
    name: "TerraPalm",
    eyebrow: "Vous avez déjà une terre",
    description:
      "Votre foncier dort ? Nous le transformons en plantation productive. Vous restez propriétaire, nous assurons toute la mise en valeur.",
    points: [
      "Votre terre reste la vôtre",
      "Levé GPS et documentation",
      "Suivi agronomique long terme",
    ],
    cta: "Découvrir TerraPalm",
    url: "https://agricapital.ci/terrapalm",
    image: "https://agricapital.ci/assets/founder-palm-field-DBOAkeII.jpg",
    imageAlt:
      "Inocent KOFFI sur une parcelle de palmier à huile valorisée par AgriCapital",
  },
];

/** Domaines & infrastructures officielles de l'écosystème AgriCapital. */
export const plateformes = [
  {
    name: "AGRICAPITAL.CI",
    tagline: "AgriCapital — Agricultural Promoter & Integrated Services",
    description:
      "AgriCapital addresses this dual challenge by developing a structured agricultural promotion model. The company designs and deploys turnkey plantations, enabling individuals and professionals to access productive farming, while being relieved of technical, land and organizational constraints.",
    features: [
      "Plantation clé en main",
      "Sécurisation foncière",
      "Suivi technique & agronomique",
      "Garantie d'écoulement 25 ans",
    ],
    cta: "Découvrir AgriCapital",
    url: AGRICAPITAL_URL,
    audience: "Investisseurs, particuliers, propriétaires fonciers, institutions",
  },
  {
    name: "APP.AGRICAPITAL.CI",
    tagline: "Plateforme de Gestion des Planteurs & Plantations",
    description:
      "Plateforme opérationnelle interne d'AgriCapital : gestion des planteurs et des plantations, du parcours de souscription jusqu'à la production, avec accès sécurisé par compte utilisateur.",
    features: [
      "Souscription",
      "Plantation",
      "Production",
      "Demande de création de compte",
    ],
    cta: "Accéder à l'application",
    url: AGRICAPITAL_APP_URL,
    audience: "Équipes AgriCapital, conseillers commerciaux, planteurs",
  },
  {
    name: "CLIENT.AGRICAPITAL.CI",
    tagline: "Espace Client Digital — connexion sécurisée",
    description:
      "Un portail sécurisé vous permettant d'effectuer vos paiements mensuels, de suivre l'évolution de votre plantation, d'accéder à vos documents, rapports, photos et vidéos de terrain, et d'échanger avec nos équipes tout au long du cycle de production.",
    features: [
      "Paiements mensuels",
      "Suivi plantation",
      "Documents & rapports",
      "Photos & vidéos terrain",
      "Échanges avec l'équipe",
    ],
    cta: "Accéder au portail client",
    url: AGRICAPITAL_CLIENT_URL,
    audience: "Clients & souscripteurs AgriCapital",
  },
];
