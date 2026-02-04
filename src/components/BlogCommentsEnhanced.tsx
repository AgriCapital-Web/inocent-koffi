import { useState, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { MessageSquare, User, Calendar, Send, Bold, Italic, Link as LinkIcon, Upload, X } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";

interface BlogCommentsEnhancedProps {
  postId: string;
}

interface Comment {
  id: string;
  author_name: string;
  author_photo: string | null;
  content: string;
  created_at: string;
  is_approved: boolean;
}

const BlogCommentsEnhanced = ({ postId }: BlogCommentsEnhancedProps) => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const photoInputRef = useRef<HTMLInputElement>(null);
  
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [content, setContent] = useState("");
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);

  // Fetch approved comments
  const { data: comments, isLoading } = useQuery({
    queryKey: ['blog-comments', postId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('blog_comments')
        .select('id, author_name, author_photo, content, created_at, is_approved')
        .eq('post_id', postId)
        .eq('is_approved', true)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as Comment[];
    },
    enabled: !!postId,
  });

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast({ title: "Fichier trop volumineux", description: "Max 5 Mo", variant: "destructive" });
        return;
      }
      setPhotoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadPhoto = async (): Promise<string | null> => {
    if (!photoFile) return null;
    
    const fileExt = photoFile.name.split('.').pop();
    const fileName = `comment_${Date.now()}_${Math.random().toString(36).substr(2, 9)}.${fileExt}`;
    const filePath = `comments/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('testimonials')
      .upload(filePath, photoFile);

    if (uploadError) throw uploadError;

    const { data } = supabase.storage.from('testimonials').getPublicUrl(filePath);
    return data.publicUrl;
  };

  // Submit comment mutation
  const submitComment = useMutation({
    mutationFn: async (commentData: { 
      author_name: string; 
      author_email: string; 
      author_phone?: string;
      author_photo?: string | null;
      content: string; 
      post_id: string 
    }) => {
      const { error } = await supabase
        .from('blog_comments')
        .insert(commentData);
      
      if (error) throw error;
    },
    onSuccess: () => {
      toast({
        title: "Commentaire envoyé",
        description: "Votre commentaire sera visible après modération.",
      });
      resetForm();
      queryClient.invalidateQueries({ queryKey: ['blog-comments', postId] });
    },
    onError: () => {
      toast({
        title: "Erreur",
        description: "Impossible d'envoyer le commentaire.",
        variant: "destructive",
      });
    },
  });

  const resetForm = () => {
    setFirstName("");
    setLastName("");
    setEmail("");
    setPhone("");
    setContent("");
    setPhotoPreview(null);
    setPhotoFile(null);
    setShowForm(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!firstName.trim() || !lastName.trim() || !content.trim()) {
      toast({
        title: "Champs requis",
        description: "Veuillez remplir le nom, prénom et commentaire.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      let photoUrl = null;
      if (photoFile) {
        photoUrl = await uploadPhoto();
      }

      await submitComment.mutateAsync({
        author_name: `${firstName.trim()} ${lastName.trim()}`,
        author_email: email.trim() || `${firstName.toLowerCase()}@anonymous.com`,
        author_phone: phone.trim() || undefined,
        author_photo: photoUrl,
        content: content.trim(),
        post_id: postId,
      });
    } catch (error) {
      console.error("Error submitting comment:", error);
    } finally {
      setIsSubmitting(false);
    }
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

  const applyFormatting = (format: 'bold' | 'italic') => {
    const textarea = document.getElementById('comment-content-enhanced') as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end);
    
    let formattedText = '';
    if (format === 'bold') {
      formattedText = `**${selectedText}**`;
    } else if (format === 'italic') {
      formattedText = `*${selectedText}*`;
    }
    
    const newContent = content.substring(0, start) + formattedText + content.substring(end);
    setContent(newContent);
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <section className="py-12 border-t">
      <div className="space-y-8">
        {/* Comments List */}
        <div>
          <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <MessageSquare className="w-6 h-6 text-primary" />
            Commentaires
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
                      <Avatar className="w-10 h-10 flex-shrink-0">
                        {comment.author_photo ? (
                          <AvatarImage src={comment.author_photo} alt={comment.author_name} />
                        ) : null}
                        <AvatarFallback className="bg-primary/10 text-primary">
                          {getInitials(comment.author_name)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 mb-2">
                          <h4 className="font-semibold text-foreground">{comment.author_name}</h4>
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Calendar className="w-3 h-3" />
                            <time dateTime={comment.created_at}>{formatDate(comment.created_at)}</time>
                          </div>
                        </div>
                        <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">{comment.content}</p>
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
                  Aucun commentaire pour le moment. Soyez le premier à commenter !
                </p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Comment Button or Form */}
        {!showForm ? (
          <Button onClick={() => setShowForm(true)} className="gap-2">
            <MessageSquare className="w-4 h-4" />
            Laisser un commentaire
          </Button>
        ) : (
          <Card className="border-primary/20">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Send className="w-5 h-5 text-primary" />
                  Laisser un commentaire
                </CardTitle>
                <Button variant="ghost" size="icon" onClick={() => setShowForm(false)}>
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Photo Upload */}
                <div className="flex items-center gap-4">
                  <div 
                    className="relative w-16 h-16 rounded-full overflow-hidden bg-muted cursor-pointer group"
                    onClick={() => photoInputRef.current?.click()}
                  >
                    {photoPreview ? (
                      <img src={photoPreview} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Upload className="w-6 h-6 text-muted-foreground group-hover:text-primary transition-colors" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Upload className="w-5 h-5 text-white" />
                    </div>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    <p className="font-medium">Photo (optionnel)</p>
                    <p>Cliquez pour ajouter une photo</p>
                  </div>
                  <input
                    ref={photoInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoChange}
                    className="hidden"
                  />
                  {photoPreview && (
                    <Button 
                      type="button" 
                      variant="ghost" 
                      size="sm"
                      onClick={() => { setPhotoPreview(null); setPhotoFile(null); }}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  )}
                </div>

                {/* Name fields */}
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">Prénom *</Label>
                    <Input
                      id="firstName"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder="Votre prénom"
                      required
                      disabled={isSubmitting}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Nom *</Label>
                    <Input
                      id="lastName"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      placeholder="Votre nom"
                      required
                      disabled={isSubmitting}
                    />
                  </div>
                </div>

                {/* Contact fields */}
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="comment-email">Email (optionnel)</Label>
                    <Input
                      id="comment-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="votre@email.com"
                      disabled={isSubmitting}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">WhatsApp (optionnel)</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+225 XX XX XX XX"
                      disabled={isSubmitting}
                    />
                  </div>
                </div>

                {/* Comment with formatting */}
                <div className="space-y-2">
                  <Label htmlFor="comment-content-enhanced">Commentaire *</Label>
                  <div className="border rounded-lg overflow-hidden">
                    <div className="flex gap-1 p-2 bg-muted/50 border-b">
                      <Button 
                        type="button" 
                        variant="ghost" 
                        size="sm"
                        onClick={() => applyFormatting('bold')}
                      >
                        <Bold className="w-4 h-4" />
                      </Button>
                      <Button 
                        type="button" 
                        variant="ghost" 
                        size="sm"
                        onClick={() => applyFormatting('italic')}
                      >
                        <Italic className="w-4 h-4" />
                      </Button>
                    </div>
                    <textarea
                      id="comment-content-enhanced"
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      placeholder="Partagez vos réflexions..."
                      rows={4}
                      required
                      disabled={isSubmitting}
                      className="w-full p-3 resize-none bg-background focus:outline-none"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between flex-wrap gap-4">
                  <Button type="submit" disabled={isSubmitting} className="gap-2">
                    {isSubmitting ? (
                      <>
                        <span className="animate-spin">⏳</span>
                        Envoi en cours...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        Envoyer le commentaire
                      </>
                    )}
                  </Button>
                  <p className="text-xs text-muted-foreground">
                    Votre commentaire sera visible après modération.
                  </p>
                </div>
              </form>
            </CardContent>
          </Card>
        )}
      </div>
    </section>
  );
};

export default BlogCommentsEnhanced;
