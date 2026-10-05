import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40 px-4">
      <div className="text-center max-w-md">
        <h1 className="mb-4 text-5xl font-bold text-foreground">404</h1>
        <p className="mb-2 text-xl font-semibold text-foreground">Page introuvable</p>
        <p className="mb-6 text-muted-foreground">
          La page que vous recherchez n'existe pas ou a été déplacée.
        </p>
        <a
          href="/"
          className="inline-flex items-center justify-center rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:opacity-90 transition-opacity"
        >
          Retour à l'accueil
        </a>
      </div>
    </div>
  );
};

export default NotFound;
