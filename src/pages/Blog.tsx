import { useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Newsletter from "@/components/Newsletter";
import { Helmet } from "react-helmet-async";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, ArrowRight, Search, Tag, X, ChevronLeft, ChevronRight } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/hooks/useLanguage";

const POSTS_PER_PAGE = 12;

const Blog = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { t } = useLanguage();
  
  const categorySlug = searchParams.get("category") || "";
  const searchQuery = searchParams.get("q") || "";
  const currentPage = parseInt(searchParams.get("page") || "1", 10);
  const [localSearch, setLocalSearch] = useState(searchQuery);

  // Fetch categories
  const { data: categories } = useQuery({
    queryKey: ['blog-categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('blog_categories')
        .select('*')
        .order('name');
      if (error) throw error;
      return data;
    }
  });

  // Fetch posts
  const { data: posts, isLoading } = useQuery({
    queryKey: ['blog-posts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*, blog_categories(id, name, slug, color)')
        .eq('is_published', true)
        .order('published_at', { ascending: false });
      if (error) throw error;
      return data;
    }
  });

  const currentCategory = useMemo(() => {
    if (!categorySlug || !categories) return null;
    return categories.find(c => c.slug === categorySlug);
  }, [categorySlug, categories]);

  // Filter posts
  const filteredPosts = useMemo(() => {
    if (!posts) return [];
    let filtered = posts;
    
    if (categorySlug) {
      filtered = filtered.filter(post => 
        (post.blog_categories as any)?.slug === categorySlug
      );
    }
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(post =>
        post.title.toLowerCase().includes(query) ||
        post.excerpt?.toLowerCase().includes(query) ||
        post.content.toLowerCase().includes(query) ||
        post.hashtags?.some((tag: string) => tag.toLowerCase().includes(query))
      );
    }
    
    return filtered;
  }, [posts, categorySlug, searchQuery]);

  // Pagination
  const totalPages = Math.ceil(filteredPosts.length / POSTS_PER_PAGE);
  const paginatedPosts = useMemo(() => {
    const start = (currentPage - 1) * POSTS_PER_PAGE;
    return filteredPosts.slice(start, start + POSTS_PER_PAGE);
  }, [filteredPosts, currentPage]);

  const goToPage = (page: number) => {
    const params = new URLSearchParams(searchParams);
    if (page <= 1) {
      params.delete("page");
    } else {
      params.set("page", String(page));
    }
    setSearchParams(params);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams);
    if (localSearch) {
      params.set("q", localSearch);
    } else {
      params.delete("q");
    }
    params.delete("page");
    setSearchParams(params);
  };

  const handleCategoryClick = (slug: string) => {
    const params = new URLSearchParams(searchParams);
    if (slug === categorySlug) {
      params.delete("category");
    } else {
      params.set("category", slug);
    }
    params.delete("page");
    setSearchParams(params);
  };

  const clearFilters = () => {
    setSearchParams({});
    setLocalSearch("");
  };

  const pageTitle = currentCategory 
    ? `${currentCategory.name} - Blog Inocent KOFFI`
    : "Blog - Inocent KOFFI | Actualités Agriculture Africaine";
  
  const pageDescription = currentCategory
    ? `Articles sur ${currentCategory.name}. ${currentCategory.description || 'Découvrez nos analyses et perspectives sur l\'agriculture africaine.'}`
    : "Suivez l'actualité de la transformation agricole en Afrique. Articles, analyses et perspectives sur l'agriculture durable.";

  const canonicalUrl = currentCategory
    ? `https://ikoffi.agricapital.ci/blog?category=${currentCategory.slug}`
    : "https://ikoffi.agricapital.ci/blog";

  const getReadingTime = (content: string) => Math.max(2, Math.ceil(content.split(' ').length / 200));

  return (
    <>
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <link rel="canonical" href={canonicalUrl} />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:type" content="blog" />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={pageDescription} />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Blog",
            "name": pageTitle,
            "description": pageDescription,
            "url": canonicalUrl,
            "author": { "@type": "Person", "name": "Inocent KOFFI" },
            "publisher": { "@type": "Organization", "name": "AGRICAPITAL SARL" }
          })}
        </script>
      </Helmet>
      
      <div className="min-h-screen">
        <Navbar />
        <main className="pt-20">
          {/* Hero Section */}
          <section className="py-16 bg-gradient-to-br from-background via-secondary/30 to-background">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto text-center">
                <Badge variant="outline" className="mb-4">Blog</Badge>
                <h1 className="text-4xl lg:text-6xl font-bold mb-6 text-foreground">
                  {currentCategory ? (
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
                      {currentCategory.name}
                    </span>
                  ) : (
                    <>
                      <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">Actualités</span> & Perspectives
                    </>
                  )}
                </h1>
                <p className="text-xl text-muted-foreground leading-relaxed mb-8">
                  {currentCategory?.description || "Réflexions, analyses et actualités sur la transformation agricole en Afrique"}
                </p>

                <form onSubmit={handleSearch} className="max-w-xl mx-auto">
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      type="text"
                      placeholder="Rechercher un article..."
                      value={localSearch}
                      onChange={(e) => setLocalSearch(e.target.value)}
                      className="pl-12 pr-4 py-6 text-lg rounded-full border-2 focus:border-primary"
                    />
                    {localSearch && (
                      <button
                        type="button"
                        onClick={() => {
                          setLocalSearch("");
                          const params = new URLSearchParams(searchParams);
                          params.delete("q");
                          params.delete("page");
                          setSearchParams(params);
                        }}
                        className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-muted rounded-full"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </form>
              </div>
            </div>
          </section>

          {/* Categories Filter */}
          <section className="py-8 border-b border-border/50 bg-background/50 backdrop-blur-sm sticky top-16 z-40">
            <div className="container mx-auto px-4">
              <div className="flex flex-wrap items-center justify-center gap-3">
                <button
                  onClick={() => handleCategoryClick("")}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    !categorySlug
                      ? "bg-primary text-primary-foreground shadow-md"
                      : "bg-secondary hover:bg-secondary/80 text-foreground"
                  }`}
                >
                  <Tag className="w-4 h-4" />
                  Tous
                </button>
                
                {categories?.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => handleCategoryClick(category.slug)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                      categorySlug === category.slug
                        ? "shadow-md"
                        : "bg-secondary hover:bg-secondary/80"
                    }`}
                    style={categorySlug === category.slug ? {
                      backgroundColor: category.color || '#1e40af',
                      color: 'white'
                    } : {}}
                  >
                    {category.name}
                    {posts && (
                      <span className="text-xs opacity-75">
                        ({posts.filter(p => (p.blog_categories as any)?.slug === category.slug).length})
                      </span>
                    )}
                  </button>
                ))}
              </div>

              {(categorySlug || searchQuery) && (
                <div className="flex items-center justify-center gap-2 mt-4">
                  <span className="text-sm text-muted-foreground">Filtres actifs:</span>
                  {categorySlug && currentCategory && (
                    <Badge variant="secondary" className="gap-1">
                      {currentCategory.name}
                      <button onClick={() => handleCategoryClick("")}><X className="w-3 h-3" /></button>
                    </Badge>
                  )}
                  {searchQuery && (
                    <Badge variant="secondary" className="gap-1">
                      "{searchQuery}"
                      <button onClick={() => {
                        const params = new URLSearchParams(searchParams);
                        params.delete("q");
                        params.delete("page");
                        setSearchParams(params);
                        setLocalSearch("");
                      }}>
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  )}
                  <button onClick={clearFilters} className="text-sm text-primary hover:underline ml-2">
                    Tout effacer
                  </button>
                </div>
              )}
            </div>
          </section>

          {/* Blog Posts */}
          <section className="py-16 bg-background">
            <div className="container mx-auto px-4">
              <div className="max-w-6xl mx-auto">
                {!isLoading && posts && (
                  <p className="text-muted-foreground mb-8 text-center">
                    {filteredPosts.length} article{filteredPosts.length !== 1 ? 's' : ''} trouvé{filteredPosts.length !== 1 ? 's' : ''}
                    {categorySlug && currentCategory && ` dans "${currentCategory.name}"`}
                    {searchQuery && ` pour "${searchQuery}"`}
                  </p>
                )}

                {isLoading ? (
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
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
                ) : paginatedPosts.length > 0 ? (
                  <>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {paginatedPosts.map((post) => (
                        <Card 
                          key={post.id}
                          className="group overflow-hidden hover:shadow-xl transition-all duration-300 border-border/50 hover:border-accent/50"
                        >
                          <div className="relative h-48 overflow-hidden bg-muted">
                            {post.featured_image ? (
                              <img 
                                src={post.featured_image} 
                                alt={post.title}
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                loading="lazy"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/20 to-accent/20">
                                <span className="text-4xl font-bold text-primary/30">IK</span>
                              </div>
                            )}
                            {(post.blog_categories as any)?.name && (
                              <Badge 
                                className="absolute top-3 left-3"
                                style={{ 
                                  backgroundColor: (post.blog_categories as any)?.color || '#1e40af',
                                  color: 'white'
                                }}
                              >
                                {(post.blog_categories as any)?.name}
                              </Badge>
                            )}
                          </div>
                          <CardContent className="p-6 space-y-4">
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <Calendar className="w-4 h-4" />
                                <span>{new Date(post.published_at || post.created_at).toLocaleDateString('fr-FR')}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Clock className="w-4 h-4" />
                                <span>{getReadingTime(post.content)} min</span>
                              </div>
                            </div>
                            <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors line-clamp-2">
                              {post.title}
                            </h3>
                            {post.excerpt && (
                              <p className="text-muted-foreground line-clamp-2">{post.excerpt}</p>
                            )}
                            {post.hashtags && post.hashtags.length > 0 && (
                              <div className="flex flex-wrap gap-1">
                                {post.hashtags.slice(0, 3).map((tag: string, idx: number) => (
                                  <span key={idx} className="text-xs text-primary">#{tag}</span>
                                ))}
                              </div>
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

                    {/* Pagination */}
                    {totalPages > 1 && (
                      <div className="flex items-center justify-center gap-2 mt-12">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => goToPage(currentPage - 1)}
                          disabled={currentPage <= 1}
                          className="gap-1"
                        >
                          <ChevronLeft className="w-4 h-4" />
                          Précédent
                        </Button>
                        
                        <div className="flex items-center gap-1">
                          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                            // Show first, last, current, and adjacent pages
                            if (
                              page === 1 || 
                              page === totalPages || 
                              Math.abs(page - currentPage) <= 1
                            ) {
                              return (
                                <Button
                                  key={page}
                                  variant={page === currentPage ? "default" : "outline"}
                                  size="sm"
                                  onClick={() => goToPage(page)}
                                  className="w-9 h-9 p-0"
                                >
                                  {page}
                                </Button>
                              );
                            }
                            // Show ellipsis
                            if (
                              (page === 2 && currentPage > 3) ||
                              (page === totalPages - 1 && currentPage < totalPages - 2)
                            ) {
                              return <span key={page} className="px-1 text-muted-foreground">…</span>;
                            }
                            return null;
                          })}
                        </div>

                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => goToPage(currentPage + 1)}
                          disabled={currentPage >= totalPages}
                          className="gap-1"
                        >
                          Suivant
                          <ChevronRight className="w-4 h-4" />
                        </Button>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="text-center py-20">
                    <div className="w-20 h-20 rounded-full bg-secondary flex items-center justify-center mx-auto mb-6">
                      <Search className="w-10 h-10 text-muted-foreground" />
                    </div>
                    <h3 className="text-2xl font-bold text-foreground mb-4">Aucun article trouvé</h3>
                    <p className="text-muted-foreground max-w-md mx-auto mb-6">
                      {searchQuery 
                        ? `Aucun résultat pour "${searchQuery}"${categorySlug ? ` dans cette catégorie` : ''}.`
                        : categorySlug 
                          ? `Aucun article dans cette catégorie pour le moment.`
                          : `Les articles seront bientôt publiés.`
                      }
                    </p>
                    {(categorySlug || searchQuery) && (
                      <button onClick={clearFilters} className="text-primary hover:underline font-medium">
                        Voir tous les articles
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          </section>

          <Newsletter />
        </main>
        <Footer />
      </div>
    </>
  );
};

export default Blog;
