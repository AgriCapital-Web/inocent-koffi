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

export const DEFAULT_SIGNATURE = "— Inocent KOFFI | Fondateur AGRICAPITAL SARL";

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
    .replace(/[–—]/g, "-")
    .replace(/\u00A0/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  // Avoid breaking *...* / _..._ wrappers: trim trailing/leading * or _
  s = s.replace(/^[\*_]+|[\*_]+$/g, "").trim();

  // RTL languages (ar, he, fa, ur) — add an LRM/RLM marker so WhatsApp keeps
  // the *bold* asterisks visually attached to the right side of the word.
  const rtl = /^(ar|he|fa|ur)/i.test(locale || "");
  if (rtl) s = `\u200F${s}\u200F`;
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