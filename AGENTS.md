# Architecture rules
- Use the existing public services, realisations, sites and blog_posts tables for public content; do not depend on absent imported schemas, so administration remains the source of truth.
- Combine published realisations and sites in the portfolio adapter and the published Studio folder in Réalisations; keep processing tools only in the existing administration.
- Derive the local favicon and touch icon from the supplied official logo; keep image CDN pointers for page assets.
