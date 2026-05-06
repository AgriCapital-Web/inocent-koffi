import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AdminOGAudit from "@/components/admin/AdminOGAudit";
import { Card } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

/**
 * Public OG audit report — accessible to any signed-in user.
 * Re-uses the AdminOGAudit component so sorting, fallbacks display
 * and resource links are kept in sync with the admin view.
 */
export default function OGReport() {
  const [ready, setReady] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { data } = await supabase.auth.getSession();
      if (cancelled) return;
      if (!data.session) {
        navigate("/login?redirect=/og-report", { replace: true });
        return;
      }
      setReady(true);
    })();
    return () => { cancelled = true; };
  }, [navigate]);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-10 max-w-6xl">
        <Card className="p-6 mb-6 bg-gradient-to-br from-primary/5 to-accent/5">
          <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">Rapport OG Audit</h1>
          <p className="text-sm text-muted-foreground">
            Visualisation publique (accès connecté requis) — tri par erreurs,
            chaîne de fallbacks et liens directs vers chaque ressource analysée.
          </p>
        </Card>
        {ready ? <AdminOGAudit /> : (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}