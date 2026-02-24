import { useState } from "react";
import { Helmet } from "react-helmet-async";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { MessageSquare, Plus, Eye, Clock, Pin, Lock, Send, User } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

const CATEGORIES = [
  { value: "general", label: "💬 Général" },
  { value: "agriculture", label: "🌱 Agriculture" },
  { value: "technologie", label: "💻 Technologie & IA" },
  { value: "entrepreneuriat", label: "🚀 Entrepreneuriat" },
  { value: "partenariat", label: "🤝 Partenariat" },
  { value: "questions", label: "❓ Questions" },
];

const Forum = () => {
  const queryClient = useQueryClient();
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedTopic, setSelectedTopic] = useState<any>(null);
  const [newTopicOpen, setNewTopicOpen] = useState(false);
  const [topicForm, setTopicForm] = useState({ title: "", content: "", author_name: "", author_email: "", category: "general" });
  const [replyForm, setReplyForm] = useState({ content: "", author_name: "", author_email: "" });

  const { data: topics = [], isLoading } = useQuery({
    queryKey: ["forum-topics", selectedCategory],
    queryFn: async () => {
      let query = supabase.from("forum_topics").select("*").order("is_pinned", { ascending: false }).order("updated_at", { ascending: false });
      if (selectedCategory !== "all") query = query.eq("category", selectedCategory);
      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
  });

  const { data: replies = [] } = useQuery({
    queryKey: ["forum-replies", selectedTopic?.id],
    queryFn: async () => {
      if (!selectedTopic) return [];
      const { data, error } = await supabase.from("forum_replies").select("*").eq("topic_id", selectedTopic.id).order("created_at", { ascending: true });
      if (error) throw error;
      return data;
    },
    enabled: !!selectedTopic,
  });

  const createTopic = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from("forum_topics").insert([topicForm]);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["forum-topics"] });
      setNewTopicOpen(false);
      setTopicForm({ title: "", content: "", author_name: "", author_email: "", category: "general" });
      toast.success("Sujet créé avec succès !");
    },
    onError: () => toast.error("Erreur lors de la création du sujet"),
  });

  const createReply = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from("forum_replies").insert([{ ...replyForm, topic_id: selectedTopic.id }]);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["forum-replies", selectedTopic?.id] });
      queryClient.invalidateQueries({ queryKey: ["forum-topics"] });
      setReplyForm({ content: "", author_name: "", author_email: "" });
      toast.success("Réponse publiée !");
    },
    onError: () => toast.error("Erreur lors de la publication"),
  });

  const openTopic = async (topic: any) => {
    setSelectedTopic(topic);
    await supabase.from("forum_topics").update({ view_count: (topic.view_count || 0) + 1 }).eq("id", topic.id);
  };

  if (selectedTopic) {
    return (
      <>
        <Helmet><title>{selectedTopic.title} - Forum | Inocent KOFFI</title></Helmet>
        <div className="min-h-screen">
          <Navbar />
          <div className="pt-20 pb-16">
            <div className="container mx-auto px-4 max-w-4xl">
              <button onClick={() => setSelectedTopic(null)} className="text-sm text-primary hover:underline mb-6 inline-block">
                ← Retour au forum
              </button>

              {/* Topic */}
              <div className="bg-card border border-border rounded-2xl p-6 mb-6">
                <div className="flex items-center gap-2 mb-3">
                  {selectedTopic.is_pinned && <Pin className="w-4 h-4 text-accent" />}
                  {selectedTopic.is_locked && <Lock className="w-4 h-4 text-destructive" />}
                  <span className="text-xs font-medium text-accent bg-accent/10 px-2 py-0.5 rounded">
                    {CATEGORIES.find(c => c.value === selectedTopic.category)?.label || selectedTopic.category}
                  </span>
                </div>
                <h1 className="text-2xl font-bold text-foreground mb-3">{selectedTopic.title}</h1>
                <p className="text-muted-foreground whitespace-pre-wrap leading-relaxed">{selectedTopic.content}</p>
                <div className="mt-4 flex items-center gap-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1"><User className="w-3.5 h-3.5" /> {selectedTopic.author_name}</span>
                  <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {format(new Date(selectedTopic.created_at), "dd MMM yyyy HH:mm", { locale: fr })}</span>
                  <span className="flex items-center gap-1"><Eye className="w-3.5 h-3.5" /> {selectedTopic.view_count} vues</span>
                </div>
              </div>

              {/* Replies */}
              <div className="space-y-4 mb-8">
                <h3 className="font-semibold text-foreground">{replies.length} réponse{replies.length !== 1 ? "s" : ""}</h3>
                {replies.map((reply: any) => (
                  <div key={reply.id} className="bg-secondary/50 border border-border/50 rounded-xl p-5">
                    <p className="text-foreground whitespace-pre-wrap leading-relaxed">{reply.content}</p>
                    <div className="mt-3 flex items-center gap-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1"><User className="w-3.5 h-3.5" /> {reply.author_name}</span>
                      <span>{format(new Date(reply.created_at), "dd MMM yyyy HH:mm", { locale: fr })}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Reply Form */}
              {!selectedTopic.is_locked && (
                <div className="bg-card border border-border rounded-2xl p-6">
                  <h3 className="font-semibold text-foreground mb-4">Répondre</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                    <Input placeholder="Votre nom *" value={replyForm.author_name} onChange={e => setReplyForm({ ...replyForm, author_name: e.target.value })} />
                    <Input placeholder="Email (optionnel)" value={replyForm.author_email} onChange={e => setReplyForm({ ...replyForm, author_email: e.target.value })} />
                  </div>
                  <Textarea placeholder="Votre réponse..." className="mb-3 min-h-[100px]" value={replyForm.content} onChange={e => setReplyForm({ ...replyForm, content: e.target.value })} />
                  <Button onClick={() => createReply.mutate()} disabled={!replyForm.author_name || !replyForm.content || createReply.isPending}>
                    <Send className="w-4 h-4 mr-2" /> Publier
                  </Button>
                </div>
              )}
            </div>
          </div>
          <Footer />
        </div>
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>Forum - Inocent KOFFI | Discussions & Échanges</title>
        <meta name="description" content="Forum de discussions sur l'agriculture, la technologie, l'entrepreneuriat et l'innovation en Côte d'Ivoire." />
      </Helmet>

      <div className="min-h-screen">
        <Navbar />
        <section className="pt-24 pb-8 bg-gradient-to-br from-background via-secondary to-background">
          <div className="container mx-auto px-4 text-center max-w-3xl">
            <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-4">
              <MessageSquare className="inline w-10 h-10 mr-3 text-accent" />
              Forum
            </h1>
            <p className="text-muted-foreground text-lg">Échangeons sur l'agriculture, la technologie, l'entrepreneuriat et l'avenir de l'Afrique.</p>
          </div>
        </section>

        <section className="py-8">
          <div className="container mx-auto px-4 max-w-4xl">
            {/* Controls */}
            <div className="flex flex-col sm:flex-row gap-3 mb-6 items-start sm:items-center justify-between">
              <div className="flex flex-wrap gap-2">
                <button onClick={() => setSelectedCategory("all")} className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${selectedCategory === "all" ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground hover:bg-secondary/80"}`}>
                  Tous
                </button>
                {CATEGORIES.map(cat => (
                  <button key={cat.value} onClick={() => setSelectedCategory(cat.value)} className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${selectedCategory === cat.value ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground hover:bg-secondary/80"}`}>
                    {cat.label}
                  </button>
                ))}
              </div>
              <Dialog open={newTopicOpen} onOpenChange={setNewTopicOpen}>
                <DialogTrigger asChild>
                  <Button><Plus className="w-4 h-4 mr-2" /> Nouveau sujet</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-lg">
                  <DialogHeader><DialogTitle>Créer un sujet</DialogTitle></DialogHeader>
                  <div className="space-y-3">
                    <Input placeholder="Votre nom *" value={topicForm.author_name} onChange={e => setTopicForm({ ...topicForm, author_name: e.target.value })} />
                    <Input placeholder="Email (optionnel)" value={topicForm.author_email} onChange={e => setTopicForm({ ...topicForm, author_email: e.target.value })} />
                    <Select value={topicForm.category} onValueChange={v => setTopicForm({ ...topicForm, category: v })}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>{CATEGORIES.map(c => <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>)}</SelectContent>
                    </Select>
                    <Input placeholder="Titre du sujet *" value={topicForm.title} onChange={e => setTopicForm({ ...topicForm, title: e.target.value })} />
                    <Textarea placeholder="Contenu de votre sujet..." className="min-h-[120px]" value={topicForm.content} onChange={e => setTopicForm({ ...topicForm, content: e.target.value })} />
                    <Button className="w-full" onClick={() => createTopic.mutate()} disabled={!topicForm.title || !topicForm.content || !topicForm.author_name || createTopic.isPending}>
                      Publier le sujet
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            {/* Topics List */}
            {isLoading ? (
              <div className="text-center py-12"><div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div></div>
            ) : topics.length === 0 ? (
              <div className="text-center py-16 bg-secondary/30 rounded-2xl">
                <MessageSquare className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">Aucun sujet pour le moment. Soyez le premier à lancer la discussion !</p>
              </div>
            ) : (
              <div className="space-y-3">
                {topics.map((topic: any) => (
                  <button
                    key={topic.id}
                    onClick={() => openTopic(topic)}
                    className="w-full text-left bg-card border border-border rounded-xl p-5 hover:shadow-md hover:border-primary/30 transition-all"
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1.5">
                          {topic.is_pinned && <Pin className="w-3.5 h-3.5 text-accent flex-shrink-0" />}
                          {topic.is_locked && <Lock className="w-3.5 h-3.5 text-destructive flex-shrink-0" />}
                          <span className="text-xs font-medium text-accent">{CATEGORIES.find(c => c.value === topic.category)?.label}</span>
                        </div>
                        <h3 className="font-semibold text-foreground mb-1 truncate">{topic.title}</h3>
                        <p className="text-sm text-muted-foreground line-clamp-2">{topic.content}</p>
                        <div className="mt-2 flex items-center gap-4 text-xs text-muted-foreground">
                          <span>{topic.author_name}</span>
                          <span>{format(new Date(topic.created_at), "dd MMM yyyy", { locale: fr })}</span>
                        </div>
                      </div>
                      <div className="flex-shrink-0 text-center space-y-1">
                        <div className="text-sm font-bold text-foreground">{topic.reply_count}</div>
                        <div className="text-xs text-muted-foreground">réponses</div>
                        <div className="text-xs text-muted-foreground flex items-center gap-1 mt-1"><Eye className="w-3 h-3" /> {topic.view_count}</div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
};

export default Forum;
