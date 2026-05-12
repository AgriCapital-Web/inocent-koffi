import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, Calendar, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import { useLanguage } from "@/hooks/useLanguage";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const FeaturedPosts = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [api, setApi] = useState<CarouselApi | null>(null);
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const { data: posts, isLoading } = useQuery({
    queryKey: ['featured-posts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('id, title, slug, excerpt, featured_image, published_at, author, hashtags, tagline, blog_categories(name, color)')
        .eq('is_published', true)
        .order('published_at', { ascending: false })
        .limit(8);
      if (error) throw error;
      return data;
    }
  });

  const handlePostClick = (slug: string) => {
    navigate(`/blog/${slug}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    if (!api) return;
    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap());
    const onSelect = () => setCurrent(api.selectedScrollSnap());
    api.on("select", onSelect);
    api.on("reInit", onSelect);
    return () => {
      api.off("select", onSelect);
    };
  }, [api]);

  // Autoplay (pause on hover/focus)
  useEffect(() => {
    if (!api || isPaused) return;
    const id = window.setInterval(() => {
      if (api.canScrollNext()) api.scrollNext();
      else api.scrollTo(0);
    }, 4500);
    return () => window.clearInterval(id);
  }, [api, isPaused]);

  if (isLoading) {
    return (
      <section className="py-12 sm:py-16 lg:py-24 bg-gradient-to-br from-background via-muted/30 to-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold">Publications à la Une</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-6xl mx-auto">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse bg-card rounded-2xl overflow-hidden h-72">
                <div className="h-40 bg-muted" />
                <div className="p-4 space-y-2">
                  <div className="h-5 bg-muted rounded w-3/4" />
                  <div className="h-3 bg-muted rounded w-full" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (!posts || posts.length === 0) return null;

  return (
    <section className="py-12 sm:py-16 lg:py-24 bg-gradient-to-br from-background via-muted/30 to-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 sm:mb-12 lg:mb-16">
          <span className="inline-block px-4 py-2 bg-primary/10 text-primary rounded-full text-xs sm:text-sm font-semibold mb-4">
            {t("blog.featured") || "Publications à la Une"}
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-3 sm:mb-4">
            {t("blog.thoughts") || "Réflexions & Vision"}
          </h2>
          <p className="text-sm sm:text-base lg:text-lg text-muted-foreground max-w-2xl mx-auto px-4">
            {t("blog.thoughtsDesc") || "Des réflexions sur l'agriculture, l'entrepreneuriat et la transformation de l'Afrique"}
          </p>
        </div>

        <div
          className="relative max-w-6xl mx-auto"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onFocus={() => setIsPaused(true)}
          onBlur={() => setIsPaused(false)}
        >
          <Carousel
            setApi={setApi}
            opts={{ align: "start", loop: true }}
            className="w-full"
          >
            <CarouselContent className="-ml-3 sm:-ml-4">
              {posts.map((post) => (
                <CarouselItem
                  key={post.id}
                  className="pl-3 sm:pl-4 basis-[88%] sm:basis-1/2 lg:basis-1/3"
                >
                  <article
                    onClick={() => handlePostClick(post.slug)}
                    className="group relative h-full bg-card rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-500 border border-border/60 cursor-pointer flex flex-col"
                  >
                    <div className="relative h-40 sm:h-44 overflow-hidden">
                      {post.featured_image ? (
                        <img
                          src={post.featured_image}
                          alt={post.title}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/20 to-accent/20">
                          <span className="text-4xl font-bold text-primary/30">IK</span>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-card/95 via-card/10 to-transparent" />
                      {(post.blog_categories as any)?.name && (
                        <span
                          className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-full text-[10px] font-semibold text-white shadow-md"
                          style={{ backgroundColor: (post.blog_categories as any)?.color || '#1e40af' }}
                        >
                          {(post.blog_categories as any).name}
                        </span>
                      )}
                    </div>
                    <div className="p-4 sm:p-5 space-y-2 flex-1 flex flex-col">
                      <h3 className="text-base sm:text-lg font-bold text-foreground line-clamp-2 group-hover:text-primary transition-colors leading-snug">
                        {post.title}
                      </h3>
                      {post.excerpt && (
                        <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                          {post.excerpt}
                        </p>
                      )}
                      <div className="mt-auto flex items-center gap-2 pt-3 border-t border-border/60 text-xs text-muted-foreground">
                        <Calendar className="w-3 h-3 text-accent" />
                        <span className="truncate">
                          {post.published_at ? new Date(post.published_at).toLocaleDateString('fr-FR') : ''}
                        </span>
                        <ArrowRight className="w-4 h-4 text-primary ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    </div>
                  </article>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>

          {/* Manual controls */}
          <div className="flex items-center justify-center gap-3 mt-6">
            <button
              onClick={() => api?.scrollPrev()}
              aria-label="Précédent"
              className="w-10 h-10 rounded-full bg-background border border-border shadow-sm hover:bg-muted hover:border-accent flex items-center justify-center transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            >
              <ChevronLeft className="w-5 h-5 text-foreground" />
            </button>
            <div className="flex gap-1.5">
              {Array.from({ length: count }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => api?.scrollTo(i)}
                  aria-label={`Aller à la diapositive ${i + 1}`}
                  className={`h-2 rounded-full transition-all ${
                    i === current ? "w-8 bg-accent" : "w-2 bg-border hover:bg-muted-foreground/40"
                  }`}
                />
              ))}
            </div>
            <button
              onClick={() => api?.scrollNext()}
              aria-label="Suivant"
              className="w-10 h-10 rounded-full bg-background border border-border shadow-sm hover:bg-muted hover:border-accent flex items-center justify-center transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            >
              <ChevronRight className="w-5 h-5 text-foreground" />
            </button>
          </div>
        </div>

        <div className="text-center mt-8 sm:mt-12 lg:mt-16">
          <Button
            asChild
            size="lg"
            className="bg-gradient-to-r from-primary to-primary/90 hover:shadow-lg transition-all group text-sm sm:text-base px-6 sm:px-8"
          >
            <Link to="/blog">
              {t("blog.viewAll") || "Voir tous les articles"}
              <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedPosts;
