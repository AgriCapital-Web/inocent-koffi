import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { 
  Users, MessageSquare, Handshake, Star, Mail, 
  LogOut, Search, Check, X, Trash2, Eye, 
  BarChart3, TrendingUp, Calendar
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
} from "@/components/ui/dialog";

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

const Admin = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedItem, setSelectedItem] = useState<Testimonial | PartnershipRequest | ContactMessage | null>(null);
  const [dialogType, setDialogType] = useState<string>("");

  // Data states
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [partnerships, setPartnerships] = useState<PartnershipRequest[]>([]);
  const [contacts, setContacts] = useState<ContactMessage[]>([]);
  const [subscribers, setSubscribers] = useState<NewsletterSubscriber[]>([]);

  // Stats
  const [stats, setStats] = useState({
    totalTestimonials: 0,
    pendingTestimonials: 0,
    totalPartnerships: 0,
    pendingPartnerships: 0,
    totalContacts: 0,
    totalSubscribers: 0,
  });

  useEffect(() => {
    checkAdminAccess();
  }, []);

  const checkAdminAccess = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      navigate("/login");
      return;
    }

    // Check if user has admin role
    const { data: roles } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", session.user.id);

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
  };

  const loadAllData = async () => {
    const [testimonialsRes, partnershipsRes, contactsRes, subscribersRes] = await Promise.all([
      supabase.from("testimonials").select("*").order("created_at", { ascending: false }),
      supabase.from("partnership_requests").select("*").order("created_at", { ascending: false }),
      supabase.from("contact_messages").select("*").order("created_at", { ascending: false }),
      supabase.from("newsletter_subscribers").select("*").order("subscribed_at", { ascending: false }),
    ]);

    if (testimonialsRes.data) setTestimonials(testimonialsRes.data);
    if (partnershipsRes.data) setPartnerships(partnershipsRes.data);
    if (contactsRes.data) setContacts(contactsRes.data);
    if (subscribersRes.data) setSubscribers(subscribersRes.data);

    setStats({
      totalTestimonials: testimonialsRes.data?.length || 0,
      pendingTestimonials: testimonialsRes.data?.filter(t => !t.is_approved).length || 0,
      totalPartnerships: partnershipsRes.data?.length || 0,
      pendingPartnerships: partnershipsRes.data?.filter(p => p.status === "pending").length || 0,
      totalContacts: contactsRes.data?.length || 0,
      totalSubscribers: subscribersRes.data?.filter(s => s.is_active).length || 0,
    });
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

          {/* Search */}
          <div className="mb-6">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="testimonials" className="space-y-4">
            <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:inline-grid">
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
                  <CardDescription>Tous les messages reçus via le formulaire de contact</CardDescription>
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
          </Tabs>
        </main>

        {/* Detail Dialog */}
        <Dialog open={!!selectedItem} onOpenChange={() => setSelectedItem(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {dialogType === "testimonial" && "Détail du Témoignage"}
                {dialogType === "partnership" && "Détail du Partenariat"}
                {dialogType === "contact" && "Détail du Message"}
              </DialogTitle>
            </DialogHeader>
            {selectedItem && (
              <div className="space-y-4">
                {dialogType === "testimonial" && (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Nom</p>
                        <p className="font-medium">{(selectedItem as Testimonial).first_name} {(selectedItem as Testimonial).last_name}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Email</p>
                        <p className="font-medium">{(selectedItem as Testimonial).email}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Localité</p>
                        <p className="font-medium">{(selectedItem as Testimonial).locality}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Note</p>
                        <p className="font-medium">{"⭐".repeat((selectedItem as Testimonial).rating || 5)}</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Message</p>
                      <p className="mt-2 p-4 bg-muted rounded-lg">{(selectedItem as Testimonial).message}</p>
                    </div>
                  </>
                )}
                {dialogType === "partnership" && (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Entreprise</p>
                        <p className="font-medium">{(selectedItem as PartnershipRequest).company_name}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Contact</p>
                        <p className="font-medium">{(selectedItem as PartnershipRequest).contact_name}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Email</p>
                        <p className="font-medium">{(selectedItem as PartnershipRequest).email}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Téléphone</p>
                        <p className="font-medium">{(selectedItem as PartnershipRequest).phone}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Type</p>
                        <p className="font-medium">{(selectedItem as PartnershipRequest).partnership_type}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Site web</p>
                        <p className="font-medium">{(selectedItem as PartnershipRequest).website || "-"}</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Message</p>
                      <p className="mt-2 p-4 bg-muted rounded-lg">{(selectedItem as PartnershipRequest).message}</p>
                    </div>
                  </>
                )}
                {dialogType === "contact" && (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Nom</p>
                        <p className="font-medium">{(selectedItem as ContactMessage).name}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Email</p>
                        <p className="font-medium">{(selectedItem as ContactMessage).email}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Téléphone</p>
                        <p className="font-medium">{(selectedItem as ContactMessage).phone || "-"}</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Message</p>
                      <p className="mt-2 p-4 bg-muted rounded-lg">{(selectedItem as ContactMessage).message}</p>
                    </div>
                  </>
                )}
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
};

export default Admin;
