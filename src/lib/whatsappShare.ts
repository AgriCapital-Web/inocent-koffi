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
}

export const DEFAULT_SIGNATURE = "— Inocent KOFFI | Fondateur AGRICAPITAL SARL";

export function buildWhatsAppMessage({
  title,
  description = "",
  url,
  signature = DEFAULT_SIGNATURE,
}: WhatsAppShareInput): string {
  const cleanTitle = (title || "").trim();
  const summary = (description || cleanTitle).trim();
  const compactSummary =
    summary.length > 220 ? `${summary.slice(0, 219).trim()}…` : summary;

  return `*${cleanTitle}*\n\n${compactSummary}\n\n_${signature}_\n\nL'article complet à ce lien 👉\n${url}`;
}

export function buildWhatsAppShareUrl(input: WhatsAppShareInput): string {
  return `https://wa.me/?text=${encodeURIComponent(buildWhatsAppMessage(input))}`;
}