import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/hooks/useLanguage";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const FeaturedPosts = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();

  const { data: posts, isLoading } = useQuery({
    queryKey: ['featured-posts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('id, title, slug, excerpt, featured_image, published_at, author, hashtags, tagline, blog_categories(name, color)')
        .eq('is_published', true)
        .order('published_at', { ascending: false })
        .limit(4);
      if (error) throw error;
      return data;
    }
  });

  const handlePostClick = (slug: string) => {
    navigate(`/blog/${slug}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (isLoading) {
    return (
      <section className="py-12 sm:py-16 lg:py-24 bg-gradient-to-br from-background via-muted/30 to-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold">Publications à la Une</h2>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-6xl mx-auto">
            {[1, 2].map((i) => (
              <div key={i} className="animate-pulse bg-card rounded-2xl overflow-hidden h-96">
                <div className="h-56 bg-muted" />
                <div className="p-6 space-y-3">
                  <div className="h-6 bg-muted rounded w-3/4" />
                  <div className="h-4 bg-muted rounded w-full" />
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-10 max-w-6xl mx-auto">
          {posts.slice(0, 4).map((post) => (
            <article
              key={post.id}
              onClick={() => handlePostClick(post.slug)}
              className="group relative bg-card rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 border-l-4 border-t-4 border-l-accent border-t-accent border-r-4 border-b-4 border-r-primary border-b-primary cursor-pointer"
            >
              <div className="relative h-48 sm:h-56 lg:h-64 overflow-hidden">
                {post.featured_image ? (
                  <img
                    src={post.featured_image}
                    alt={post.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    loading="lazy"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/20 to-accent/20">
                    <span className="text-5xl font-bold text-primary/30">IK</span>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent opacity-80"></div>
                {(post.blog_categories as any)?.name && (
                  <span 
                    className="absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-semibold text-white"
                    style={{ backgroundColor: (post.blog_categories as any)?.color || '#1e40af' }}
                  >
                    {(post.blog_categories as any).name}
                  </span>
                )}
              </div>

              <div className="p-4 sm:p-6 lg:p-8 space-y-3 sm:space-y-4">
                <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-foreground line-clamp-2 group-hover:text-primary transition-colors">
                  {post.title}
                </h3>

                {post.excerpt && (
                  <p className="text-sm sm:text-base text-muted-foreground line-clamp-3 leading-relaxed">
                    {post.excerpt}
                  </p>
                )}

                {post.hashtags && post.hashtags.length > 0 && (
                  <div className="flex flex-wrap gap-1 sm:gap-2">
                    {post.hashtags.slice(0, 4).map((tag: string) => (
                      <span
                        key={tag}
                        className="px-2 sm:px-3 py-0.5 sm:py-1 bg-primary/10 text-primary rounded-full text-xs font-medium"
                      >
                        #{tag.replace('#', '')}
                      </span>
                    ))}
                  </div>
                )}

                <div className="flex items-center gap-2 sm:gap-3 pt-2 sm:pt-4 border-t border-border">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-primary-foreground font-bold text-xs sm:text-sm">
                    IK
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-foreground text-sm sm:text-base truncate">{post.author || "Inocent KOFFI"}</p>
                    <p className="text-xs sm:text-sm text-muted-foreground flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {post.published_at ? new Date(post.published_at).toLocaleDateString('fr-FR') : ''}
                    </p>
                  </div>
                  <ArrowRight className="w-5 h-5 text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </div>
            </article>
          ))}
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
