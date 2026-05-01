import { describe, expect, it } from "bun:test";
import {
  buildWhatsAppMessage,
  buildWhatsAppShareUrl,
  DEFAULT_SIGNATURE,
} from "../whatsappShare";

describe("WhatsApp share formatting", () => {
  const cases = [
    { title: "Investir dans le palmier à huile", desc: "Guide complet 2026" },
    { title: "Café & cacao : prix records !", desc: "Analyse des marges." },
    { title: "L’avenir de l’agro-industrie en Côte d’Ivoire", desc: "Vision 2030" },
    { title: 'Étude "PALMISTES 2026" — résultats <chocs>', desc: "Données vérifiées" },
    { title: "100% bio : pourquoi ça marche ?", desc: "Étude terrain" },
    { title: "🌴 Hévéa : opportunités cachées", desc: "Notre analyse" },
  ];

  for (const { title, desc } of cases) {
    // The helper normalizes typographic apostrophes/quotes for cross-language safety
    const normalizedTitle = title
      .replace(/[’‘‚‛]/g, "'")
      .replace(/[“”«»„]/g, '"');
    it(`wraps title in *bold* and signature in _italic_ — "${title}"`, () => {
      const msg = buildWhatsAppMessage({
        title,
        description: desc,
        url: "https://ikoffi.agricapital.ci/new/art004-026",
      });
      expect(msg.startsWith(`*${normalizedTitle}*`)).toBe(true);
      expect(msg).toContain(`_${DEFAULT_SIGNATURE}_`);
      expect(msg).toContain("https://ikoffi.agricapital.ci/new/art004-026");
    });

    it(`URL-encodes payload safely — "${title}"`, () => {
      const url = buildWhatsAppShareUrl({
        title,
        description: desc,
        url: "https://ikoffi.agricapital.ci/new/art004-026",
      });
      expect(url.startsWith("https://wa.me/?text=")).toBe(true);
      const decoded = decodeURIComponent(url.replace("https://wa.me/?text=", ""));
      expect(decoded).toContain(`*${normalizedTitle}*`);
      expect(decoded).toContain(`_${DEFAULT_SIGNATURE}_`);
    });
  }

  it("truncates very long descriptions but keeps formatting", () => {
    const long = "x".repeat(500);
    const msg = buildWhatsAppMessage({
      title: "Titre",
      description: long,
      url: "https://example.com",
    });
    expect(msg).toMatch(/^\*Titre\*/);
    expect(msg).toContain("…");
    expect(msg).toContain(`_${DEFAULT_SIGNATURE}_`);
  });

  it("falls back to title when description is empty", () => {
    const msg = buildWhatsAppMessage({
      title: "Mon titre seul",
      url: "https://example.com",
    });
    expect(msg).toContain("*Mon titre seul*");
    expect(msg.split("\n\n")[1]).toBe("Mon titre seul");
  });
});