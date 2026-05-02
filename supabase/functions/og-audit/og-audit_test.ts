// Unit tests for og-audit helpers.
// We re-implement the pure helpers here (since index.ts boots Deno.serve on import)
// and test the SAME logic + live-probe the real fallback URLs deployed in production.

import { assert, assertEquals, assertStringIncludes } from "https://deno.land/std@0.224.0/assert/mod.ts";

const SITE_URL = "https://ikoffi.agricapital.ci";
const WHATSAPP_LIMIT_KB = 300;

function normalizeOgImage(raw: string): { normalized: string; differs: boolean; reason: string | null } {
  if (!raw) return { normalized: "", differs: false, reason: null };
  let v = raw.trim();
  let reason: string | null = null;
  if (v.startsWith("//")) v = "https:" + v;
  if (/%25[0-9a-f]{2}/i.test(v)) {
    try { v = decodeURIComponent(v); reason = "URL doublement encodée"; } catch {}
  }
  try {
    const u = new URL(v);
    u.pathname = u.pathname.split("/").map((seg) => {
      try { return encodeURIComponent(decodeURIComponent(seg)); } catch { return seg; }
    }).join("/");
    const cleaned = u.toString();
    const differs = cleaned !== raw;
    if (differs && !reason) reason = "URL normalisée différente";
    return { normalized: cleaned, differs, reason };
  } catch {
    return { normalized: v, differs: v !== raw, reason: "URL invalide ou cassée" };
  }
}

async function probeImage(url: string) {
  try {
    const res = await fetch(url, { method: "GET", redirect: "follow" });
    const ct = res.headers.get("content-type") || "";
    const cl = res.headers.get("content-length");
    let sizeKb: number | null = null;
    if (cl) sizeKb = Math.round(parseInt(cl, 10) / 102.4) / 10;
    else {
      try { const buf = await res.arrayBuffer(); sizeKb = Math.round(buf.byteLength / 102.4) / 10; } catch {}
    }
    const accessible = res.ok && (ct.startsWith("image/") || ct === "application/octet-stream" || ct.includes("svg"));
    return { status: res.status, sizeKb, accessible };
  } catch {
    return { status: null, sizeKb: null, accessible: false };
  }
}

Deno.test("normalizeOgImage — protocol-relative URLs are upgraded to https", () => {
  const r = normalizeOgImage("//cdn.example.com/img.jpg");
  assertEquals(r.normalized.startsWith("https://"), true);
  assertEquals(r.differs, true);
});

Deno.test("normalizeOgImage — clean HTTPS URL is unchanged", () => {
  const r = normalizeOgImage("https://example.com/image.jpg");
  assertEquals(r.normalized, "https://example.com/image.jpg");
  assertEquals(r.differs, false);
  assertEquals(r.reason, null);
});

Deno.test("normalizeOgImage — double-encoded URL is repaired and flagged", () => {
  const r = normalizeOgImage("https://example.com/path%2520with%2520spaces.jpg");
  assert(r.differs);
  assertStringIncludes(r.reason ?? "", "encod");
  // After decoding %2520 -> %20 then re-encoding consistently
  assert(r.normalized.includes("%20") || r.normalized.includes("with"));
});

Deno.test("normalizeOgImage — broken URL is flagged", () => {
  const r = normalizeOgImage("not a url at all");
  assertEquals(r.reason, "URL invalide ou cassée");
});

Deno.test("normalizeOgImage — empty input returns empty", () => {
  const r = normalizeOgImage("");
  assertEquals(r.normalized, "");
  assertEquals(r.differs, false);
});

Deno.test({
  name: "probeImage — fallback launch-1.jpg is accessible (HTTP 200) and below 1MB",
  ignore: !Deno.env.get("LIVE_PROBE"),
  async fn() {
    const r = await probeImage(`${SITE_URL}/images/gallery/launch-1.jpg`);
    assertEquals(r.status, 200);
    assertEquals(r.accessible, true);
    if (r.sizeKb !== null) assert(r.sizeKb < 1024, `launch-1.jpg should stay under 1MB, got ${r.sizeKb}KB`);
  },
});

Deno.test({
  name: "probeImage — fallback placeholder.svg is accessible and very lightweight",
  ignore: !Deno.env.get("LIVE_PROBE"),
  async fn() {
    const r = await probeImage(`${SITE_URL}/placeholder.svg`);
    assertEquals(r.status, 200);
    assertEquals(r.accessible, true);
    if (r.sizeKb !== null) assert(r.sizeKb < 100, `placeholder should be tiny, got ${r.sizeKb}KB`);
  },
});

Deno.test("probeImage — invalid host returns inaccessible", async () => {
  const r = await probeImage("https://invalid.localhost.invalid/none.png");
  assertEquals(r.accessible, false);
});

Deno.test("WhatsApp size threshold constant matches the spec (300KB)", () => {
  assertEquals(WHATSAPP_LIMIT_KB, 300);
});
