import { useState, useEffect } from "react";
import { Users } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const VisitorCounter = () => {
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    // Track this visit
    const sessionId = localStorage.getItem('session_id') || (() => {
      const id = crypto.randomUUID();
      localStorage.setItem('session_id', id);
      return id;
    })();

    // Get total unique visitors from article_views (unique sessions)
    const fetchCount = async () => {
      const { count: totalViews } = await supabase
        .from('article_views')
        .select('session_id', { count: 'exact', head: true });
      
      // Also count site visits stored in localStorage
      const siteVisits = parseInt(localStorage.getItem('site_visit_count') || '0') + 1;
      localStorage.setItem('site_visit_count', String(siteVisits));
      
      setCount((totalViews || 0) + siteVisits);
    };

    fetchCount();
  }, []);

  if (count === null) return null;

  return (
    <div className="flex items-center gap-1.5 text-xs text-muted-foreground" title="Visiteurs">
      <Users className="w-3.5 h-3.5" />
      <span className="font-medium">{count.toLocaleString('fr-FR')}</span>
    </div>
  );
};

export default VisitorCounter;
