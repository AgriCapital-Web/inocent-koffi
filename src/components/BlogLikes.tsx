import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useToast } from "@/hooks/use-toast";

interface BlogLikesProps {
  postId: string;
}

const reactions = [
  { type: "like", emoji: "👍", label: "J'aime" },
  { type: "love", emoji: "❤️", label: "J'adore" },
  { type: "clap", emoji: "👏", label: "Bravo" },
  { type: "fire", emoji: "🔥", label: "Top" },
  { type: "light", emoji: "💡", label: "Inspirant" },
  { type: "think", emoji: "🤔", label: "Intéressant" },
];

const BlogLikes = ({ postId }: BlogLikesProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [sessionId, setSessionId] = useState<string>("");
  const [userReaction, setUserReaction] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  // Generate or retrieve session ID
  useEffect(() => {
    let id = localStorage.getItem("blog_session_id");
    if (!id) {
      id = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem("blog_session_id", id);
    }
    setSessionId(id);

    // Check if user already reacted
    const storedReaction = localStorage.getItem(`blog_reaction_${postId}`);
    if (storedReaction) {
      setUserReaction(storedReaction);
    }
  }, [postId]);

  // Fetch likes count
  const { data: likesData } = useQuery({
    queryKey: ["blog-likes", postId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("blog_likes")
        .select("reaction_type")
        .eq("post_id", postId);

      if (error) throw error;

      // Count by reaction type
      const counts: Record<string, number> = {};
      data?.forEach((like: { reaction_type: string }) => {
        counts[like.reaction_type] = (counts[like.reaction_type] || 0) + 1;
      });

      return {
        total: data?.length || 0,
        counts,
      };
    },
    enabled: !!postId,
  });

  const addLikeMutation = useMutation({
    mutationFn: async (reactionType: string) => {
      const { error } = await supabase.from("blog_likes").insert({
        post_id: postId,
        reaction_type: reactionType,
        session_id: sessionId,
      });
      if (error) throw error;
    },
    onSuccess: (_, reactionType) => {
      localStorage.setItem(`blog_reaction_${postId}`, reactionType);
      setUserReaction(reactionType);
      queryClient.invalidateQueries({ queryKey: ["blog-likes", postId] });
      toast({ title: "Merci pour votre réaction !" });
      setIsOpen(false);
    },
    onError: () => {
      toast({ title: "Erreur", description: "Impossible d'ajouter votre réaction", variant: "destructive" });
    },
  });

  const handleReaction = (reactionType: string) => {
    if (userReaction) {
      toast({ title: "Vous avez déjà réagi à cet article" });
      return;
    }
    addLikeMutation.mutate(reactionType);
  };

  // Get most popular reaction
  const mostPopular = likesData?.counts
    ? Object.entries(likesData.counts).sort((a, b) => b[1] - a[1])[0]?.[0]
    : "like";

  const displayEmoji = userReaction
    ? reactions.find((r) => r.type === userReaction)?.emoji
    : reactions.find((r) => r.type === mostPopular)?.emoji || "👍";

  return (
    <div className="flex items-center gap-2">
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            variant={userReaction ? "default" : "outline"}
            size="sm"
            className="gap-2 min-w-[80px]"
            disabled={!!userReaction}
          >
            <span className="text-lg">{displayEmoji}</span>
            <span className="font-semibold">{likesData?.total || 0}</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-2" align="start">
          <div className="flex gap-1">
            {reactions.map((reaction) => (
              <button
                key={reaction.type}
                onClick={() => handleReaction(reaction.type)}
                className="p-2 hover:bg-muted rounded-lg transition-all hover:scale-125 text-2xl"
                title={reaction.label}
              >
                {reaction.emoji}
              </button>
            ))}
          </div>
        </PopoverContent>
      </Popover>

      {/* Show reaction breakdown */}
      {likesData && likesData.total > 0 && (
        <div className="flex -space-x-1">
          {Object.entries(likesData.counts)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 3)
            .map(([type, count]) => {
              const reaction = reactions.find((r) => r.type === type);
              return (
                <span
                  key={type}
                  className="text-sm bg-muted px-1.5 py-0.5 rounded-full border-2 border-background"
                  title={`${count} ${reaction?.label}`}
                >
                  {reaction?.emoji}
                </span>
              );
            })}
        </div>
      )}
    </div>
  );
};

export default BlogLikes;
