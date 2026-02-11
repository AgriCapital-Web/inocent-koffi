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
import { Calendar, Clock, ArrowLeft, User, Tag, Share2, Eye } from "lucide-react";

const BlogArticle = () => {
  const { slug } = useParams<{ slug: string }>();
  const viewTracked = useRef(false);
  const viewId = useRef<string | null>(null);
  const startTime = useRef(Date.now());
  const contentRef = useRef<HTMLDivElement>(null);
  const [readingProgress, setReadingProgress] = useState(0);

  const { data: post, isLoading, error } = useQuery({
    queryKey: ['blog-post', slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('slug', slug)
        .eq('is_published', true)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!slug,
  });

  const { data: relatedPosts } = useQuery({
    queryKey: ['related-posts', slug],
    queryFn: async () => {
      const { data } = await supabase
        .from('blog_posts')
        .select('id, title, slug, featured_image, published_at, excerpt, view_count')
        .eq('is_published', true)
        .neq('slug', slug)
        .order('published_at', { ascending: false })
        .limit(3);
      return data || [];
    },
    enabled: !!slug,
  });

  // Track view on mount
  useEffect(() => {
    if (!post || viewTracked.current) return;
    viewTracked.current = true;
    startTime.current = Date.now();

    const sessionId = localStorage.getItem('session_id') || (() => {
      const id = crypto.randomUUID();
      localStorage.setItem('session_id', id);
      return id;
    })();

    supabase.from('article_views').insert({
      post_id: post.id,
      session_id: sessionId,
      referrer: document.referrer || null,
      user_agent: navigator.userAgent,
    }).select('id').single().then(({ data }) => {
      if (data) viewId.current = data.id;
    });
  }, [post]);

  // Track reading progress
  useEffect(() => {
    if (!contentRef.current) return;

    const handleScroll = () => {
      const el = contentRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const totalHeight = el.scrollHeight;
      const scrolled = Math.max(0, -rect.top + windowHeight);
      const progress = Math.min(100, Math.round((scrolled / totalHeight) * 100));
      setReadingProgress(progress);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [post]);

  // Update view on unmount
  useEffect(() => {
    return () => {
      if (viewId.current) {
        const timeSpent = Math.round((Date.now() - startTime.current) / 1000);
        supabase.from('article_views').update({
          reading_progress: readingProgress,
          time_spent_seconds: timeSpent,
          finished_reading: readingProgress >= 90,
        }).eq('id', viewId.current).then(() => {});
      }
    };
  }, [readingProgress]);

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
            <Button asChild><Link to="/blog"><ArrowLeft className="w-4 h-4 mr-2" />Retour au blog</Link></Button>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const readingTime = Math.ceil(post.content.split(' ').length / 200);
  const publishedDate = post.published_at ? new Date(post.published_at).toLocaleDateString('fr-FR', {
    day: 'numeric', month: 'long', year: 'numeric'
  }) : '';
  const articleUrl = `https://ikoffi.agricapital.ci/blog/${post.slug}`;

  return (
    <>
      <Helmet>
        <title>{post.title} - Blog AGRICAPITAL | Inocent KOFFI</title>
        <meta name="description" content={post.excerpt || post.title} />
        <link rel="canonical" href={articleUrl} />
        <meta property="og:type" content="article" />
        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={post.excerpt || post.title} />
        {post.featured_image && <meta property="og:image" content={post.featured_image} />}
        <meta property="og:url" content={articleUrl} />
        <meta property="article:published_time" content={post.published_at || post.created_at} />
        <meta property="article:author" content="Inocent KOFFI" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={post.title} />
        <meta name="twitter:description" content={post.excerpt || post.title} />
        {post.featured_image && <meta name="twitter:image" content={post.featured_image} />}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            "headline": post.title,
            "image": post.featured_image,
            "datePublished": post.published_at || post.created_at,
            "dateModified": post.created_at,
            "author": { "@type": "Person", "name": "Inocent KOFFI", "url": "https://ikoffi.agricapital.ci" },
            "publisher": { "@type": "Organization", "name": "AGRICAPITAL SARL", "logo": { "@type": "ImageObject", "url": "https://ikoffi.agricapital.ci/favicon.png" } },
            "description": post.excerpt || post.title,
            "mainEntityOfPage": { "@type": "WebPage", "@id": articleUrl }
          })}
        </script>
      </Helmet>

      {/* Reading progress bar */}
      <div className="fixed top-0 left-0 w-full h-1 bg-muted z-[100]">
        <div className="h-full bg-primary transition-all duration-150" style={{ width: `${readingProgress}%` }} />
      </div>

      <div className="min-h-screen">
        <Navbar />
        <main className="pt-20">
          <article className="container mx-auto px-4 py-12 max-w-4xl" ref={contentRef}>
            <Button variant="ghost" asChild className="mb-6">
              <Link to="/blog"><ArrowLeft className="w-4 h-4 mr-2" />Retour au blog</Link>
            </Button>

            <header className="mb-8">
              <Badge variant="outline" className="mb-4"><Tag className="w-3 h-3 mr-1" />Article</Badge>
              <h1 className="text-3xl md:text-5xl font-bold mb-4 text-foreground leading-tight">{post.title}</h1>
              {post.tagline && <p className="text-xl text-primary font-medium mb-4 italic">{post.tagline}</p>}

              <div className="flex flex-wrap items-center gap-4 text-muted-foreground mb-6">
                <div className="flex items-center gap-2"><User className="w-4 h-4" /><span>{post.author || "Inocent KOFFI"}</span></div>
                <div className="flex items-center gap-2"><Calendar className="w-4 h-4" /><time dateTime={post.published_at || post.created_at}>{publishedDate}</time></div>
                <div className="flex items-center gap-2"><Clock className="w-4 h-4" /><span>{readingTime} min de lecture</span></div>
                <div className="flex items-center gap-2"><Eye className="w-4 h-4" /><span>{post.view_count || 0} vues</span></div>
              </div>

              {post.hashtags && post.hashtags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-6">
                  {post.hashtags.map((tag: string, i: number) => (
                    <span key={i} className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">#{tag}</span>
                  ))}
                </div>
              )}

              <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg">
                <BlogLikes postId={post.id} />
                <SocialSharePopup url={articleUrl} title={post.title} description={post.excerpt || ''}>
                  <Button variant="outline" size="sm" className="gap-2"><Share2 className="w-4 h-4" />Partager</Button>
                </SocialSharePopup>
              </div>
            </header>

            {post.featured_image && (
              <div className="relative mb-10 rounded-2xl overflow-hidden shadow-xl border-l-4 border-t-4 border-l-accent border-t-accent border-r-4 border-b-4 border-r-primary border-b-primary">
                <img src={post.featured_image} alt={post.title} className="w-full h-auto max-h-[500px] object-cover" loading="eager" />
              </div>
            )}

            <div className="prose prose-lg max-w-none dark:prose-invert prose-headings:text-foreground prose-p:text-muted-foreground prose-a:text-primary prose-strong:text-foreground prose-img:rounded-xl prose-blockquote:border-l-primary prose-blockquote:bg-muted/50 prose-blockquote:py-2 prose-blockquote:px-4 prose-blockquote:rounded-r-lg"
              dangerouslySetInnerHTML={{ __html: post.content }} />

            <div className="mt-12 pt-8 border-t">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-4">
                  <BlogLikes postId={post.id} />
                  <SocialSharePopup url={articleUrl} title={post.title} description={post.excerpt || ''}>
                    <Button variant="outline" className="gap-2"><Share2 className="w-4 h-4" />Partager cet article</Button>
                  </SocialSharePopup>
                </div>
                <Button asChild><Link to="/blog">Voir plus d'articles</Link></Button>
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
                    <Card key={related.id} className="group overflow-hidden hover:shadow-lg transition-all cursor-pointer" onClick={() => window.location.href = `/blog/${related.slug}`}>
                      {related.featured_image && (
                        <div className="relative h-40 overflow-hidden">
                          <img src={related.featured_image} alt={related.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" loading="lazy" />
                        </div>
                      )}
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <p className="text-sm text-muted-foreground">{related.published_at && new Date(related.published_at).toLocaleDateString('fr-FR')}</p>
                          <div className="flex items-center gap-1 text-xs text-muted-foreground"><Eye className="w-3 h-3" />{related.view_count || 0}</div>
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
