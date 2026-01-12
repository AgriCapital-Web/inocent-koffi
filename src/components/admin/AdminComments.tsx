import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Check, X, Trash2, Eye, MessageSquare, Download } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface BlogComment {
  id: string;
  post_id: string;
  author_name: string;
  author_email: string;
  content: string;
  is_approved: boolean;
  created_at: string;
  blog_posts?: {
    title: string;
    slug: string;
  };
}

const AdminComments = () => {
  const { toast } = useToast();
  const [comments, setComments] = useState<BlogComment[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedComment, setSelectedComment] = useState<BlogComment | null>(null);

  useEffect(() => {
    loadComments();
  }, []);

  const loadComments = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("blog_comments")
      .select(`
        *,
        blog_posts (title, slug)
      `)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error loading comments:", error);
    } else {
      setComments(data || []);
    }
    setLoading(false);
  };

  const handleApprove = async (id: string, approved: boolean) => {
    const { error } = await supabase
      .from("blog_comments")
      .update({ is_approved: approved })
      .eq("id", id);

    if (error) {
      toast({ title: "Erreur", description: error.message, variant: "destructive" });
    } else {
      toast({ title: approved ? "Commentaire approuvé" : "Commentaire rejeté" });
      loadComments();
    }
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("blog_comments").delete().eq("id", id);
    if (!error) {
      toast({ title: "Commentaire supprimé" });
      loadComments();
    }
  };

  const exportToCSV = () => {
    if (comments.length === 0) return;
    
    const headers = ["Auteur", "Email", "Article", "Contenu", "Statut", "Date"];
    const rows = comments.map(c => [
      c.author_name,
      c.author_email,
      c.blog_posts?.title || "N/A",
      `"${c.content.replace(/"/g, '""')}"`,
      c.is_approved ? "Approuvé" : "En attente",
      new Date(c.created_at).toLocaleDateString("fr-FR")
    ]);
    
    const csv = [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `comments_${new Date().toISOString().split("T")[0]}.csv`;
    link.click();
    
    toast({ title: "Export réussi" });
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  const pendingCount = comments.filter(c => !c.is_approved).length;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5" />
              Modération des Commentaires
            </CardTitle>
            <CardDescription>
              {comments.length} commentaire(s) • {pendingCount} en attente de modération
            </CardDescription>
          </div>
          <Button variant="outline" onClick={exportToCSV} disabled={comments.length === 0}>
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
        </CardHeader>
        <CardContent>
          {comments.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <MessageSquare className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>Aucun commentaire</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Auteur</TableHead>
                  <TableHead>Article</TableHead>
                  <TableHead>Extrait</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {comments.map((comment) => (
                  <TableRow key={comment.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{comment.author_name}</p>
                        <p className="text-xs text-muted-foreground">{comment.author_email}</p>
                      </div>
                    </TableCell>
                    <TableCell className="max-w-[150px] truncate">
                      {comment.blog_posts?.title || "Article supprimé"}
                    </TableCell>
                    <TableCell className="max-w-[200px] truncate">
                      {comment.content.substring(0, 50)}...
                    </TableCell>
                    <TableCell>
                      <Badge variant={comment.is_approved ? "default" : "secondary"}>
                        {comment.is_approved ? "Approuvé" : "En attente"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm">{formatDate(comment.created_at)}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setSelectedComment(comment)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        {!comment.is_approved ? (
                          <Button
                            size="sm"
                            variant="default"
                            onClick={() => handleApprove(comment.id, true)}
                          >
                            <Check className="h-4 w-4" />
                          </Button>
                        ) : (
                          <Button
                            size="sm"
                            variant="secondary"
                            onClick={() => handleApprove(comment.id, false)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDelete(comment.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Comment Detail Dialog */}
      <Dialog open={!!selectedComment} onOpenChange={() => setSelectedComment(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Détails du Commentaire</DialogTitle>
          </DialogHeader>
          {selectedComment && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Auteur</p>
                  <p className="font-medium">{selectedComment.author_name}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium">{selectedComment.author_email}</p>
                </div>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Article</p>
                <p className="font-medium">{selectedComment.blog_posts?.title || "N/A"}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-2">Commentaire</p>
                <p className="p-4 bg-muted rounded-lg">{selectedComment.content}</p>
              </div>
              <div className="flex gap-2">
                {!selectedComment.is_approved ? (
                  <Button onClick={() => { handleApprove(selectedComment.id, true); setSelectedComment(null); }}>
                    <Check className="h-4 w-4 mr-2" /> Approuver
                  </Button>
                ) : (
                  <Button variant="secondary" onClick={() => { handleApprove(selectedComment.id, false); setSelectedComment(null); }}>
                    <X className="h-4 w-4 mr-2" /> Rejeter
                  </Button>
                )}
                <Button variant="destructive" onClick={() => { handleDelete(selectedComment.id); setSelectedComment(null); }}>
                  <Trash2 className="h-4 w-4 mr-2" /> Supprimer
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AdminComments;
