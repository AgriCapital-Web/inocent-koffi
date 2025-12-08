import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { 
  Users, MessageSquare, Handshake, Star, Mail, 
  LogOut, Search, Check, X, Trash2, Eye, 
  BarChart3, TrendingUp, Calendar, Download, FileText, Plus
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from "recharts";
import RichTextEditor from "@/components/RichTextEditor";

interface Testimonial {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string | null;
  locality: string;
  message: string;
  rating: number | null;
  is_approved: boolean;
  created_at: string;
  photo_url: string | null;
}

interface PartnershipRequest {
  id: string;
  company_name: string;
  contact_name: string;
  email: string;
  phone: string;
  partnership_type: string;
  message: string;
  website: string | null;
  status: string;
  created_at: string;
}

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  message: string;
  created_at: string;
}

interface NewsletterSubscriber {
  id: string;
  email: string;
  is_active: boolean;
  subscribed_at: string;
}

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string | null;
  featured_image: string | null;
  is_published: boolean;
  published_at: string | null;
  created_at: string;
}

const COLORS = ['hsl(var(--primary))', 'hsl(var(--secondary))', '#10B981', '#F59E0B', '#EF4444'];

const Admin = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedItem, setSelectedItem] = useState<Testimonial | PartnershipRequest | ContactMessage | null>(null);
  const [dialogType, setDialogType] = useState<string>("");

  // Blog editor state
  const [showBlogEditor, setShowBlogEditor] = useState(false);
  const [editingBlog, setEditingBlog] = useState<BlogPost | null>(null);
  const [blogTitle, setBlogTitle] = useState("");
  const [blogSlug, setBlogSlug] = useState("");
  const [blogContent, setBlogContent] = useState("");
  const [blogExcerpt, setBlogExcerpt] = useState("");
  const [blogImage, setBlogImage] = useState("");

  // Data states
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [partnerships, setPartnerships] = useState<PartnershipRequest[]>([]);
  const [contacts, setContacts] = useState<ContactMessage[]>([]);
  const [subscribers, setSubscribers] = useState<NewsletterSubscriber[]>([]);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);

  // Stats
  const [stats, setStats] = useState({
    totalTestimonials: 0,
    pendingTestimonials: 0,
    totalPartnerships: 0,
    pendingPartnerships: 0,
    totalContacts: 0,
    totalSubscribers: 0,
    totalBlogPosts: 0,
  });

  useEffect(() => {
    checkAdminAccess();
  }, []);

  const checkAdminAccess = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        navigate("/login");
        return;
      }

      // Check if user has admin role
      const { data: roles, error: rolesError } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", session.user.id);

      if (rolesError) {
        console.error("Error checking roles:", rolesError);
        navigate("/login");
        return;
      }

      const hasAdminRole = roles?.some(r => r.role === "super_admin" || r.role === "admin");
      
      if (!hasAdminRole) {
        toast({
          title: "Accès refusé",
          description: "Vous n'avez pas les permissions nécessaires.",
          variant: "destructive",
        });
        navigate("/");
        return;
      }

      setIsAdmin(true);
      await loadAllData();
      setLoading(false);
    } catch (error) {
      console.error("Admin access check error:", error);
      navigate("/login");
    }
  };

  const loadAllData = async () => {
    const [testimonialsRes, partnershipsRes, contactsRes, subscribersRes, blogRes] = await Promise.all([
      supabase.from("testimonials").select("*").order("created_at", { ascending: false }),
      supabase.from("partnership_requests").select("*").order("created_at", { ascending: false }),
      supabase.from("contact_messages").select("*").order("created_at", { ascending: false }),
      supabase.from("newsletter_subscribers").select("*").order("subscribed_at", { ascending: false }),
      supabase.from("blog_posts").select("*").order("created_at", { ascending: false }),
    ]);

    if (testimonialsRes.data) setTestimonials(testimonialsRes.data);
    if (partnershipsRes.data) setPartnerships(partnershipsRes.data);
    if (contactsRes.data) setContacts(contactsRes.data);
    if (subscribersRes.data) setSubscribers(subscribersRes.data);
    if (blogRes.data) setBlogPosts(blogRes.data);

    setStats({
      totalTestimonials: testimonialsRes.data?.length || 0,
      pendingTestimonials: testimonialsRes.data?.filter(t => !t.is_approved).length || 0,
      totalPartnerships: partnershipsRes.data?.length || 0,
      pendingPartnerships: partnershipsRes.data?.filter(p => p.status === "pending").length || 0,
      totalContacts: contactsRes.data?.length || 0,
      totalSubscribers: subscribersRes.data?.filter(s => s.is_active).length || 0,
      totalBlogPosts: blogRes.data?.length || 0,
    });
  };

  // Export to CSV
  const exportToCSV = (data: any[], filename: string) => {
    if (data.length === 0) return;
    
    const headers = Object.keys(data[0]).join(',');
    const rows = data.map(item => 
      Object.values(item).map(val => 
        typeof val === 'string' ? `"${val.replace(/"/g, '""')}"` : val
      ).join(',')
    );
    const csv = [headers, ...rows].join('\n');
    
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${filename}_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  const handleApproveTestimonial = async (id: string, approved: boolean) => {
    const { error } = await supabase
      .from("testimonials")
      .update({ is_approved: approved })
      .eq("id", id);

    if (error) {
      toast({ title: "Erreur", description: error.message, variant: "destructive" });
    } else {
      toast({ title: approved ? "Témoignage approuvé" : "Témoignage rejeté" });
      loadAllData();
    }
  };

  const handleUpdatePartnershipStatus = async (id: string, status: string) => {
    const { error } = await supabase
      .from("partnership_requests")
      .update({ status })
      .eq("id", id);

    if (error) {
      toast({ title: "Erreur", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Statut mis à jour" });
      loadAllData();
    }
  };

  const handleDeleteTestimonial = async (id: string) => {
    const { error } = await supabase.from("testimonials").delete().eq("id", id);
    if (!error) {
      toast({ title: "Témoignage supprimé" });
      loadAllData();
    }
  };

  const handleSaveBlogPost = async () => {
    const slug = blogSlug || blogTitle.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    
    const postData = {
      title: blogTitle,
      slug,
      content: blogContent,
      excerpt: blogExcerpt || null,
      featured_image: blogImage || null,
    };

    if (editingBlog) {
      const { error } = await supabase
        .from("blog_posts")
        .update(postData)
        .eq("id", editingBlog.id);
      
      if (error) {
        toast({ title: "Erreur", description: error.message, variant: "destructive" });
      } else {
        toast({ title: "Article mis à jour" });
        resetBlogEditor();
        loadAllData();
      }
    } else {
      const { error } = await supabase.from("blog_posts").insert(postData);
      
      if (error) {
        toast({ title: "Erreur", description: error.message, variant: "destructive" });
      } else {
        toast({ title: "Article créé" });
        resetBlogEditor();
        loadAllData();
      }
    }
  };

  const handlePublishBlog = async (id: string, publish: boolean) => {
    const { error } = await supabase
      .from("blog_posts")
      .update({ 
        is_published: publish,
        published_at: publish ? new Date().toISOString() : null
      })
      .eq("id", id);

    if (!error) {
      toast({ title: publish ? "Article publié" : "Article dépublié" });
      loadAllData();
    }
  };

  const handleDeleteBlog = async (id: string) => {
    const { error } = await supabase.from("blog_posts").delete().eq("id", id);
    if (!error) {
      toast({ title: "Article supprimé" });
      loadAllData();
    }
  };

  const resetBlogEditor = () => {
    setShowBlogEditor(false);
    setEditingBlog(null);
    setBlogTitle("");
    setBlogSlug("");
    setBlogContent("");
    setBlogExcerpt("");
    setBlogImage("");
  };

  const openBlogEditor = (post?: BlogPost) => {
    if (post) {
      setEditingBlog(post);
      setBlogTitle(post.title);
      setBlogSlug(post.slug);
      setBlogContent(post.content);
      setBlogExcerpt(post.excerpt || "");
      setBlogImage(post.featured_image || "");
    }
    setShowBlogEditor(true);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Chart data
  const partnershipTypeData = partnerships.reduce((acc, p) => {
    const existing = acc.find(item => item.name === p.partnership_type);
    if (existing) {
      existing.value += 1;
    } else {
      acc.push({ name: p.partnership_type, value: 1 });
    }
    return acc;
  }, [] as { name: string; value: number }[]);

  const monthlyData = [...Array(6)].map((_, i) => {
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
    };
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAdmin) return null;

  return (
    <>
      <Helmet>
        <title>Admin Dashboard - AGRICAPITAL</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div className="min-h-screen bg-muted/30">
        {/* Header */}
        <header className="bg-card border-b sticky top-0 z-50">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h1 className="text-xl font-bold text-primary">AGRICAPITAL Admin</h1>
              <Badge variant="secondary">Super Admin</Badge>
            </div>
            <Button variant="outline" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Déconnexion
            </Button>
          </div>
        </header>

        <main className="container mx-auto px-4 py-8">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Témoignages</CardTitle>
                <Star className="h-4 w-4 text-yellow-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalTestimonials}</div>
                <p className="text-xs text-muted-foreground">
                  {stats.pendingTestimonials} en attente
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Partenariats</CardTitle>
                <Handshake className="h-4 w-4 text-blue-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalPartnerships}</div>
                <p className="text-xs text-muted-foreground">
                  {stats.pendingPartnerships} en attente
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Messages</CardTitle>
                <MessageSquare className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalContacts}</div>
                <p className="text-xs text-muted-foreground">Messages reçus</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Newsletter</CardTitle>
                <Mail className="h-4 w-4 text-purple-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalSubscribers}</div>
                <p className="text-xs text-muted-foreground">Abonnés actifs</p>
              </CardContent>
            </Card>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Activité Mensuelle
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="testimonials" stroke="hsl(var(--primary))" name="Témoignages" />
                    <Line type="monotone" dataKey="partnerships" stroke="#10B981" name="Partenariats" />
                    <Line type="monotone" dataKey="contacts" stroke="#F59E0B" name="Messages" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Types de Partenariats
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={partnershipTypeData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
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

          {/* Search & Export */}
          <div className="flex flex-wrap gap-4 mb-6">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => exportToCSV(testimonials, 'testimonials')}>
                <Download className="h-4 w-4 mr-2" />
                Export Témoignages
              </Button>
              <Button variant="outline" size="sm" onClick={() => exportToCSV(partnerships, 'partnerships')}>
                <Download className="h-4 w-4 mr-2" />
                Export Partenariats
              </Button>
              <Button variant="outline" size="sm" onClick={() => exportToCSV(subscribers, 'newsletter')}>
                <Download className="h-4 w-4 mr-2" />
                Export Newsletter
              </Button>
            </div>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="testimonials" className="space-y-4">
            <TabsList className="grid w-full grid-cols-5 lg:w-auto lg:inline-grid">
              <TabsTrigger value="testimonials">
                <Star className="h-4 w-4 mr-2" />
                Témoignages
              </TabsTrigger>
              <TabsTrigger value="partnerships">
                <Handshake className="h-4 w-4 mr-2" />
                Partenariats
              </TabsTrigger>
              <TabsTrigger value="contacts">
                <MessageSquare className="h-4 w-4 mr-2" />
                Messages
              </TabsTrigger>
              <TabsTrigger value="newsletter">
                <Mail className="h-4 w-4 mr-2" />
                Newsletter
              </TabsTrigger>
              <TabsTrigger value="blog">
                <FileText className="h-4 w-4 mr-2" />
                Blog
              </TabsTrigger>
            </TabsList>

            {/* Testimonials Tab */}
            <TabsContent value="testimonials">
              <Card>
                <CardHeader>
                  <CardTitle>Gestion des Témoignages</CardTitle>
                  <CardDescription>Approuvez ou modifiez les témoignages reçus</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Photo</TableHead>
                        <TableHead>Nom</TableHead>
                        <TableHead>Localité</TableHead>
                        <TableHead>Note</TableHead>
                        <TableHead>Statut</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {testimonials
                        .filter(t => 
                          t.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          t.last_name.toLowerCase().includes(searchTerm.toLowerCase())
                        )
                        .map((testimonial) => (
                          <TableRow key={testimonial.id}>
                            <TableCell>
                              {testimonial.photo_url ? (
                                <img src={testimonial.photo_url} alt="" className="w-10 h-10 rounded-full object-cover" />
                              ) : (
                                <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                                  <Users className="h-5 w-5 text-muted-foreground" />
                                </div>
                              )}
                            </TableCell>
                            <TableCell className="font-medium">
                              {testimonial.first_name} {testimonial.last_name}
                            </TableCell>
                            <TableCell>{testimonial.locality}</TableCell>
                            <TableCell>{"⭐".repeat(testimonial.rating || 5)}</TableCell>
                            <TableCell>
                              <Badge variant={testimonial.is_approved ? "default" : "secondary"}>
                                {testimonial.is_approved ? "Approuvé" : "En attente"}
                              </Badge>
                            </TableCell>
                            <TableCell>{formatDate(testimonial.created_at)}</TableCell>
                            <TableCell>
                              <div className="flex gap-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => {
                                    setSelectedItem(testimonial);
                                    setDialogType("testimonial");
                                  }}
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                                {!testimonial.is_approved && (
                                  <Button
                                    size="sm"
                                    variant="default"
                                    onClick={() => handleApproveTestimonial(testimonial.id, true)}
                                  >
                                    <Check className="h-4 w-4" />
                                  </Button>
                                )}
                                {testimonial.is_approved && (
                                  <Button
                                    size="sm"
                                    variant="secondary"
                                    onClick={() => handleApproveTestimonial(testimonial.id, false)}
                                  >
                                    <X className="h-4 w-4" />
                                  </Button>
                                )}
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  onClick={() => handleDeleteTestimonial(testimonial.id)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Partnerships Tab */}
            <TabsContent value="partnerships">
              <Card>
                <CardHeader>
                  <CardTitle>Demandes de Partenariat</CardTitle>
                  <CardDescription>Gérez les demandes de partenariat reçues</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Entreprise</TableHead>
                        <TableHead>Contact</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Statut</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {partnerships
                        .filter(p =>
                          p.company_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          p.contact_name.toLowerCase().includes(searchTerm.toLowerCase())
                        )
                        .map((partnership) => (
                          <TableRow key={partnership.id}>
                            <TableCell className="font-medium">{partnership.company_name}</TableCell>
                            <TableCell>{partnership.contact_name}</TableCell>
                            <TableCell>{partnership.partnership_type}</TableCell>
                            <TableCell>
                              <Badge
                                variant={
                                  partnership.status === "pending"
                                    ? "secondary"
                                    : partnership.status === "approved"
                                    ? "default"
                                    : "destructive"
                                }
                              >
                                {partnership.status === "pending" ? "En attente" : 
                                 partnership.status === "approved" ? "Approuvé" : "Rejeté"}
                              </Badge>
                            </TableCell>
                            <TableCell>{formatDate(partnership.created_at)}</TableCell>
                            <TableCell>
                              <div className="flex gap-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => {
                                    setSelectedItem(partnership);
                                    setDialogType("partnership");
                                  }}
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                                {partnership.status === "pending" && (
                                  <>
                                    <Button
                                      size="sm"
                                      variant="default"
                                      onClick={() => handleUpdatePartnershipStatus(partnership.id, "approved")}
                                    >
                                      <Check className="h-4 w-4" />
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant="destructive"
                                      onClick={() => handleUpdatePartnershipStatus(partnership.id, "rejected")}
                                    >
                                      <X className="h-4 w-4" />
                                    </Button>
                                  </>
                                )}
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Contacts Tab */}
            <TabsContent value="contacts">
              <Card>
                <CardHeader>
                  <CardTitle>Messages de Contact</CardTitle>
                  <CardDescription>Consultez les messages reçus</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Nom</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Téléphone</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {contacts
                        .filter(c =>
                          c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          c.email.toLowerCase().includes(searchTerm.toLowerCase())
                        )
                        .map((contact) => (
                          <TableRow key={contact.id}>
                            <TableCell className="font-medium">{contact.name}</TableCell>
                            <TableCell>{contact.email}</TableCell>
                            <TableCell>{contact.phone || "-"}</TableCell>
                            <TableCell>{formatDate(contact.created_at)}</TableCell>
                            <TableCell>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                  setSelectedItem(contact);
                                  setDialogType("contact");
                                }}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Newsletter Tab */}
            <TabsContent value="newsletter">
              <Card>
                <CardHeader>
                  <CardTitle>Abonnés Newsletter</CardTitle>
                  <CardDescription>Liste des abonnés à la newsletter</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Email</TableHead>
                        <TableHead>Statut</TableHead>
                        <TableHead>Date d'inscription</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {subscribers
                        .filter(s => s.email.toLowerCase().includes(searchTerm.toLowerCase()))
                        .map((subscriber) => (
                          <TableRow key={subscriber.id}>
                            <TableCell className="font-medium">{subscriber.email}</TableCell>
                            <TableCell>
                              <Badge variant={subscriber.is_active ? "default" : "secondary"}>
                                {subscriber.is_active ? "Actif" : "Inactif"}
                              </Badge>
                            </TableCell>
                            <TableCell>{formatDate(subscriber.subscribed_at)}</TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Blog Tab */}
            <TabsContent value="blog">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Gestion du Blog</CardTitle>
                    <CardDescription>Créez et gérez vos articles de blog</CardDescription>
                  </div>
                  <Button onClick={() => openBlogEditor()}>
                    <Plus className="h-4 w-4 mr-2" />
                    Nouvel Article
                  </Button>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Titre</TableHead>
                        <TableHead>Statut</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {blogPosts
                        .filter(p => p.title.toLowerCase().includes(searchTerm.toLowerCase()))
                        .map((post) => (
                          <TableRow key={post.id}>
                            <TableCell className="font-medium">{post.title}</TableCell>
                            <TableCell>
                              <Badge variant={post.is_published ? "default" : "secondary"}>
                                {post.is_published ? "Publié" : "Brouillon"}
                              </Badge>
                            </TableCell>
                            <TableCell>{formatDate(post.created_at)}</TableCell>
                            <TableCell>
                              <div className="flex gap-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => openBlogEditor(post)}
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                                {!post.is_published ? (
                                  <Button
                                    size="sm"
                                    variant="default"
                                    onClick={() => handlePublishBlog(post.id, true)}
                                  >
                                    <Check className="h-4 w-4" />
                                  </Button>
                                ) : (
                                  <Button
                                    size="sm"
                                    variant="secondary"
                                    onClick={() => handlePublishBlog(post.id, false)}
                                  >
                                    <X className="h-4 w-4" />
                                  </Button>
                                )}
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  onClick={() => handleDeleteBlog(post.id)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>

      {/* Detail Dialog */}
      <Dialog open={!!selectedItem} onOpenChange={() => setSelectedItem(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {dialogType === "testimonial" && "Détails du Témoignage"}
              {dialogType === "partnership" && "Détails de la Demande de Partenariat"}
              {dialogType === "contact" && "Détails du Message"}
            </DialogTitle>
          </DialogHeader>
          {selectedItem && (
            <div className="space-y-4">
              {dialogType === "testimonial" && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div><strong>Nom:</strong> {(selectedItem as Testimonial).first_name} {(selectedItem as Testimonial).last_name}</div>
                    <div><strong>Email:</strong> {(selectedItem as Testimonial).email}</div>
                    <div><strong>Téléphone:</strong> {(selectedItem as Testimonial).phone || "-"}</div>
                    <div><strong>Localité:</strong> {(selectedItem as Testimonial).locality}</div>
                    <div><strong>Note:</strong> {"⭐".repeat((selectedItem as Testimonial).rating || 5)}</div>
                  </div>
                  <div>
                    <strong>Message:</strong>
                    <p className="mt-2 p-4 bg-muted rounded-lg">{(selectedItem as Testimonial).message}</p>
                  </div>
                </>
              )}
              {dialogType === "partnership" && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div><strong>Entreprise:</strong> {(selectedItem as PartnershipRequest).company_name}</div>
                    <div><strong>Contact:</strong> {(selectedItem as PartnershipRequest).contact_name}</div>
                    <div><strong>Email:</strong> {(selectedItem as PartnershipRequest).email}</div>
                    <div><strong>Téléphone:</strong> {(selectedItem as PartnershipRequest).phone}</div>
                    <div><strong>Type:</strong> {(selectedItem as PartnershipRequest).partnership_type}</div>
                    <div><strong>Site web:</strong> {(selectedItem as PartnershipRequest).website || "-"}</div>
                  </div>
                  <div>
                    <strong>Message:</strong>
                    <p className="mt-2 p-4 bg-muted rounded-lg">{(selectedItem as PartnershipRequest).message}</p>
                  </div>
                </>
              )}
              {dialogType === "contact" && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div><strong>Nom:</strong> {(selectedItem as ContactMessage).name}</div>
                    <div><strong>Email:</strong> {(selectedItem as ContactMessage).email}</div>
                    <div><strong>Téléphone:</strong> {(selectedItem as ContactMessage).phone || "-"}</div>
                  </div>
                  <div>
                    <strong>Message:</strong>
                    <p className="mt-2 p-4 bg-muted rounded-lg">{(selectedItem as ContactMessage).message}</p>
                  </div>
                </>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Blog Editor Dialog */}
      <Dialog open={showBlogEditor} onOpenChange={(open) => !open && resetBlogEditor()}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingBlog ? "Modifier l'article" : "Nouvel article"}</DialogTitle>
            <DialogDescription>
              Utilisez l'éditeur ci-dessous pour rédiger votre article
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="blog-title">Titre</Label>
                <Input
                  id="blog-title"
                  value={blogTitle}
                  onChange={(e) => setBlogTitle(e.target.value)}
                  placeholder="Titre de l'article"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="blog-slug">Slug (URL)</Label>
                <Input
                  id="blog-slug"
                  value={blogSlug}
                  onChange={(e) => setBlogSlug(e.target.value)}
                  placeholder="titre-de-larticle"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="blog-excerpt">Extrait</Label>
              <Textarea
                id="blog-excerpt"
                value={blogExcerpt}
                onChange={(e) => setBlogExcerpt(e.target.value)}
                placeholder="Court résumé de l'article..."
                rows={2}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="blog-image">Image à la une (URL)</Label>
              <Input
                id="blog-image"
                value={blogImage}
                onChange={(e) => setBlogImage(e.target.value)}
                placeholder="https://exemple.com/image.jpg"
              />
            </div>
            <div className="space-y-2">
              <Label>Contenu</Label>
              <RichTextEditor content={blogContent} onChange={setBlogContent} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={resetBlogEditor}>
              Annuler
            </Button>
            <Button onClick={handleSaveBlogPost}>
              {editingBlog ? "Mettre à jour" : "Créer l'article"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Admin;
