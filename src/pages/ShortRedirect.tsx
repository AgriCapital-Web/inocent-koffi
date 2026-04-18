import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { parseShortCode } from "@/lib/shortUrl";

const ShortRedirect = () => {
  const { code } = useParams<{ code: string }>();
  const navigate = useNavigate();

  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (!code) {
        navigate("/blog", { replace: true });
        return;
      }
      const parsed = parseShortCode(code);
      if (!parsed) {
        navigate("/blog", { replace: true });
        return;
      }

      const { data } = await supabase
        .from("blog_posts")
        .select("slug, published_at")
        .eq("article_number", parsed.num)
        .eq("is_published", true)
        .maybeSingle();

      if (cancelled) return;

      if (!data) {
        navigate("/blog", { replace: true });
        return;
      }

      // Validate year matches if available
      if (data.published_at) {
        const yearOk = (new Date(data.published_at).getFullYear() % 1000) === parsed.yearShort;
        if (!yearOk) {
          navigate("/blog", { replace: true });
          return;
        }
      }

      navigate(`/blog/${data.slug}`, { replace: true });
    })();
    return () => { cancelled = true; };
  }, [code, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-muted-foreground">Redirection vers l'article…</p>
      </div>
    </div>
  );
};

export default ShortRedirect;
