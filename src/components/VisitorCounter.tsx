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
      await supabase.rpc('upsert_site_visitor', {
        _session_id: sessionId,
        _user_agent: navigator.userAgent,
      });
    };

    const fetchCounts = async () => {
      const { data } = await supabase.rpc('get_visitor_counts');
      const row = Array.isArray(data) ? data[0] : data;
      setTotalCount(BASE_VISITORS + Number(row?.total_count ?? 0));
      setOnlineCount(Math.max(1, Number(row?.online_count ?? 1)));
    };

    registerVisitor().then(fetchCounts);

    // Heartbeat every 2 min
    const heartbeat = setInterval(() => {
      supabase.rpc('upsert_site_visitor', {
        _session_id: sessionId,
        _user_agent: navigator.userAgent,
      });
    }, 120000);

    // Set offline on page leave
    const handleVisibilityChange = () => {
      if (document.hidden) {
        supabase.rpc('set_visitor_offline', { _session_id: sessionId });
      } else {
        supabase.rpc('upsert_site_visitor', {
          _session_id: sessionId,
          _user_agent: navigator.userAgent,
        });
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      clearInterval(heartbeat);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      supabase.rpc('set_visitor_offline', { _session_id: sessionId });
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
