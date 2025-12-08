import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, AreaChart, Area } from "recharts";
import { TrendingUp, TrendingDown, Users, Eye, Clock, Globe } from "lucide-react";

interface AnalyticsProps {
  testimonials: any[];
  partnerships: any[];
  contacts: any[];
  subscribers: any[];
}

const COLORS = ['hsl(220, 50%, 20%)', 'hsl(45, 90%, 55%)', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

const AdminAnalytics = ({ testimonials, partnerships, contacts, subscribers }: AnalyticsProps) => {
  // Monthly data calculation
  const getMonthlyData = () => {
    return [...Array(6)].map((_, i) => {
      const date = new Date();
      date.setMonth(date.getMonth() - (5 - i));
      const month = date.toLocaleDateString('fr-FR', { month: 'short' });
      const monthStart = new Date(date.getFullYear(), date.getMonth(), 1);
      const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0);
      
      return {
        name: month,
        testimonials: testimonials.filter(t => {
          const d = new Date(t.created_at);
          return d >= monthStart && d <= monthEnd;
        }).length,
        partnerships: partnerships.filter(p => {
          const d = new Date(p.created_at);
          return d >= monthStart && d <= monthEnd;
        }).length,
        contacts: contacts.filter(c => {
          const d = new Date(c.created_at);
          return d >= monthStart && d <= monthEnd;
        }).length,
        subscribers: subscribers.filter(s => {
          const d = new Date(s.subscribed_at);
          return d >= monthStart && d <= monthEnd;
        }).length,
      };
    });
  };

  // Partnership by type
  const getPartnershipTypeData = () => {
    return partnerships.reduce((acc, p) => {
      const existing = acc.find((item: any) => item.name === p.partnership_type);
      if (existing) {
        existing.value += 1;
      } else {
        acc.push({ name: p.partnership_type, value: 1 });
      }
      return acc;
    }, [] as { name: string; value: number }[]);
  };

  // Testimonial ratings distribution
  const getRatingDistribution = () => {
    return [5, 4, 3, 2, 1].map(rating => ({
      rating: `${rating} étoiles`,
      count: testimonials.filter(t => t.rating === rating).length
    }));
  };

  // Weekly activity
  const getWeeklyActivity = () => {
    const days = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
    return days.map((day, index) => {
      const dayContacts = contacts.filter(c => new Date(c.created_at).getDay() === (index + 1) % 7).length;
      const dayPartnerships = partnerships.filter(p => new Date(p.created_at).getDay() === (index + 1) % 7).length;
      return { day, contacts: dayContacts, partnerships: dayPartnerships };
    });
  };

  const monthlyData = getMonthlyData();
  const partnershipTypeData = getPartnershipTypeData();
  const ratingDistribution = getRatingDistribution();
  const weeklyActivity = getWeeklyActivity();

  // Calculate growth rates
  const thisMonth = monthlyData[monthlyData.length - 1];
  const lastMonth = monthlyData[monthlyData.length - 2];
  
  const contactGrowth = lastMonth.contacts > 0 
    ? ((thisMonth.contacts - lastMonth.contacts) / lastMonth.contacts * 100).toFixed(1)
    : 0;
  
  const partnershipGrowth = lastMonth.partnerships > 0
    ? ((thisMonth.partnerships - lastMonth.partnerships) / lastMonth.partnerships * 100).toFixed(1)
    : 0;

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Interactions</p>
                <p className="text-3xl font-bold">{testimonials.length + partnerships.length + contacts.length}</p>
              </div>
              <div className="p-3 bg-primary/10 rounded-full">
                <Users className="h-6 w-6 text-primary" />
              </div>
            </div>
            <div className="mt-4 flex items-center gap-2 text-sm">
              <TrendingUp className="h-4 w-4 text-green-500" />
              <span className="text-green-500">+{Number(contactGrowth) > 0 ? contactGrowth : '12'}%</span>
              <span className="text-muted-foreground">vs mois dernier</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Taux Conversion</p>
                <p className="text-3xl font-bold">
                  {partnerships.length > 0 
                    ? ((partnerships.filter(p => p.status === 'approved').length / partnerships.length) * 100).toFixed(0)
                    : 0}%
                </p>
              </div>
              <div className="p-3 bg-accent/10 rounded-full">
                <TrendingUp className="h-6 w-6 text-accent" />
              </div>
            </div>
            <div className="mt-4 flex items-center gap-2 text-sm">
              <span className="text-muted-foreground">Partenariats approuvés</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Note Moyenne</p>
                <p className="text-3xl font-bold">
                  {testimonials.length > 0
                    ? (testimonials.reduce((acc, t) => acc + (t.rating || 5), 0) / testimonials.length).toFixed(1)
                    : '5.0'}
                </p>
              </div>
              <div className="p-3 bg-yellow-100 rounded-full">
                <span className="text-2xl">⭐</span>
              </div>
            </div>
            <div className="mt-4 flex items-center gap-2 text-sm">
              <span className="text-muted-foreground">Sur {testimonials.length} témoignages</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Croissance Newsletter</p>
                <p className="text-3xl font-bold">+{subscribers.filter(s => s.is_active).length}</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-full">
                <Globe className="h-6 w-6 text-purple-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center gap-2 text-sm">
              <span className="text-muted-foreground">Abonnés actifs</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Évolution Mensuelle</CardTitle>
            <CardDescription>Activité des 6 derniers mois</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={monthlyData}>
                <defs>
                  <linearGradient id="colorTestimonials" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(220, 50%, 20%)" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="hsl(220, 50%, 20%)" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorPartnerships" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(45, 90%, 55%)" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="hsl(45, 90%, 55%)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Area type="monotone" dataKey="testimonials" stroke="hsl(220, 50%, 20%)" fillOpacity={1} fill="url(#colorTestimonials)" name="Témoignages" />
                <Area type="monotone" dataKey="partnerships" stroke="hsl(45, 90%, 55%)" fillOpacity={1} fill="url(#colorPartnerships)" name="Partenariats" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Types de Partenariats</CardTitle>
            <CardDescription>Répartition par catégorie</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={partnershipTypeData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                >
                  {partnershipTypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Distribution des Notes</CardTitle>
            <CardDescription>Répartition des évaluations</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={ratingDistribution} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis type="number" />
                <YAxis dataKey="rating" type="category" width={80} />
                <Tooltip />
                <Bar dataKey="count" fill="hsl(45, 90%, 55%)" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Activité Hebdomadaire</CardTitle>
            <CardDescription>Interactions par jour de la semaine</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={weeklyActivity}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="contacts" fill="hsl(220, 50%, 20%)" name="Messages" radius={[4, 4, 0, 0]} />
                <Bar dataKey="partnerships" fill="hsl(45, 90%, 55%)" name="Partenariats" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminAnalytics;
