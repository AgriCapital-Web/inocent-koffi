import type { LucideIcon } from "lucide-react";
import { Code2, Video, Music4, Sparkles, Plug } from "lucide-react";

export type ServiceItem = {
  id: string;
  title: string;
  description?: string;
  /** Prix de départ en FCFA. null = sur devis / sur mesure. */
  price: number | null;
  priceNote?: string;
  bullets?: string[];
};

export type ServiceCategory = {
  id: string;
  icon: LucideIcon;
  title: string;
  subtitle: string;
  items: ServiceItem[];
};

export const SERVICE_CATEGORIES: ServiceCategory[] = [
  {
    id: "web",
    icon: Code2,
    title: "Web & solutions digitales",
    subtitle:
      "Sites vitrines, applications web, plateformes, CRM, outils métier et intégrations API.",
    items: [
      {
        id: "site-essentiel",
        title: "Site vitrine essentiel",
        description: "Présence professionnelle rapide à mettre en ligne, responsive et optimisée SEO.",
        price: 100000,
        bullets: ["Jusqu'à 5 sections", "Formulaire de contact", "Optimisation mobile & SEO de base"],
      },
      {
        id: "site-moderne",
        title: "Site vitrine moderne & évolutif",
        description: "Design premium, animations maîtrisées, contenu administrable et évolutif.",
        price: 550000,
        bullets: ["Design sur mesure", "Espace d'administration", "SEO avancé & performances"],
      },
      {
        id: "app-web",
        title: "Applications web & plateformes",
        description: "Applications métier, espaces membres, tableaux de bord et back-offices.",
        price: 350000,
        bullets: ["Authentification", "Base de données", "Tableaux de bord"],
      },
      {
        id: "crm",
        title: "CRM / outils métier",
        description: "Pipeline commercial, gestion des dossiers, automatisations internes.",
        price: null,
        priceNote: "Sur devis",
      },
      {
        id: "leads",
        title: "Plateformes commerciales / génération de leads",
        description: "Tunnel d'acquisition, formulaires qualifiés, suivi et relances.",
        price: 250000,
      },
      {
        id: "ecommerce",
        title: "E-commerce avancé",
        description: "Catalogue, panier, paiement Mobile Money et carte bancaire, logistique.",
        price: null,
        priceNote: "Sur mesure",
      },
    ],
  },
  {
    id: "video",
    icon: Video,
    title: "Vidéo & création IA",
    subtitle:
      "Publicités, vidéos avec voix off, synchronisation labiale, vidéos personnalisées et contenus IA.",
    items: [
      {
        id: "video-voixoff",
        title: "Vidéo avec voix off",
        description: "Maximum 60 secondes.",
        price: 15000,
      },
      {
        id: "video-lipsync-2",
        title: "Synchronisation labiale — 2 personnages principaux",
        price: 20000,
      },
      {
        id: "video-lipsync-4",
        title: "Synchronisation labiale — 4 personnages principaux",
        price: 25000,
      },
      {
        id: "video-lipsync-multi",
        title: "Synchronisation labiale — plusieurs personnages",
        price: null,
        priceNote: "Sur devis",
      },
      {
        id: "video-personnalisee",
        title: "Vidéo personnalisée",
        description: "Scénario, univers visuel et format définis avec vous.",
        price: null,
        priceNote: "Sur devis",
      },
    ],
  },
  {
    id: "audio",
    icon: Music4,
    title: "Audio & musique",
    subtitle: "Jingles, voix off, créations audio et chansons personnalisées assistées par IA.",
    items: [
      {
        id: "jingle",
        title: "Jingle audio personnalisé",
        description:
          "Pour marques, produits, entreprises, événements, campagnes, émissions, etc.",
        price: 15000,
        priceNote: "À partir de",
      },
      {
        id: "chanson",
        title: "Chanson personnalisée assistée par IA",
        description: "Durée minimale : 2 min 30.",
        price: 15000,
        priceNote: "À partir de",
      },
      {
        id: "mini-clip",
        title: "Mini-clip musical personnalisé",
        description: "Durée minimale : 2 min 30.",
        price: 45000,
        priceNote: "À partir de",
        bullets: [
          "Photos fournies",
          "Univers visuel personnalisé",
          "Musique & paroles",
          "Scénario",
          "Animation IA",
        ],
      },
    ],
  },
  {
    id: "ia",
    icon: Sparkles,
    title: "Intelligence artificielle",
    subtitle: "Intégration IA sur mesure, adaptée à votre activité et à vos outils existants.",
    items: [
      {
        id: "ia-assistant",
        title: "Assistant virtuel & chatbot",
        price: null,
        priceNote: "Sur mesure",
      },
      {
        id: "ia-contenu",
        title: "Génération de contenu & automatisation",
        price: null,
        priceNote: "Sur mesure",
      },
      {
        id: "ia-analyse",
        title: "Analyse & traitement documentaire",
        price: null,
        priceNote: "Sur mesure",
      },
      {
        id: "ia-integration",
        title: "Intégration d'IA dans une application existante",
        price: null,
        priceNote: "Sur mesure",
      },
    ],
  },
];

export const API_GROUPS = [
  {
    id: "paiement",
    title: "Paiement",
    items: ["Mobile Money", "Carte bancaire", "Paiement international"],
  },
  {
    id: "communication",
    title: "Communication",
    items: ["SMS", "E-mail", "WhatsApp"],
  },
  {
    id: "ia",
    title: "IA",
    items: ["Assistants", "Génération", "Automatisation"],
  },
  {
    id: "autres",
    title: "Autres services",
    items: ["Statistiques", "Géolocalisation", "Services externes", "Outils métier"],
  },
];

export const formatFcfa = (value: number) => `${value.toLocaleString("fr-FR")} FCFA`;

export const priceLabel = (item: ServiceItem) => {
  if (item.price === null) return item.priceNote ?? "Sur devis";
  return `${item.priceNote ?? "À partir de"} ${formatFcfa(item.price)}`;
};

/** Lien de commande : ouvre le contact avec le service pré-sélectionné. */
export const orderHref = (item: ServiceItem) =>
  `/contact?service=${encodeURIComponent(item.id)}&label=${encodeURIComponent(item.title)}`;
