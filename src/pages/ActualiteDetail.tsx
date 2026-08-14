import { Helmet } from "react-helmet-async";
import { Link, useParams } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import NotFound from "@/pages/NotFound";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, CalendarDays, ExternalLink } from "lucide-react";
import { actualites, getActualite } from "@/data/agricapitalUpdates";
import { useSyncedActualites } from "@/hooks/useSyncedActualites";
import { BreadcrumbJsonLd, SITE_URL } from "@/components/SeoJsonLd";
import { trackCta } from "@/lib/analytics";

const ActualiteDetail = () => {
  const { slug } = useParams();
  const { data: synced, isLoading } = useSyncedActualites();
  const item = getActualite(slug) ?? (synced ?? []).find((a) => a.slug === slug);

  if (!item) {
    if (isLoading) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      );
    }
    return <NotFound />;
  }

  const url = `${SITE_URL}/actualites/${item.slug}`;
  const related = [...actualites, ...(synced ?? [])]
    .filter((a) => a.slug !== item.slug)
    .slice(0, 3);

  const newsJsonLd = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: item.title,
    description: item.excerpt,
    datePublished: item.date,
    dateModified: item.date,
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    url,
    isBasedOn: item.sourceUrl,
    image: {
      "@type": "ImageObject",
      url: item.image,
      caption: item.imageAlt,
      width: 1200,
      height: 750,
    },
    author: { "@type": "Person", name: "Inocent KOFFI", url: SITE_URL },
    publisher: {
      "@type": "Organization",
      name: "AGRICAPITAL SARL",
      url: "https://agricapital.ci",
      logo: { "@type": "ImageObject", url: `${SITE_URL}/logo-agricapital.png` },
    },
    about: { "@type": "Organization", name: "AGRICAPITAL SARL" },
  };

  return (
    <>
      <Helmet>
        <title>{`${item.title} | Actualités AgriCapital — Inocent KOFFI`}</title>
        <meta name="description" content={item.excerpt.slice(0, 155)} />
        <link rel="canonical" href={url} />
        <meta property="og:type" content="article" />
        <meta property="og:title" content={item.title} />
        <meta property="og:description" content={item.excerpt.slice(0, 200)} />
        <meta property="og:url" content={url} />
        <meta property="og:image" content={item.image} />
        <meta property="og:image:alt" content={item.imageAlt} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={item.title} />
        <meta name="twitter:image" content={item.image} />
        <meta property="article:published_time" content={item.date} />
        <meta property="article:author" content="Inocent KOFFI" />
        <script type="application/ld+json">{JSON.stringify(newsJsonLd)}</script>
      </Helmet>
      <BreadcrumbJsonLd
        items={[
          { name: "Actualités", path: "/actualites" },
          { name: item.title, path: `/actualites/${item.slug}` },
        ]}
      />

      <div className="min-h-screen">
        <Navbar />
        <main className="pt-20">
          <article className="py-10 sm:py-16">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl">
              <Link
                to="/actualites"
                className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6"
              >
                <ArrowLeft className="w-4 h-4" aria-hidden="true" />
                Toutes les actualités
              </Link>

              <div className="flex flex-wrap items-center gap-3 mb-4">
                <Badge variant="secondary">{item.category}</Badge>
                <span className="text-sm text-muted-foreground inline-flex items-center gap-1">
                  <CalendarDays className="w-4 h-4" aria-hidden="true" />
                  <time dateTime={item.date}>{item.dateLabel}</time>
                </span>
              </div>

              <h1 className="font-display text-3xl sm:text-4xl font-bold text-foreground leading-tight mb-6">
                {item.title}
              </h1>

              <figure className="mb-8">
                <img
                  src={item.image}
                  alt={item.imageAlt}
                  width={1200}
                  height={750}
                  className="w-full rounded-2xl border border-border/60 object-cover"
                  loading="eager"
                  decoding="async"
                />
                <figcaption className="text-xs text-muted-foreground mt-2">{item.imageAlt}</figcaption>
              </figure>

              <div className="space-y-4">
                {item.content.map((p, i) => (
                  <p key={i} className="text-foreground/90 leading-relaxed text-justify">
                    {p}
                  </p>
                ))}
              </div>

              <aside className="mt-10 rounded-2xl border border-border/60 bg-secondary/30 p-5 sm:p-6">
                <p className="text-sm text-muted-foreground">
                  <strong className="text-foreground">Source :</strong> contenu officiel publié par
                  AGRICAPITAL SARL. Texte repris intégralement, sans modification.
                </p>
                <div className="flex flex-wrap gap-3 mt-4">
                  <Button asChild>
                    <a
                      href={item.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => trackCta("agricapital_source", "actualite_detail")}
                    >
                      <ExternalLink className="w-4 h-4 mr-2" aria-hidden="true" />
                      Voir sur AgriCapital
                    </a>
                  </Button>
                  <Button asChild variant="outline">
                    <Link to="/agricapital">Le projet AGRICAPITAL</Link>
                  </Button>
                  <Button asChild variant="ghost">
                    <Link to="/contact">Contacter Inocent KOFFI</Link>
                  </Button>
                </div>
              </aside>

              <section className="mt-14">
                <h2 className="font-display text-2xl font-bold text-foreground mb-6">À lire aussi</h2>
                <div className="grid gap-5 sm:grid-cols-3">
                  {related.map((r) => (
                    <Link
                      key={r.slug}
                      to={`/actualites/${r.slug}`}
                      className="group rounded-xl border border-border/60 bg-card overflow-hidden hover:border-primary/40 transition-colors"
                    >
                      <div className="aspect-[16/10] overflow-hidden">
                        <img
                          src={r.image}
                          alt={r.imageAlt}
                          width={600}
                          height={375}
                          loading="lazy"
                          decoding="async"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                      <p className="p-4 text-sm font-medium text-foreground leading-snug">{r.title}</p>
                    </Link>
                  ))}
                </div>
                <div className="mt-8">
                  <Button asChild variant="outline">
                    <Link to="/a-propos">
                      Le parcours d'Inocent KOFFI
                      <ArrowRight className="w-4 h-4 ml-2" aria-hidden="true" />
                    </Link>
                  </Button>
                </div>
              </section>
            </div>
          </article>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default ActualiteDetail;
