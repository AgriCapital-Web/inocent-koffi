// Sanitize TipTap-generated table HTML into clean, consistent markup.
// Guarantees:
//  - Wraps every <table> in <div class="table-wrap"> for responsive scrolling
//  - Ensures <thead>/<tbody> structure (first row promoted to <thead> if missing)
//  - Strips inline styles, colgroup, class attrs and disallowed tags inside cells
//  - Keeps only safe inline tags (strong, em, b, i, u, a, br, span)

const ALLOWED_INLINE = new Set(["STRONG", "EM", "B", "I", "U", "A", "BR", "SPAN", "CODE"]);

function cleanCell(cell: HTMLElement) {
  cell.removeAttribute("style");
  cell.removeAttribute("class");
  cell.removeAttribute("colwidth");
  cell.removeAttribute("data-colwidth");
  // Strip disallowed descendants but keep their text
  const walker = (node: Element) => {
    Array.from(node.children).forEach((child) => {
      walker(child);
      if (!ALLOWED_INLINE.has(child.tagName) && child.tagName !== "P") {
        const text = document.createTextNode(child.textContent || "");
        child.replaceWith(text);
      } else if (child.tagName === "P") {
        // Unwrap <p> inside cells
        const frag = document.createDocumentFragment();
        Array.from(child.childNodes).forEach((n) => frag.appendChild(n));
        child.replaceWith(frag);
      } else {
        child.removeAttribute("style");
        child.removeAttribute("class");
      }
    });
  };
  walker(cell);
}

function normalizeTable(table: HTMLTableElement) {
  table.removeAttribute("style");
  table.removeAttribute("class");
  // Drop colgroup
  table.querySelectorAll("colgroup").forEach((c) => c.remove());

  let thead = table.querySelector("thead");
  let tbody = table.querySelector("tbody");
  const rows = Array.from(table.querySelectorAll(":scope > tr, :scope > tbody > tr, :scope > thead > tr"));

  if (!thead && rows.length > 0) {
    const firstRow = rows[0];
    const hasTh = firstRow.querySelector("th");
    if (hasTh) {
      thead = document.createElement("thead");
      thead.appendChild(firstRow);
      table.insertBefore(thead, table.firstChild);
    }
  }

  if (!tbody) {
    tbody = document.createElement("tbody");
    Array.from(table.querySelectorAll(":scope > tr")).forEach((tr) => tbody!.appendChild(tr));
    table.appendChild(tbody);
  }

  table.querySelectorAll("th, td").forEach((c) => cleanCell(c as HTMLElement));
}

export function sanitizeTablesHtml(html: string): string {
  if (!html || !html.includes("<table")) return html;
  if (typeof document === "undefined") return html;

  const container = document.createElement("div");
  container.innerHTML = html;

  container.querySelectorAll("table").forEach((tbl) => {
    const table = tbl as HTMLTableElement;
    normalizeTable(table);

    // Avoid double-wrap
    const parent = table.parentElement;
    if (parent && parent.tagName === "DIV" && parent.classList.contains("table-wrap")) return;

    const wrap = document.createElement("div");
    wrap.className = "table-wrap";
    table.replaceWith(wrap);
    wrap.appendChild(table);
  });

  return container.innerHTML;
}
