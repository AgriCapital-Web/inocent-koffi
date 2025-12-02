import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Newsletter from "@/components/Newsletter";
import { Helmet } from "react-helmet-async";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, Clock, ArrowRight } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const Blog = () => {
  const { data: posts, isLoading } = useQuery({
    queryKey: ['blog-posts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('is_published', true)
        .order('published_at', { ascending: false });
      
      if (error) throw error;
      return data;
    }
  });

  return (
    <>
      <Helmet>
        <title>Blog - Inocent KOFFI | Actualités Agriculture Africaine</title>
        <meta name="description" content="Suivez l'actualité de la transformation agricole en Afrique. Articles, analyses et perspectives sur l'agriculture durable." />
        <link rel="canonical" href="https://www.ikoffi.agricapital.ci/blog" />
      </Helmet>
      <div className="min-h-screen">
        <Navbar />
        <main className="pt-20">
          {/* Hero Section */}
          <section className="py-20 bg-gradient-to-br from-background via-secondary/30 to-background">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto text-center">
                <Badge variant="outline" className="mb-4">Blog</Badge>
                <h1 className="text-4xl lg:text-6xl font-bold mb-6 text-foreground">
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">Actualités</span> & Perspectives
                </h1>
                <p className="text-xl text-muted-foreground leading-relaxed">
                  Réflexions, analyses et actualités sur la transformation agricole en Afrique
                </p>
              </div>
            </div>
          </section>

          {/* Blog Posts */}
          <section className="py-20 bg-background">
            <div className="container mx-auto px-4">
              <div className="max-w-6xl mx-auto">
                {isLoading ? (
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3].map((i) => (
                      <Card key={i} className="animate-pulse">
                        <div className="h-48 bg-muted rounded-t-lg"></div>
                        <CardContent className="p-6 space-y-4">
                          <div className="h-4 bg-muted rounded w-1/3"></div>
                          <div className="h-6 bg-muted rounded"></div>
                          <div className="h-4 bg-muted rounded w-2/3"></div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : posts && posts.length > 0 ? (
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {posts.map((post) => (
                      <Card 
                        key={post.id}
                        className="group overflow-hidden hover:shadow-xl transition-all duration-300 border-border/50 hover:border-accent/50"
                      >
                        {post.featured_image && (
                          <div className="relative h-48 overflow-hidden">
                            <img 
                              src={post.featured_image} 
                              alt={post.title}
                              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                              loading="lazy"
                            />
                          </div>
                        )}
                        <CardContent className="p-6 space-y-4">
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              <span>{new Date(post.published_at || post.created_at).toLocaleDateString('fr-FR')}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              <span>5 min</span>
                            </div>
                          </div>
                          <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                            {post.title}
                          </h3>
                          {post.excerpt && (
                            <p className="text-muted-foreground line-clamp-2">
                              {post.excerpt}
                            </p>
                          )}
                          <a 
                            href={`/blog/${post.slug}`}
                            className="inline-flex items-center gap-2 text-primary font-medium hover:gap-3 transition-all"
                          >
                            Lire la suite
                            <ArrowRight className="w-4 h-4" />
                          </a>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-20">
                    <div className="w-20 h-20 rounded-full bg-secondary flex items-center justify-center mx-auto mb-6">
                      <Calendar className="w-10 h-10 text-muted-foreground" />
                    </div>
                    <h3 className="text-2xl font-bold text-foreground mb-4">Bientôt disponible</h3>
                    <p className="text-muted-foreground max-w-md mx-auto">
                      Les articles de blog seront bientôt publiés. Inscrivez-vous à la newsletter pour être informé des nouvelles publications.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* Newsletter */}
          <Newsletter />
        </main>
        <Footer />
      </div>
    </>
  );
};

export default Blog;
