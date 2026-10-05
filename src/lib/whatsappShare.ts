// Helper to build the WhatsApp share message for an article.
// Guarantees:
//  - Title is wrapped in *...* (bold)
//  - Signature is wrapped in _..._ (italic)
//  - Special characters in title are preserved (no escaping that would break asterisks)
//  - Output is then URL-encoded for use in `wa.me/?text=`

export interface WhatsAppShareInput {
  title: string;
  description?: string;
  url: string;
  signature?: string;
  /** Optional locale hint — fr, en, es, de, zh, ar, etc. */
  locale?: string;
}

export const DEFAULT_SIGNATURE = "— Inocent KOFFI | Gérant AGRICAPITAL SARL";

/**
 * Auto-detect the dominant language/script of a text so we can pick the right
 * WhatsApp formatting mode (RTL marker, CJK no-space handling, Latin default).
 * Heuristic — script-based, fast, no dependency.
 * Returns a BCP-47-ish prefix: "ar", "he", "fa", "ur", "zh", "ja", "ko", or "" (Latin/unknown).
 */
export function detectLanguage(text: string): string {
  const s = (text || "").normalize("NFC");
  if (!s.trim()) return "";
  const counts = {
    arabic: (s.match(/[\u0600-\u06FF\u0750-\u077F\uFB50-\uFDFF\uFE70-\uFEFF]/g) || []).length,
    hebrew: (s.match(/[\u0590-\u05FF]/g) || []).length,
    cjk: (s.match(/[\u4E00-\u9FFF\u3400-\u4DBF]/g) || []).length,
    hiragana: (s.match(/[\u3040-\u309F\u30A0-\u30FF]/g) || []).length,
    hangul: (s.match(/[\uAC00-\uD7AF]/g) || []).length,
  };
  const total = s.replace(/\s+/g, "").length || 1;
  if (counts.arabic / total > 0.2) {
    // Distinguish Arabic/Persian/Urdu by characteristic letters
    if (/[\u067E\u0686\u0698\u06AF]/.test(s)) return "fa"; // پ چ ژ گ
    if (/[\u0679\u0688\u0691\u06BA]/.test(s)) return "ur";
    return "ar";
  }
  if (counts.hebrew / total > 0.2) return "he";
  if (counts.hiragana > 0) return "ja";
  if (counts.hangul > 0) return "ko";
  if (counts.cjk / total > 0.2) return "zh";
  return "";
}

/**
 * Normalize text for WhatsApp formatting across languages.
 * - Preserves accents (é, è, ñ, ü, ä, …) and diacritics
 * - Normalizes typographic apostrophes (’ → ') and quotes (« » “ ” → ")
 * - Collapses excessive whitespace
 * - Strips characters that would break WhatsApp's *bold* / _italic_ markers
 *   inside the wrapped segment (lone * or _ adjacent to the boundary)
 */
function normalizeForWhatsApp(input: string, locale?: string): string {
  let s = (input || "").normalize("NFC");
  s = s
    .replace(/[’‘‚‛]/g, "'")
    .replace(/[“”«»„]/g, '"')
    .replace(/\u00A0/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  // Avoid breaking *...* / _..._ wrappers: trim trailing/leading * or _
  s = s.replace(/^[\*_]+|[\*_]+$/g, "").trim();

  // Auto-detect when no explicit locale is supplied so multi-lingual content
  // is always wrapped correctly (RTL marker, no broken *...* / _..._).
  const effectiveLocale = (locale || detectLanguage(s) || "").toLowerCase();

  // RTL languages (ar, he, fa, ur) — add an RLM marker so WhatsApp keeps
  // the *bold* asterisks visually attached to the right side of the word.
  const rtl = /^(ar|he|fa|ur)/i.test(effectiveLocale);
  if (rtl) s = `\u200F${s}\u200F`;

  // CJK (zh/ja/ko) — WhatsApp requires *bold* tokens to be ASCII-adjacent.
  // Pad with thin spaces so the markers are recognized around CJK glyphs.
  if (/^(zh|ja|ko)/i.test(effectiveLocale)) {
    s = s.replace(/^/, "\u200B").replace(/$/, "\u200B");
  }
  return s;
}

export function buildWhatsAppMessage({
  title,
  description = "",
  url,
  signature = DEFAULT_SIGNATURE,
  locale,
}: WhatsAppShareInput): string {
  const cleanTitle = normalizeForWhatsApp(title, locale);
  const summaryRaw = (description || cleanTitle).trim();
  const summary = normalizeForWhatsApp(summaryRaw, locale);
  const cleanSignature = normalizeForWhatsApp(signature, locale);
  const compactSummary =
    summary.length > 220 ? `${summary.slice(0, 219).trim()}…` : summary;

  return `*${cleanTitle}*\n\n${compactSummary}\n\n_${cleanSignature}_\n\nL'article complet à ce lien 👉\n${url}`;
}

export function buildWhatsAppShareUrl(input: WhatsAppShareInput): string {
  return `https://wa.me/?text=${encodeURIComponent(buildWhatsAppMessage(input))}`;
}