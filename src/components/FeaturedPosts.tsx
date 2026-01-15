import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/hooks/useLanguage";

const FeaturedPosts = () => {
  const { t } = useLanguage();

  const posts = [
    {
      id: 1,
      title: "Numérique, IA, start-up… et si l'Afrique remettait l'essentiel au centre ?",
      excerpt: "Aujourd'hui, on nous explique partout que le numérique est la richesse de demain. On encourage massivement les jeunes à se tourner vers le digital, les start-up, l'IA, le code… Mais ce n'est pas toute la vérité. Aucune grande puissance économique ne s'est construite uniquement sur des lignes de code.",
      quote: "Un homme qui a faim n'est pas un homme libre. — Félix Houphouët-Boigny",
      image: "/images/blog/post-agriculture-vision.jpg",
      hashtags: ["#Agriculture", "#Vision", "#Afrique", "#Leadership"],
      author: "Inocent KOFFI",
      role: "Visionnaire Agro & Impact Communautaire",
    },
    {
      id: 2,
      title: "Être entrepreneur ne se résume pas à avoir une idée",
      excerpt: "Il existe deux postures : les porteurs de projet et les porteurs de vision. Les premiers identifient un besoin et exécutent. Les seconds interrogent le sens, la durabilité et l'impact à long terme. La vraie différence n'est pas dans la taille du projet, mais dans la profondeur de la vision.",
      quote: "Être entrepreneur, c'est créer de la valeur. Être porteur de vision, c'est inscrire cette valeur dans le temps et dans la société.",
      image: "/images/blog/post-entrepreneur-vision.png",
      hashtags: ["#Entrepreneuriat", "#Vision", "#Leadership", "#Impact"],
      author: "Inocent KOFFI",
      role: "Fondateur & DG – AGRICAPITAL SARL",
    },
  ];

  return (
    <section className="py-12 sm:py-16 lg:py-24 bg-gradient-to-br from-background via-muted/30 to-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
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

        {/* Posts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-10 max-w-6xl mx-auto">
          {posts.map((post) => (
            <article
              key={post.id}
              className="group relative bg-card rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 border-l-4 border-t-4 border-l-accent border-t-accent border-r-4 border-b-4 border-r-primary border-b-primary"
            >
              {/* Image Container */}
              <div className="relative h-48 sm:h-56 lg:h-64 overflow-hidden">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent opacity-80"></div>
              </div>

              {/* Content */}
              <div className="p-4 sm:p-6 lg:p-8 space-y-3 sm:space-y-4">
                <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-foreground line-clamp-2 group-hover:text-primary transition-colors">
                  {post.title}
                </h3>

                <p className="text-sm sm:text-base text-muted-foreground line-clamp-3 leading-relaxed">
                  {post.excerpt}
                </p>

                {/* Quote */}
                <blockquote className="border-l-4 border-accent pl-3 sm:pl-4 py-2 italic text-xs sm:text-sm text-muted-foreground bg-muted/50 rounded-r-lg">
                  "{post.quote}"
                </blockquote>

                {/* Hashtags */}
                <div className="flex flex-wrap gap-1 sm:gap-2">
                  {post.hashtags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 sm:px-3 py-0.5 sm:py-1 bg-primary/10 text-primary rounded-full text-xs font-medium"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Author */}
                <div className="flex items-center gap-2 sm:gap-3 pt-2 sm:pt-4 border-t border-border">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-primary-foreground font-bold text-xs sm:text-sm">
                    IK
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-foreground text-sm sm:text-base truncate">{post.author}</p>
                    <p className="text-xs sm:text-sm text-muted-foreground truncate">{post.role}</p>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* CTA Button */}
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
