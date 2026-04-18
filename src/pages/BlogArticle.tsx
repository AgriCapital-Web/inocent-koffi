import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { Helmet } from "react-helmet-async";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Newsletter from "@/components/Newsletter";
import SocialSharePopup from "@/components/SocialSharePopup";
import BlogCommentsEnhanced from "@/components/BlogCommentsEnhanced";
import BlogLikes from "@/components/BlogLikes";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Calendar, Clock, ArrowLeft, User, Tag, Share2, Eye, MessageSquare, Heart, Images } from "lucide-react";

const SITE_URL = (import.meta.env.VITE_SITE_URL || "https://ikoffi.agricapital.ci").replace(/\/$/, "");

const stripHtml = (value: string) => value.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
const truncate = (value: string, max = 220) => (value.length > max ? `${value.slice(0, max - 1).trim()}…` : value);

const BlogArticle = () => {
  const { slug } = useParams<{ slug: string }>();
  const viewTracked = useRef(false);
  const viewId = useRef<string | null>(null);
  const startTime = useRef(Date.now());
  const contentRef = useRef<HTMLDivElement>(null);
  const readingProgressRef = useRef(0);
  const [readingProgress, setReadingProgress] = useState(0);

  const { data: post, isLoading, error } = useQuery({
    queryKey: ["blog-post", slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("blog_posts")
        .select("*")
        .eq("slug", slug)
        .eq("is_published", true)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!slug,
  });

  const { data: relatedPosts } = useQuery({
    queryKey: ["related-posts", slug],
    queryFn: async () => {
      const { data } = await supabase
        .from("blog_posts")
        .select("id, title, slug, featured_image, published_at, excerpt, view_count")
        .eq("is_published", true)
        .neq("slug", slug)
        .order("published_at", { ascending: false })
        .limit(3);
      return data || [];
    },
    enabled: !!slug,
  });

  const { data: galleryMedia } = useQuery({
    queryKey: ["blog-gallery", post?.id],
    enabled: !!post?.id,
    queryFn: async () => {
      const { data } = await supabase
        .from("blog_media")
        .select("file_url, file_name, file_type, sort_order")
        .eq("post_id", post.id)
        .order("sort_order", { ascending: true });
      return (data || []).filter((m) => m.file_type?.startsWith("image/"));
    },
  });

  const { data: engagementStats } = useQuery({
    queryKey: ["article-engagement", post?.id],
    enabled: !!post?.id,
    refetchInterval: 15000,
    queryFn: async () => {
      const [viewsRes, readsRes, sharesRes, reactionsRes] = await Promise.all([
        supabase.from("article_views").select("id", { count: "exact", head: true }).eq("post_id", post.id),
        supabase
          .from("article_views")
          .select("id", { count: "exact", head: true })
          .eq("post_id", post.id)
          .eq("finished_reading", true),
        supabase.from("article_shares").select("id", { count: "exact", head: true }).eq("post_id", post.id),
        supabase.from("blog_likes").select("id", { count: "exact", head: true }).eq("post_id", post.id),
      ]);

      return {
        views: viewsRes.count || 0,
        reads: readsRes.count || 0,
        shares: sharesRes.count || 0,
        reactions: reactionsRes.count || 0,
      };
    },
  });

  useEffect(() => {
    if (!post || viewTracked.current) return;
    viewTracked.current = true;
    startTime.current = Date.now();

    const sessionId = localStorage.getItem("session_id") || (() => {
      const id = crypto.randomUUID();
      localStorage.setItem("session_id", id);
      return id;
    })();

    supabase
      .from("article_views")
      .insert({
        post_id: post.id,
        session_id: sessionId,
        referrer: document.referrer || null,
        user_agent: navigator.userAgent,
      })
      .select("id")
      .single()
      .then(({ data, error }) => {
        if (!error && data) viewId.current = data.id;
      });
  }, [post]);

  useEffect(() => {
    if (!post || !contentRef.current) return;

    const handleScroll = () => {
      const el = contentRef.current;
      if (!el) return;

      const rect = el.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const totalHeight = Math.max(el.scrollHeight, 1);
      const scrolled = Math.max(0, -rect.top + windowHeight);
      const progress = Math.min(100, Math.round((scrolled / totalHeight) * 100));
      readingProgressRef.current = progress;
      setReadingProgress(progress);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [post]);

  // Reliable tracking of finished_reading using sendBeacon on unload + visibilitychange
  useEffect(() => {
    const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
    const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

    const sendUpdate = (useBeacon = false) => {
      if (!viewId.current) return;
      const timeSpent = Math.max(1, Math.round((Date.now() - startTime.current) / 1000));
      const payload = {
        reading_progress: readingProgressRef.current,
        time_spent_seconds: timeSpent,
        finished_reading: readingProgressRef.current >= 85,
      };

      if (useBeacon && navigator.sendBeacon && SUPABASE_URL && SUPABASE_KEY) {
        const url = `${SUPABASE_URL}/rest/v1/article_views?id=eq.${viewId.current}`;
        const blob = new Blob([JSON.stringify(payload)], { type: "application/json" });
        // sendBeacon doesn't support custom headers — fallback to fetch with keepalive
        try {
          fetch(url, {
            method: "PATCH",
            keepalive: true,
            headers: {
              "Content-Type": "application/json",
              apikey: SUPABASE_KEY,
              Authorization: `Bearer ${SUPABASE_KEY}`,
              Prefer: "return=minimal",
            },
            body: JSON.stringify(payload),
          });
        } catch {
          navigator.sendBeacon(url, blob);
        }
      } else {
        supabase.from("article_views").update(payload).eq("id", viewId.current).then(() => {});
      }
    };

    const onVisibilityChange = () => {
      if (document.visibilityState === "hidden") sendUpdate(true);
    };
    const onBeforeUnload = () => sendUpdate(true);
    const onPageHide = () => sendUpdate(true);

    // Also send periodic updates every 30s to capture progress reliably
    const interval = setInterval(() => sendUpdate(false), 30000);

    document.addEventListener("visibilitychange", onVisibilityChange);
    window.addEventListener("beforeunload", onBeforeUnload);
    window.addEventListener("pagehide", onPageHide);

    return () => {
      clearInterval(interval);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      window.removeEventListener("beforeunload", onBeforeUnload);
      window.removeEventListener("pagehide", onPageHide);
      sendUpdate(true);
    };
  }, []);

  if (isLoading) {
    return (
      <>
        <Navbar />
        <main className="pt-20 min-h-screen">
          <div className="container mx-auto px-4 py-12 max-w-4xl">
            <Skeleton className="h-8 w-32 mb-6" />
            <Skeleton className="h-12 w-full mb-4" />
            <Skeleton className="h-6 w-64 mb-8" />
            <Skeleton className="h-96 w-full mb-8 rounded-xl" />
            <div className="space-y-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (error || !post) {
    return (
      <>
        <Navbar />
        <main className="pt-20 min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">Article non trouvé</h1>
            <p className="text-muted-foreground mb-6">L'article que vous recherchez n'existe pas ou a été supprimé.</p>
            <Button asChild>
              <Link to="/blog">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Retour au blog
              </Link>
            </Button>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const readingTime = Math.ceil(stripHtml(post.content).split(" ").filter(Boolean).length / 200);
  const publishedDate = post.published_at
    ? new Date(post.published_at).toLocaleDateString("fr-FR", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "";

  const articleUrl = `${SITE_URL}/blog/${post.slug}`;
  const featuredMediaUrl = post.featured_image
    ? post.featured_image.startsWith("http")
      ? post.featured_image
      : `${SITE_URL}${post.featured_image.startsWith("/") ? "" : "/"}${post.featured_image}`
    : `${SITE_URL}/og-image.png`;
  const articleSummary = truncate(post.excerpt || post.tagline || stripHtml(post.content) || post.title);

  return (
    <>
      <Helmet>
        <title>{post.title} - Blog | Inocent KOFFI</title>
        <meta name="description" content={articleSummary} />
        <link rel="canonical" href={articleUrl} />

        <meta property="og:type" content="article" />
        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={articleSummary} />
        <meta property="og:image" content={featuredMediaUrl} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:url" content={articleUrl} />
        <meta property="og:site_name" content="Inocent KOFFI" />
        <meta property="article:published_time" content={post.published_at || post.created_at} />
        <meta property="article:author" content="Inocent KOFFI" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={post.title} />
        <meta name="twitter:description" content={articleSummary} />
        <meta name="twitter:image" content={featuredMediaUrl} />

        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            headline: post.title,
            image: [featuredMediaUrl],
            datePublished: post.published_at || post.created_at,
            dateModified: post.updated_at || post.created_at,
            author: { "@type": "Person", name: "Inocent KOFFI", url: SITE_URL },
            publisher: {
              "@type": "Organization",
              name: "AGRICAPITAL SARL",
              logo: { "@type": "ImageObject", url: `${SITE_URL}/favicon.png` },
            },
            description: articleSummary,
            mainEntityOfPage: { "@type": "WebPage", "@id": articleUrl },
          })}
        </script>
      </Helmet>

      <div className="fixed top-0 left-0 w-full h-1 bg-muted z-[100]">
        <div className="h-full bg-primary transition-all duration-150" style={{ width: `${readingProgress}%` }} />
      </div>

      <div className="min-h-screen">
        <Navbar />
        <main className="pt-20">
          <article className="container mx-auto px-4 py-12 max-w-4xl" ref={contentRef}>
            <Button variant="ghost" asChild className="mb-6">
              <Link to="/blog">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Retour au blog
              </Link>
            </Button>

            <header className="mb-8 space-y-6">
              {post.featured_image && (
                <div className="relative rounded-2xl overflow-hidden shadow-xl border border-border">
                  {post.featured_image.match(/\.(mp4|webm|ogg|mov)(\?|$)/i) ? (
                    <video
                      src={featuredMediaUrl}
                      className="w-full h-auto max-h-[520px] object-cover"
                      controls
                      preload="metadata"
                      playsInline
                    />
                  ) : (
                    <img
                      src={featuredMediaUrl}
                      alt={post.title}
                      className="w-full h-auto max-h-[520px] object-cover"
                      loading="eager"
                      decoding="async"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = "none";
                      }}
                    />
                  )}
                </div>
              )}

              <div>
                <Badge variant="outline" className="mb-4">
                  <Tag className="w-3 h-3 mr-1" />
                  Article
                </Badge>
                <h1 className="text-3xl md:text-5xl font-bold mb-4 text-foreground leading-tight">{post.title}</h1>
                {post.tagline && <p className="text-xl text-primary font-medium mb-4 italic">{post.tagline}</p>}

                <div className="flex flex-wrap items-center gap-4 text-muted-foreground mb-6">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    <span>{post.author || "Inocent KOFFI"}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <time dateTime={post.published_at || post.created_at}>{publishedDate}</time>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span>{readingTime} min de lecture</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                  <div className="rounded-lg border bg-card p-3">
                    <p className="text-xs text-muted-foreground">Vues</p>
                    <p className="text-lg font-semibold flex items-center gap-1">
                      <Eye className="w-4 h-4 text-primary" />
                      {engagementStats?.views ?? post.view_count ?? 0}
                    </p>
                  </div>
                  <div className="rounded-lg border bg-card p-3">
                    <p className="text-xs text-muted-foreground">Lectures complètes</p>
                    <p className="text-lg font-semibold flex items-center gap-1">
                      <MessageSquare className="w-4 h-4 text-primary" />
                      {engagementStats?.reads ?? 0}
                    </p>
                  </div>
                  <div className="rounded-lg border bg-card p-3">
                    <p className="text-xs text-muted-foreground">Partages</p>
                    <p className="text-lg font-semibold flex items-center gap-1">
                      <Share2 className="w-4 h-4 text-primary" />
                      {engagementStats?.shares ?? 0}
                    </p>
                  </div>
                  <div className="rounded-lg border bg-card p-3">
                    <p className="text-xs text-muted-foreground">Réactions</p>
                    <p className="text-lg font-semibold flex items-center gap-1">
                      <Heart className="w-4 h-4 text-primary" />
                      {engagementStats?.reactions ?? 0}
                    </p>
                  </div>
                </div>

                {post.hashtags && post.hashtags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-6">
                    {post.hashtags.map((tag: string, i: number) => (
                      <span key={i} className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}

                <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg border">
                  <BlogLikes postId={post.id} />
                  <SocialSharePopup url={articleUrl} title={post.title} description={articleSummary} image={featuredMediaUrl}>
                    <Button variant="outline" size="sm" className="gap-2">
                      <Share2 className="w-4 h-4" />
                      Partager
                    </Button>
                  </SocialSharePopup>
                </div>
              </div>
            </header>

            <div className="article-content max-w-none" dangerouslySetInnerHTML={{ __html: post.content }} />

            {galleryMedia && galleryMedia.length > 0 && (
              <section className="mt-12 pt-8 border-t" aria-label="Galerie d'images">
                <div className="flex items-center gap-2 mb-6">
                  <Images className="w-5 h-5 text-primary" />
                  <h2 className="text-2xl font-bold text-foreground">Galerie</h2>
                  <span className="text-sm text-muted-foreground">({galleryMedia.length} image{galleryMedia.length > 1 ? "s" : ""})</span>
                </div>
                <Carousel opts={{ align: "start", loop: true }} className="w-full">
                  <CarouselContent>
                    {galleryMedia.map((m, i) => (
                      <CarouselItem key={i} className="md:basis-1/2 lg:basis-1/2">
                        <div className="rounded-2xl overflow-hidden border border-border shadow-md aspect-[4/3] bg-muted">
                          <img
                            src={m.file_url}
                            alt={`${post.title} — illustration ${i + 1}`}
                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                            loading="lazy"
                          />
                        </div>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <CarouselPrevious className="left-2" />
                  <CarouselNext className="right-2" />
                </Carousel>
              </section>
            )}

            <div className="mt-12 pt-8 border-t">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-4">
                  <BlogLikes postId={post.id} />
                  <SocialSharePopup url={articleUrl} title={post.title} description={articleSummary} image={featuredMediaUrl}>
                    <Button variant="outline" className="gap-2">
                      <Share2 className="w-4 h-4" />
                      Partager cet article
                    </Button>
                  </SocialSharePopup>
                </div>
                <Button asChild>
                  <Link to="/blog">Voir plus d'articles</Link>
                </Button>
              </div>
            </div>

            <BlogCommentsEnhanced postId={post.id} />
          </article>

          {relatedPosts && relatedPosts.length > 0 && (
            <section className="py-16 bg-muted/30">
              <div className="container mx-auto px-4">
                <h2 className="text-2xl font-bold mb-8 text-center">Articles similaires</h2>
                <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
                  {relatedPosts.map((related) => (
                    <Card
                      key={related.id}
                      className="group overflow-hidden hover:shadow-lg transition-all cursor-pointer"
                      onClick={() => (window.location.href = `/blog/${related.slug}`)}
                    >
                      {related.featured_image && (
                        <div className="relative h-40 overflow-hidden">
                          <img
                            src={related.featured_image.startsWith("http") ? related.featured_image : `${SITE_URL}${related.featured_image}`}
                            alt={related.title}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                            loading="lazy"
                          />
                        </div>
                      )}
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <p className="text-sm text-muted-foreground">
                            {related.published_at && new Date(related.published_at).toLocaleDateString("fr-FR")}
                          </p>
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Eye className="w-3 h-3" />
                            {related.view_count || 0}
                          </div>
                        </div>
                        <h3 className="font-semibold line-clamp-2 group-hover:text-primary transition-colors">{related.title}</h3>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </section>
          )}

          <Newsletter />
        </main>
        <Footer />
      </div>
    </>
  );
};

export default BlogArticle;
