import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { MessageSquare, User, Calendar, Send } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";

interface BlogCommentsProps {
  postId: string;
  postSlug: string;
}

interface Comment {
  id: string;
  author_name: string;
  content: string;
  created_at: string;
  is_approved: boolean;
}

const BlogComments = ({ postId, postSlug }: BlogCommentsProps) => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch approved comments
  const { data: comments, isLoading } = useQuery({
    queryKey: ['blog-comments', postId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('blog_comments')
        .select('id, author_name, content, created_at, is_approved')
        .eq('post_id', postId)
        .eq('is_approved', true)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as Comment[];
    },
    enabled: !!postId,
  });

  // Submit comment mutation
  const submitComment = useMutation({
    mutationFn: async (commentData: { author_name: string; author_email: string; content: string; post_id: string }) => {
      const { error } = await supabase
        .from('blog_comments')
        .insert(commentData);
      
      if (error) throw error;
    },
    onSuccess: () => {
      toast({
        title: t('comments.success') || "Commentaire envoyé",
        description: t('comments.pending') || "Votre commentaire sera visible après modération.",
      });
      setName("");
      setEmail("");
      setContent("");
      queryClient.invalidateQueries({ queryKey: ['blog-comments', postId] });
    },
    onError: () => {
      toast({
        title: t('comments.error') || "Erreur",
        description: t('comments.errorMessage') || "Impossible d'envoyer le commentaire.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim() || !email.trim() || !content.trim()) {
      toast({
        title: t('comments.required') || "Champs requis",
        description: t('comments.fillAll') || "Veuillez remplir tous les champs.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    await submitComment.mutateAsync({
      author_name: name.trim(),
      author_email: email.trim(),
      content: content.trim(),
      post_id: postId,
    });
    setIsSubmitting(false);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <section className="py-12 border-t">
      <div className="space-y-8">
        {/* Comments List */}
        <div>
          <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <MessageSquare className="w-6 h-6 text-primary" />
            {t('comments.title') || "Commentaires"} 
            {comments && comments.length > 0 && (
              <span className="text-muted-foreground text-lg">({comments.length})</span>
            )}
          </h3>
          
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="animate-pulse">
                  <CardContent className="p-4">
                    <div className="h-4 bg-muted rounded w-1/4 mb-2"></div>
                    <div className="h-3 bg-muted rounded w-full mb-1"></div>
                    <div className="h-3 bg-muted rounded w-3/4"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : comments && comments.length > 0 ? (
            <div className="space-y-4">
              {comments.map((comment) => (
                <Card key={comment.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4 sm:p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <User className="w-5 h-5 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 mb-2">
                          <h4 className="font-semibold text-foreground">{comment.author_name}</h4>
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Calendar className="w-3 h-3" />
                            <time dateTime={comment.created_at}>{formatDate(comment.created_at)}</time>
                          </div>
                        </div>
                        <p className="text-muted-foreground leading-relaxed">{comment.content}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="p-6 text-center">
                <MessageSquare className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">
                  {t('comments.noComments') || "Aucun commentaire pour le moment. Soyez le premier à commenter !"}
                </p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Comment Form */}
        <Card className="border-primary/20">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Send className="w-5 h-5 text-primary" />
              {t('comments.leave') || "Laisser un commentaire"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="comment-name">{t('contact.form.name') || "Nom complet"}</Label>
                  <Input
                    id="comment-name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={t('comments.namePlaceholder') || "Votre nom"}
                    required
                    disabled={isSubmitting}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="comment-email">{t('contact.form.email') || "Email"}</Label>
                  <Input
                    id="comment-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={t('comments.emailPlaceholder') || "votre@email.com"}
                    required
                    disabled={isSubmitting}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="comment-content">{t('comments.comment') || "Commentaire"}</Label>
                <Textarea
                  id="comment-content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder={t('comments.commentPlaceholder') || "Partagez vos réflexions..."}
                  rows={4}
                  required
                  disabled={isSubmitting}
                  className="resize-none"
                />
              </div>
              <Button type="submit" disabled={isSubmitting} className="w-full sm:w-auto">
                {isSubmitting ? (
                  <>
                    <span className="animate-spin mr-2">⏳</span>
                    {t('contact.form.sending') || "Envoi en cours..."}
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    {t('comments.submit') || "Envoyer le commentaire"}
                  </>
                )}
              </Button>
              <p className="text-xs text-muted-foreground">
                {t('comments.moderation') || "Votre commentaire sera visible après modération par l'administrateur."}
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default BlogComments;
