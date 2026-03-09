import { useState, useEffect } from "react";
import { Users, Wifi } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const BASE_VISITORS = 132;

const VisitorCounter = () => {
  const [totalCount, setTotalCount] = useState<number | null>(null);
  const [onlineCount, setOnlineCount] = useState<number>(1);

  useEffect(() => {
    const sessionId = localStorage.getItem('session_id') || (() => {
      const id = crypto.randomUUID();
      localStorage.setItem('session_id', id);
      return id;
    })();

    // Register/update this visitor
    const registerVisitor = async () => {
      await supabase.from('site_visitors').upsert({
        session_id: sessionId,
        is_online: true,
        last_active: new Date().toISOString(),
        user_agent: navigator.userAgent,
      }, { onConflict: 'session_id' });
    };

    const fetchCounts = async () => {
      // Total unique visitors
      const { count: total } = await supabase
        .from('site_visitors')
        .select('id', { count: 'exact', head: true });
      
      setTotalCount(BASE_VISITORS + (total || 0));

      // Online visitors (active in last 5 min)
      const fiveMinAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString();
      const { count: online } = await supabase
        .from('site_visitors')
        .select('id', { count: 'exact', head: true })
        .eq('is_online', true)
        .gte('last_active', fiveMinAgo);
      
      setOnlineCount(Math.max(1, online || 1));
    };

    registerVisitor().then(fetchCounts);

    // Heartbeat every 2 min
    const heartbeat = setInterval(() => {
      supabase.from('site_visitors').upsert({
        session_id: sessionId,
        is_online: true,
        last_active: new Date().toISOString(),
      }, { onConflict: 'session_id' });
    }, 120000);

    // Set offline on page leave
    const handleVisibilityChange = () => {
      if (document.hidden) {
        supabase.from('site_visitors').update({ is_online: false }).eq('session_id', sessionId);
      } else {
        supabase.from('site_visitors').upsert({
          session_id: sessionId,
          is_online: true,
          last_active: new Date().toISOString(),
        }, { onConflict: 'session_id' });
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      clearInterval(heartbeat);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      supabase.from('site_visitors').update({ is_online: false }).eq('session_id', sessionId);
    };
  }, []);

  if (totalCount === null) return null;

  return (
    <div className="flex items-center gap-2 text-xs text-muted-foreground" title="Visiteurs">
      <div className="flex items-center gap-1">
        <Users className="w-3.5 h-3.5" />
        <span className="font-medium">{totalCount.toLocaleString('fr-FR')}</span>
      </div>
      <span className="text-border">|</span>
      <div className="flex items-center gap-1">
        <Wifi className="w-3 h-3 text-green-500" />
        <span className="font-medium text-green-600">{onlineCount}</span>
      </div>
    </div>
  );
};

export default VisitorCounter;
