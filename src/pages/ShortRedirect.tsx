import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

/**
 * Legacy short-link endpoint.
 * The former implementation depended on the removed blog_posts table.
 * The canonical article URL is now /actualites/:slug; because legacy short codes
 * are no longer backed by a persistent article-number field, they safely
 * resolve to the publications index instead of querying a dead source.
 */
const ShortRedirect = () => {
  const navigate = useNavigate();

  useEffect(() => {
    navigate("/actualites", { replace: true });
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-muted-foreground">Redirection vers les actualités…</p>
      </div>
    </div>
  );
};

export default ShortRedirect;
