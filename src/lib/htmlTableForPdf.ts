/**
 * Convert a TipTap-exported HTML fragment into PDF-ready HTML tables.
 *
 * TipTap may export tables without explicit <thead>/<tbody>, with inline styles
 * that don't print well, or wrapped in scrollable containers (.table-wrap).
 * For PDF/CSV exports we need:
 *   - <thead> populated with the first row
 *   - <tbody> for the remaining rows
 *   - inline styles stripped, replaced with print-friendly classes
 *   - no horizontal scroll wrappers (would clip in print)
 */
export function tiptapTablesToPdfHtml(html: string): string {
  if (!html || typeof html !== "string") return "";
  if (typeof DOMParser === "undefined") return html; // SSR / Deno guard

  const doc = new DOMParser().parseFromString(`<div>${html}</div>`, "text/html");
  const root = doc.body.firstElementChild as HTMLElement | null;
  if (!root) return html;

  // Unwrap .table-wrap / scroll containers
  root.querySelectorAll(".table-wrap, .table-responsive").forEach((wrap) => {
    while (wrap.firstChild) wrap.parentNode?.insertBefore(wrap.firstChild, wrap);
    wrap.remove();
  });

  root.querySelectorAll("table").forEach((table) => {
    table.removeAttribute("style");
    table.removeAttribute("class");
    table.setAttribute("class", "pdf-table");

    // Strip styles on cells/rows
    table.querySelectorAll("th, td, tr").forEach((el) => {
      el.removeAttribute("style");
      el.removeAttribute("class");
      el.removeAttribute("colwidth");
    });

    // Ensure thead/tbody structure
    const hasThead = !!table.querySelector("thead");
    const hasTbody = !!table.querySelector("tbody");
    const rows = Array.from(table.querySelectorAll(":scope > tr"));
    if (rows.length && !hasThead && !hasTbody) {
      const thead = doc.createElement("thead");
      const tbody = doc.createElement("tbody");
      const [first, ...rest] = rows;
      // Convert first row's td to th if needed
      first.querySelectorAll("td").forEach((td) => {
        const th = doc.createElement("th");
        th.innerHTML = td.innerHTML;
        td.replaceWith(th);
      });
      thead.appendChild(first);
      rest.forEach((r) => tbody.appendChild(r));
      table.appendChild(thead);
      table.appendChild(tbody);
    } else if (!hasThead) {
      // Promote first tbody row as thead if first row is all <th>
      const tbody = table.querySelector("tbody");
      const first = tbody?.querySelector("tr");
      if (first && Array.from(first.children).every((c) => c.tagName === "TH")) {
        const thead = doc.createElement("thead");
        thead.appendChild(first);
        table.insertBefore(thead, tbody!);
      }
    }
  });

  return root.innerHTML;
}

/** Default print-friendly CSS for the converted tables. */
export const PDF_TABLE_CSS = `
  .pdf-table{width:100%;border-collapse:collapse;margin:8px 0;font-size:11px;page-break-inside:auto}
  .pdf-table thead{display:table-header-group}
  .pdf-table tr{page-break-inside:avoid;page-break-after:auto}
  .pdf-table th,.pdf-table td{border:1px solid #cbd5e1;padding:6px 8px;text-align:left;vertical-align:top}
  .pdf-table th{background:#f1f5f9;font-weight:600}
  .pdf-table caption{font-size:10px;color:#64748b;text-align:left;padding-bottom:4px;caption-side:top}
`;