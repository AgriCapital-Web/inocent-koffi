import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Eye, Clock, BookOpen, TrendingUp, Users, Globe, BarChart3, Share2, Heart } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

const COLORS = ['hsl(220, 50%, 20%)', 'hsl(45, 90%, 55%)', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

const REACTION_LABELS: Record<string, string> = {
  like: "👍 J'aime",
  love: "❤️ J'adore",
  clap: "👏 Bravo",
  fire: "🔥 Top",
  light: "💡 Inspirant",
  think: "🤔 Intéressant",
};

const AdminArticleStats = () => {
  const { data: posts } = useQuery({
    queryKey: ['admin-posts-stats'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('id, title, slug, view_count, is_published, published_at, created_at')
        .order('view_count', { ascending: false });
      if (error) throw error;
      return data;
    }
  });

  const { data: views } = useQuery({
    queryKey: ['admin-article-views'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('article_views')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(500);
      if (error) throw error;
      return data;
    }
  });

  const { data: shares } = useQuery({
    queryKey: ['admin-article-shares'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('article_shares')
        .select('post_id, platform');
      if (error) throw error;
      return data;
    }
  });

  const { data: likes } = useQuery({
    queryKey: ['admin-article-likes'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('blog_likes')
        .select('post_id, reaction_type');
      if (error) throw error;
      return data;
    }
  });

  const totalViews = posts?.reduce((sum, p) => sum + (p.view_count || 0), 0) || 0;
  const avgReadingProgress = views?.length
    ? Math.round(views.reduce((sum, v) => sum + (v.reading_progress || 0), 0) / views.length)
    : 0;
  const finishedCount = views?.filter(v => v.finished_reading).length || 0;
  const avgTimeSpent = views?.length
    ? Math.round(views.reduce((sum, v) => sum + (v.time_spent_seconds || 0), 0) / views.length)
    : 0;

  const viewsByDay = views?.reduce((acc, v) => {
    const day = new Date(v.created_at).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' });
    acc[day] = (acc[day] || 0) + 1;
    return acc;
  }, {} as Record<string, number>) || {};

  const dailyChartData = Object.entries(viewsByDay).slice(0, 14).reverse().map(([day, count]) => ({ day, vues: count }));

  const referrerData = views?.reduce((acc, v) => {
    let ref = 'Direct';
    if (v.referrer) { try { ref = new URL(v.referrer).hostname; } catch { ref = 'Autre'; } }
    acc[ref] = (acc[ref] || 0) + 1;
    return acc;
  }, {} as Record<string, number>) || {};

  const topReferrers = Object.entries(referrerData)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([name, value]) => ({ name, value }));

  // Per-article breakdown helpers
  const sharesByPost = shares?.reduce((acc, s) => {
    if (!acc[s.post_id]) acc[s.post_id] = {};
    const p = s.platform || 'unknown';
    acc[s.post_id][p] = (acc[s.post_id][p] || 0) + 1;
    return acc;
  }, {} as Record<string, Record<string, number>>) || {};

  const likesByPost = likes?.reduce((acc, l) => {
    if (!acc[l.post_id]) acc[l.post_id] = {};
    const r = l.reaction_type || 'like';
    acc[l.post_id][r] = (acc[l.post_id][r] || 0) + 1;
    return acc;
  }, {} as Record<string, Record<string, number>>) || {};

  const viewsByPost = views?.reduce((acc, v) => {
    if (!acc[v.post_id]) acc[v.post_id] = { total: 0, finished: 0 };
    acc[v.post_id].total += 1;
    if (v.finished_reading) acc[v.post_id].finished += 1;
    return acc;
  }, {} as Record<string, { total: number; finished: number }>) || {};

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total des vues</p>
                <p className="text-3xl font-bold">{totalViews}</p>
              </div>
              <div className="p-3 bg-primary/10 rounded-full"><Eye className="h-6 w-6 text-primary" /></div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Lectures complètes</p>
                <p className="text-3xl font-bold">{finishedCount}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-full"><TrendingUp className="h-6 w-6 text-green-600" /></div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total partages</p>
                <p className="text-3xl font-bold">{shares?.length || 0}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full"><Share2 className="h-6 w-6 text-blue-600" /></div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total réactions</p>
                <p className="text-3xl font-bold">{likes?.length || 0}</p>
              </div>
              <div className="p-3 bg-red-100 rounded-full"><Heart className="h-6 w-6 text-red-500" /></div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><BarChart3 className="w-5 h-5" />Vues quotidiennes</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={dailyChartData}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="vues" fill="hsl(220, 50%, 20%)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><Globe className="w-5 h-5" />Sources de trafic</CardTitle></CardHeader>
          <CardContent>
            {topReferrers.length > 0 ? (
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie data={topReferrers} cx="50%" cy="50%" innerRadius={50} outerRadius={90} dataKey="value"
                    label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}>
                    {topReferrers.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[250px] flex items-center justify-center text-muted-foreground">Pas encore de données</div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Per-article detailed table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Users className="w-5 h-5" />Détails par article</CardTitle>
          <CardDescription>Vues, lectures complètes, réactions par type, partages par réseau</CardDescription>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="min-w-[200px]">Article</TableHead>
                <TableHead>Vues</TableHead>
                <TableHead>Lectures</TableHead>
                <TableHead>Réactions</TableHead>
                <TableHead>Partages</TableHead>
                <TableHead>Statut</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {posts?.map((post) => {
                const pViews = viewsByPost[post.id];
                const pLikes = likesByPost[post.id] || {};
                const pShares = sharesByPost[post.id] || {};
                const totalLikes = Object.values(pLikes).reduce((s, n) => s + n, 0);
                const totalShares = Object.values(pShares).reduce((s, n) => s + n, 0);

                return (
                  <TableRow key={post.id}>
                    <TableCell className="font-medium max-w-[250px]">
                      <span className="line-clamp-2">{post.title}</span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Eye className="w-4 h-4 text-muted-foreground" />
                        <span className="font-semibold">{post.view_count || 0}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="font-semibold">{pViews?.finished || 0}</span>
                    </TableCell>
                    <TableCell>
                      {totalLikes > 0 ? (
                        <div className="flex flex-wrap gap-1">
                          {Object.entries(pLikes).map(([type, count]) => (
                            <Badge key={type} variant="secondary" className="text-xs whitespace-nowrap">
                              {REACTION_LABELS[type]?.split(' ')[0] || '👍'} {count}
                            </Badge>
                          ))}
                        </div>
                      ) : (
                        <span className="text-muted-foreground text-sm">—</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {totalShares > 0 ? (
                        <div className="flex flex-wrap gap-1">
                          {Object.entries(pShares).map(([platform, count]) => (
                            <Badge key={platform} variant="outline" className="text-xs capitalize whitespace-nowrap">
                              {platform} {count}
                            </Badge>
                          ))}
                        </div>
                      ) : (
                        <span className="text-muted-foreground text-sm">—</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge variant={post.is_published ? "default" : "secondary"}>
                        {post.is_published ? "Publié" : "Brouillon"}
                      </Badge>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Recent views */}
      <Card>
        <CardHeader>
          <CardTitle>Dernières visites</CardTitle>
          <CardDescription>Détails des 20 dernières consultations</CardDescription>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Progression</TableHead>
                <TableHead>Temps</TableHead>
                <TableHead>Terminé</TableHead>
                <TableHead>Référent</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {views?.slice(0, 20).map((view) => (
                <TableRow key={view.id}>
                  <TableCell className="text-sm">{new Date(view.created_at).toLocaleString('fr-FR')}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="w-20 h-2 bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-primary rounded-full" style={{ width: `${view.reading_progress || 0}%` }} />
                      </div>
                      <span className="text-xs">{view.reading_progress || 0}%</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm">{Math.floor((view.time_spent_seconds || 0) / 60)}m{(view.time_spent_seconds || 0) % 60}s</TableCell>
                  <TableCell>{view.finished_reading ? <Badge variant="default">✓ Oui</Badge> : <Badge variant="secondary">Non</Badge>}</TableCell>
                  <TableCell className="text-sm text-muted-foreground truncate max-w-[200px]">
                    {view.referrer ? (() => { try { return new URL(view.referrer).hostname; } catch { return 'Direct'; } })() : 'Direct'}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminArticleStats;
