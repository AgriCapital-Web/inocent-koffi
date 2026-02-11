import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Eye, Clock, BookOpen, TrendingUp, Users, Globe, BarChart3 } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

const COLORS = ['hsl(220, 50%, 20%)', 'hsl(45, 90%, 55%)', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

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

  const totalViews = posts?.reduce((sum, p) => sum + (p.view_count || 0), 0) || 0;
  const avgReadingProgress = views?.length 
    ? Math.round(views.reduce((sum, v) => sum + (v.reading_progress || 0), 0) / views.length) 
    : 0;
  const finishedCount = views?.filter(v => v.finished_reading).length || 0;
  const avgTimeSpent = views?.length 
    ? Math.round(views.reduce((sum, v) => sum + (v.time_spent_seconds || 0), 0) / views.length) 
    : 0;

  // Views per day chart data
  const viewsByDay = views?.reduce((acc, v) => {
    const day = new Date(v.created_at).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' });
    acc[day] = (acc[day] || 0) + 1;
    return acc;
  }, {} as Record<string, number>) || {};

  const dailyChartData = Object.entries(viewsByDay).slice(0, 14).reverse().map(([day, count]) => ({ day, vues: count }));

  // Top referrers
  const referrerData = views?.reduce((acc, v) => {
    const ref = v.referrer ? new URL(v.referrer).hostname : 'Direct';
    acc[ref] = (acc[ref] || 0) + 1;
    return acc;
  }, {} as Record<string, number>) || {};

  const topReferrers = Object.entries(referrerData)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([name, value]) => ({ name, value }));

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
                <p className="text-sm text-muted-foreground">Progression moyenne</p>
                <p className="text-3xl font-bold">{avgReadingProgress}%</p>
              </div>
              <div className="p-3 bg-accent/10 rounded-full"><BookOpen className="h-6 w-6 text-accent" /></div>
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
                <p className="text-sm text-muted-foreground">Temps moyen</p>
                <p className="text-3xl font-bold">{Math.floor(avgTimeSpent / 60)}:{String(avgTimeSpent % 60).padStart(2, '0')}</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-full"><Clock className="h-6 w-6 text-purple-600" /></div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><BarChart3 className="w-5 h-5" />Vues quotidiennes</CardTitle>
          </CardHeader>
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
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Globe className="w-5 h-5" />Sources de trafic</CardTitle>
          </CardHeader>
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

      {/* Articles ranking */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Users className="w-5 h-5" />Classement des articles par vues</CardTitle>
          <CardDescription>Articles triés par nombre de vues</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>#</TableHead>
                <TableHead>Article</TableHead>
                <TableHead>Vues</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {posts?.map((post, i) => (
                <TableRow key={post.id}>
                  <TableCell className="font-bold">{i + 1}</TableCell>
                  <TableCell className="font-medium max-w-[300px] truncate">{post.title}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Eye className="w-4 h-4 text-muted-foreground" />
                      <span className="font-semibold">{post.view_count || 0}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={post.is_published ? "default" : "secondary"}>
                      {post.is_published ? "Publié" : "Brouillon"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {new Date(post.published_at || post.created_at).toLocaleDateString('fr-FR')}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Recent views detail */}
      <Card>
        <CardHeader>
          <CardTitle>Dernières visites</CardTitle>
          <CardDescription>Détails des 20 dernières consultations</CardDescription>
        </CardHeader>
        <CardContent>
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
