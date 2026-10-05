/**
 * Glossaire de référence Baoulé (bci) & Dioula/Bambara (dyu)
 * ----------------------------------------------------------
 * Base orthographique : alphabet ivoirien officiel (ILA / SIL),
 * lexique du Dictionnaire baoulé-français (Carteron) et vocabulaire
 * attesté dans la Bible en baoulé (Ɲanmiɛn Ndɛ) pour les termes
 * abstraits (travail, parole, création, aide, chemin, force…).
 *
 * Objectif : garantir une traduction cohérente mot-pour-mot /
 * expression-pour-expression partout sur le site, plus une
 * conversion complète des chiffres, dates et unités.
 */

export type GlossaryLang = "bci" | "dyu";

/** Termes métier du site → équivalents baoulé / dioula validés. */
export const GLOSSARY: Record<string, Record<GlossaryLang, string>> = {
  // Identité & rôles
  entrepreneur: { bci: "junman bo difuɛ", dyu: "baarada dabaga" },
  developer: { bci: "ɛntɛnɛti su junman yofuɛ", dyu: "ɛntɛrinɛti baarakɛla" },
  creator: { bci: "yifuɛ", dyu: "dabaga" },
  manager: { bci: "kpɛnngbɛn", dyu: "ɲɛmɔgɔ" },
  partner: { bci: "junman bo wiengu", dyu: "jɛɲɔgɔn" },
  client: { bci: "atɛ tofuɛ", dyu: "sannikɛla" },

  // Numérique
  website: { bci: "ɛntɛnɛti su lika", dyu: "ɛntɛrinɛti yɔrɔ" },
  application: { bci: "junman ninnge (aplikasiɔn)", dyu: "baarakɛminɛn (aplikasɔn)" },
  platform: { bci: "junman lika dan", dyu: "baara dingira" },
  ai: { bci: "masin akunndan (IA)", dyu: "masin hakili (IA)" },
  video: { bci: "wunnɛn desin (video)", dyu: "ja yɛlɛma (wideyo)" },
  audio: { bci: "nɛn (audio)", dyu: "kumakan (odiyo)" },
  music: { bci: "jue", dyu: "dɔnkili" },
  image: { bci: "desin", dyu: "ja" },
  solution: { bci: "ndɛ nuan wielɛ", dyu: "kunbɛn fɛɛrɛ" },
  service: { bci: "junman nga be yo man sran", dyu: "baara kɛta" },
  price: { bci: "i ti sika", dyu: "a sɔngɔ" },
  order: { bci: "ninnge srɛlɛ", dyu: "kuma ɲini" },
  payment: { bci: "sika kalɛ", dyu: "wari sara" },
  contact: { bci: "flɛlɛ", dyu: "weeleli" },
  news: { bci: "ndɛ uflɛ mun", dyu: "kibaruw" },
  project: { bci: "junman dan", dyu: "baara dabɔlen" },
  portfolio: { bci: "junman nga n dili be", dyu: "baara kɛlenw" },
  studio: { bci: "yilɛ lika (studio)", dyu: "dabaga so (sitidiyo)" },

  // Verbes-clés (usage biblique attesté)
  create: { bci: "yi", dyu: "da" },
  build: { bci: "kplan", dyu: "jɔ" },
  transform: { bci: "kaci", dyu: "yɛlɛma" },
  help: { bci: "uka", dyu: "dɛmɛ" },
  learn: { bci: "suan", dyu: "kalan" },
  work: { bci: "junman", dyu: "baara" },
  idea: { bci: "akunndan", dyu: "miiriya" },
  strength: { bci: "wunmiɛn", dyu: "fanga" },
  way: { bci: "atin", dyu: "sira" },
  truth: { bci: "nanwlɛ", dyu: "tiɲɛ" },
};

/** Récupère un terme du glossaire (fallback : la clé elle-même). */
export const glossary = (key: string, lang: GlossaryLang): string =>
  GLOSSARY[key]?.[lang] ?? key;

/* ------------------------------------------------------------------ */
/* CHIFFRES                                                            */
/* ------------------------------------------------------------------ */

const BCI_UNITS = ["", "kun", "nɲɔn", "nsan", "nnan", "nnun", "nsiɛn", "nso", "mɔcuɛ", "ngwlan"];
const BCI_TENS = ["", "blu", "ablaɔn", "ablasan", "ablanan", "ablenun", "ablasiɛn", "ableso", "abluɔcuɛ", "ablɔngwlan"];

const DYU_UNITS = ["", "kelen", "fila", "saba", "naani", "duuru", "wɔɔrɔ", "wolonwula", "sɛgin", "kɔnɔntɔn"];
const DYU_TENS = ["", "tan", "mugan", "bi saba", "bi naani", "bi duuru", "bi wɔɔrɔ", "bi wolonwula", "bi sɛgin", "bi kɔnɔntɔn"];

const bciBelow100 = (n: number): string => {
  if (n === 0) return "ngboko";
  if (n < 10) return BCI_UNITS[n];
  const t = Math.floor(n / 10);
  const u = n % 10;
  return u === 0 ? BCI_TENS[t] : `${BCI_TENS[t]} nin ${BCI_UNITS[u]}`;
};

const dyuBelow100 = (n: number): string => {
  if (n === 0) return "foyi";
  if (n < 10) return DYU_UNITS[n];
  const t = Math.floor(n / 10);
  const u = n % 10;
  return u === 0 ? DYU_TENS[t] : `${DYU_TENS[t]} ni ${DYU_UNITS[u]}`;
};

/** Nombre entier → mots baoulé (ya = 100, akpi = 1000, akpiakpi = 1 000 000). */
export const numberToBaoule = (value: number): string => {
  let n = Math.floor(Math.abs(value));
  if (n === 0) return "ngboko";
  const parts: string[] = [];
  const scale: Array<[number, string]> = [
    [1_000_000, "akpiakpi"],
    [1_000, "akpi"],
    [100, "ya"],
  ];
  for (const [size, word] of scale) {
    const q = Math.floor(n / size);
    if (q > 0) {
      parts.push(q === 1 ? word : `${word} ${bciBelow100(q)}`);
      n -= q * size;
    }
  }
  if (n > 0) parts.push(bciBelow100(n));
  return parts.join(" nin ");
};

/** Nombre entier → mots dioula (kɛmɛ = 100, waga = 1000, milyɔn). */
export const numberToDioula = (value: number): string => {
  let n = Math.floor(Math.abs(value));
  if (n === 0) return "foyi";
  const parts: string[] = [];
  const scale: Array<[number, string]> = [
    [1_000_000, "milyɔn"],
    [1_000, "waga"],
    [100, "kɛmɛ"],
  ];
  for (const [size, word] of scale) {
    const q = Math.floor(n / size);
    if (q > 0) {
      parts.push(q === 1 ? word : `${word} ${dyuBelow100(q)}`);
      n -= q * size;
    }
  }
  if (n > 0) parts.push(dyuBelow100(n));
  return parts.join(" ni ");
};

export const numberToWords = (value: number, lang: GlossaryLang): string =>
  lang === "bci" ? numberToBaoule(value) : numberToDioula(value);

/* ------------------------------------------------------------------ */
/* UNITÉS                                                              */
/* ------------------------------------------------------------------ */

const UNITS: Record<string, Record<GlossaryLang, string>> = {
  fcfa: { bci: "sɛfa", dyu: "sefa" },
  ha: { bci: "ɛktaa", dyu: "ɛkitaari" },
  year: { bci: "afuɛ", dyu: "san" },
  month: { bci: "anglo", dyu: "kalo" },
  day: { bci: "cɛn", dyu: "don" },
  hour: { bci: "dɔ", dyu: "lɛrɛ" },
  minute: { bci: "miniti", dyu: "miniti" },
  second: { bci: "sekɔndi", dyu: "sekondi" },
  plant: { bci: "waka mma", dyu: "jiriden" },
  percent: { bci: "ya su", dyu: "kɛmɛsarada" },
};

export const unit = (key: string, lang: GlossaryLang): string =>
  UNITS[key]?.[lang] ?? key;

/** Ex. formatQuantity(620, "ha", "bci") → "ya nsiɛn nin ablaɔn ɛktaa (620 ha)" */
export const formatQuantity = (
  value: number,
  unitKey: string,
  lang: GlossaryLang,
  showDigits = true,
): string => {
  const words = `${numberToWords(value, lang)} ${unit(unitKey, lang)}`.trim();
  return showDigits ? `${words} (${value.toLocaleString("fr-FR")} ${unitKey})` : words;
};

export const formatPrice = (value: number, lang: GlossaryLang): string =>
  formatQuantity(value, "fcfa", lang);

/* ------------------------------------------------------------------ */
/* DATES                                                               */
/* ------------------------------------------------------------------ */

const BCI_MONTHS = [
  "Anglo klikli", "Anglo nɲɔn", "Anglo nsan", "Anglo nnan", "Anglo nnun", "Anglo nsiɛn",
  "Anglo nso", "Anglo mɔcuɛ", "Anglo ngwlan", "Anglo blu", "Anglo blu nin kun", "Anglo blu nin nɲɔn",
];
const DYU_MONTHS = [
  "Kalo fɔlɔ", "Kalo filanan", "Kalo sabanan", "Kalo naaninan", "Kalo duurunan", "Kalo wɔɔrɔnan",
  "Kalo wolonwulanan", "Kalo sɛginnan", "Kalo kɔnɔntɔnnan", "Kalo tannan", "Kalo tan ni kelennan", "Kalo tan ni filanan",
];

const BCI_DAYS = ["Mɔnnɛn", "Kisiɛ", "Jɔlɛ", "Mlan", "Wue", "Fue", "Monnɛn-cɛn"];
const DYU_DAYS = ["Kari", "Ntɛnɛn", "Tarata", "Araba", "Alamisa", "Juma", "Sibiri"];

/** Date → écriture complète en baoulé / dioula (jour, mois, année en mots). */
export const formatLocalDate = (input: string | Date, lang: GlossaryLang): string => {
  const d = typeof input === "string" ? new Date(input) : input;
  if (Number.isNaN(d.getTime())) return "";
  const dayName = lang === "bci" ? BCI_DAYS[(d.getDay() + 6) % 7] : DYU_DAYS[d.getDay()];
  const monthName = (lang === "bci" ? BCI_MONTHS : DYU_MONTHS)[d.getMonth()];
  const dayNum = numberToWords(d.getDate(), lang);
  const yearNum = numberToWords(d.getFullYear(), lang);
  const yearWord = unit("year", lang);
  return lang === "bci"
    ? `${dayName}, ${monthName} i ${dayNum}, ${yearWord} ${yearNum}`
    : `${dayName}, ${monthName} tile ${dayNum}, ${yearWord} ${yearNum}`;
};

/** Aide générique : renvoie la date localisée pour toutes les langues du site. */
export const formatSiteDate = (input: string | Date, language: string): string => {
  if (language === "bci" || language === "dyu") return formatLocalDate(input, language);
  const d = typeof input === "string" ? new Date(input) : input;
  if (Number.isNaN(d.getTime())) return "";
  const locales: Record<string, string> = {
    fr: "fr-FR", en: "en-US", es: "es-ES", de: "de-DE", zh: "zh-CN", ar: "ar",
  };
  return d.toLocaleDateString(locales[language] ?? "fr-FR", {
    year: "numeric", month: "long", day: "numeric",
  });
};

/** Chiffres affichés dans un texte : version mots + chiffres pour bci/dyu. */
export const localizeNumber = (value: number, language: string): string => {
  if (language === "bci" || language === "dyu") {
    return `${numberToWords(value, language)} (${value.toLocaleString("fr-FR")})`;
  }
  return value.toLocaleString(language === "en" ? "en-US" : "fr-FR");
};
