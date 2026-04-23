import { useMemo, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Share2, Copy, Check, Link2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";
import { buildShortUrl } from "@/lib/shortUrl";

interface SocialSharePopupProps {
  url: string;
  title: string;
  description?: string;
  image?: string;
  children?: React.ReactNode;
}

interface ShareLink {
  name: string;
  icon: React.ReactNode;
  webUrl: string;
  appUrl?: string;
  bgClass: string;
  iconColor: string;
}

const SocialSharePopup = ({ url, title, description = "" }: SocialSharePopupProps) => {
  const [copied, setCopied] = useState(false);
  const [shortCopied, setShortCopied] = useState(false);
  const [open, setOpen] = useState(false);
  const [shortUrl, setShortUrl] = useState<string | null>(null);
  const [shareVersion, setShareVersion] = useState<string>("");
  const { toast } = useToast();

  const slug = useMemo(() => {
    try {
      const parsed = new URL(url);
      const parts = parsed.pathname.split("/").filter(Boolean);
      const blogIndex = parts.indexOf("blog");
      return blogIndex >= 0 ? parts[blogIndex + 1] || null : null;
    } catch {
      return url.match(/\/blog\/([^/?#]+)/)?.[1] || null;
    }
  }, [url]);

  // Build short URL like https://ikoffi.agricapital.ci/new/art004-026
  useEffect(() => {
    if (!slug || !open) return;
    let cancelled = false;
    (async () => {
      const { data } = await supabase
        .from("blog_posts")
        .select("article_number, published_at, updated_at, created_at")
        .eq("slug", slug)
        .maybeSingle();
      if (cancelled) return;
      if (data?.article_number) {
        setShortUrl(buildShortUrl(data.article_number, data.published_at));
        setShareVersion(buildShareVersion(data.updated_at || data.published_at || data.created_at || slug));
      }
    })();
    return () => { cancelled = true; };
  }, [slug, open]);

  // The URL we share publicly: short if available, otherwise the full article URL
  const shareUrl = appendShareVersion(shortUrl || url, shareVersion);
  const signature = "— Inocent KOFFI | Fondateur AGRICAPITAL SARL";
  const summaryText = (description || title).trim();
  const compactSummary = summaryText.length > 220 ? `${summaryText.slice(0, 219).trim()}…` : summaryText;
  const shareBody = `${title}\n\n${compactSummary}\n\n${signature}\n\nL'article complet à ce lien 👉`;
  const shareBodyWithLink = `${shareBody}\n${shareUrl}`;
  const whatsappBody = `*${title}*\n\n${compactSummary}\n\n_${signature}_\n\nL'article complet à ce lien 👉\n${shareUrl}`;

  const encodedShareBodyWithLink = encodeURIComponent(shareBodyWithLink);
  const encodedWhatsappBody = encodeURIComponent(whatsappBody);
  const encodedShareUrl = encodeURIComponent(shareUrl);
  const encodedTitle = encodeURIComponent(title);
  const encodedSummary = encodeURIComponent(compactSummary);

  const shareLinks: ShareLink[] = [
    {
      name: "Facebook",
      icon: (
        <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
        </svg>
      ),
      webUrl: `https://www.facebook.com/sharer/sharer.php?u=${encodedShareUrl}&quote=${encodedSummary}`,
      bgClass: "bg-[#1877F2] hover:bg-[#0d65d9]",
      iconColor: "text-white",
    },
    {
      name: "WhatsApp",
      icon: (
        <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884" />
        </svg>
      ),
      webUrl: `https://wa.me/?text=${encodedWhatsappBody}`,
      appUrl: `whatsapp://send?text=${encodedWhatsappBody}`,
      bgClass: "bg-[#25D366] hover:bg-[#1da851]",
      iconColor: "text-white",
    },
    {
      name: "Messenger",
      icon: (
        <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 0C5.373 0 0 4.974 0 11.111c0 3.498 1.744 6.614 4.469 8.654V24l4.088-2.242c1.092.301 2.246.464 3.443.464 6.627 0 12-4.974 12-11.111S18.627 0 12 0zm1.191 14.963l-3.055-3.26-5.963 3.26 6.559-6.963 3.131 3.26 5.886-3.26-6.558 6.963z" />
        </svg>
      ),
      webUrl: `https://www.facebook.com/dialog/send?link=${encodedShareUrl}&app_id=291494419107518&redirect_uri=${encodeURIComponent(url)}`,
      appUrl: `fb-messenger://share?link=${encodedShareUrl}`,
      bgClass: "bg-[#0084FF] hover:bg-[#0070dd]",
      iconColor: "text-white",
    },
    {
      name: "LinkedIn",
      icon: (
        <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
        </svg>
      ),
      webUrl: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedShareUrl}`,
      bgClass: "bg-[#0A66C2] hover:bg-[#084e96]",
      iconColor: "text-white",
    },
    {
      name: "X (Twitter)",
      icon: (
        <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      ),
      webUrl: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareBody)}&url=${encodedShareUrl}`,
      appUrl: `twitter://post?message=${encodeURIComponent(shareBodyWithLink)}`,
      bgClass: "bg-foreground hover:bg-foreground/85",
      iconColor: "text-background",
    },
    {
      name: "Telegram",
      icon: (
        <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 0C5.374 0 0 5.373 0 12s5.374 12 12 12 12-5.373 12-12S18.626 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.022c.242-.213-.054-.334-.373-.121l-6.869 4.326-2.96-.924c-.64-.203-.658-.643.135-.953l11.566-4.458c.538-.196 1.006.128.832.953z" />
        </svg>
      ),
      webUrl: `https://t.me/share/url?url=${encodedShareUrl}&text=${encodeURIComponent(shareBody)}`,
      appUrl: `tg://msg?text=${encodedShareBodyWithLink}`,
      bgClass: "bg-[#0088CC] hover:bg-[#006fa6]",
      iconColor: "text-white",
    },
    {
      name: "Email",
      icon: (
        <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
          <path d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 0 1 0 19.366V5.457c0-2.023 2.309-3.178 3.927-1.964L5.455 4.64 12 9.548l6.545-4.91 1.528-1.145C21.69 2.28 24 3.434 24 5.457z" />
        </svg>
      ),
      webUrl: `mailto:?subject=${encodedTitle}&body=${encodeURIComponent(shareBodyWithLink)}`,
      bgClass: "bg-[#EA4335] hover:bg-[#c5362b]",
      iconColor: "text-white",
    },
    {
      name: "SMS",
      icon: (
        <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
          <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z" />
        </svg>
      ),
      webUrl: `sms:?body=${encodeURIComponent(shareBodyWithLink)}`,
      bgClass: "bg-[#5BC236] hover:bg-[#4aa829]",
      iconColor: "text-white",
    },
  ];

  const copyToClipboard = async (text: string, label: string, setState: (v: boolean) => void) => {
    try {
      await navigator.clipboard.writeText(text);
      setState(true);
      toast({ title: `${label} copié !` });
      setTimeout(() => setState(false), 2000);
    } catch {
      toast({ title: "Erreur", description: "Impossible de copier", variant: "destructive" });
    }
  };

  const handleShare = async (link: ShareLink) => {
    const sessionId = localStorage.getItem("session_id") || crypto.randomUUID();
    localStorage.setItem("session_id", sessionId);

    if (slug) {
      const { data: postData } = await supabase
        .from("blog_posts")
        .select("id")
        .eq("slug", slug)
        .single();

      if (postData) {
        await supabase.from("article_shares").insert({
          post_id: postData.id,
          platform: link.name.toLowerCase(),
          session_id: sessionId,
        });
      }
    }

    const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
    if (isMobile && link.appUrl) {
      window.location.href = link.appUrl;
      setTimeout(() => {
        window.open(link.webUrl, "_blank", "noopener,noreferrer");
      }, 700);
      return;
    }

    window.open(link.webUrl, "_blank", "noopener,noreferrer,width=600,height=500");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Share2 className="w-4 h-4" />
          Partager
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto p-0 bg-card border-2">
        <div className="bg-gradient-to-br from-primary/10 via-card to-accent/10 p-5 sm:p-6">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-lg sm:text-xl text-foreground">
              <Share2 className="w-5 h-5 text-primary" />
              Partager cet article
            </DialogTitle>
          </DialogHeader>

          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
            className="mt-4 p-3 bg-background/70 backdrop-blur rounded-lg border border-border text-sm space-y-1"
          >
            <p className="font-semibold text-foreground line-clamp-2">{title}</p>
            {description && <p className="text-muted-foreground line-clamp-2">{compactSummary}</p>}
            <p className="text-xs text-primary italic font-medium">{signature}</p>
          </motion.div>

          <div className="grid grid-cols-4 gap-2.5 sm:gap-3 py-4 sm:py-5">
            <AnimatePresence>
              {shareLinks.map((link, index) => (
                <motion.button
                  key={link.name}
                  onClick={() => handleShare(link)}
                  initial={{ opacity: 0, scale: 0.85, y: 8 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ delay: index * 0.04, type: "spring", stiffness: 220, damping: 18 }}
                  whileHover={{ scale: 1.06, y: -2 }}
                  whileTap={{ scale: 0.94 }}
                  className={`flex flex-col items-center justify-center p-2.5 sm:p-3 rounded-xl shadow-sm hover:shadow-lg transition-shadow ${link.bgClass}`}
                  title={`Partager sur ${link.name}`}
                >
                  <span className={link.iconColor}>{link.icon}</span>
                  <span className={`text-[10px] sm:text-[11px] mt-1.5 font-semibold leading-tight text-center ${link.iconColor}`}>
                    {link.name}
                  </span>
                </motion.button>
              ))}
            </AnimatePresence>
          </div>

          <div className="space-y-2">
            {shortUrl && (
              <Button
                variant="default"
                size="sm"
                className="w-full gap-2 bg-primary hover:bg-primary/90"
                onClick={() => copyToClipboard(shortUrl, "Lien court", setShortCopied)}
              >
                {shortCopied ? <Check className="w-4 h-4" /> : <Link2 className="w-4 h-4" />}
                <span className="font-mono text-xs sm:text-sm">{shortCopied ? "Lien court copié !" : shortUrl.replace(/^https?:\/\//, "")}</span>
              </Button>
            )}
            <Button
              variant="outline"
              size="sm"
              className="w-full gap-2"
              onClick={() => copyToClipboard(url, "Lien", setCopied)}
            >
              {copied ? <Check className="w-4 h-4 text-primary" /> : <Copy className="w-4 h-4" />}
              {copied ? "Lien complet copié !" : "Copier le lien complet"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SocialSharePopup;

function buildShareVersion(value: string) {
  return value.replace(/[^0-9a-z]/gi, "").slice(0, 16) || Date.now().toString(36);
}

function appendShareVersion(url: string, version: string) {
  if (!version) return url;

  try {
    const parsed = new URL(url);
    parsed.searchParams.set("v", version);
    return parsed.toString();
  } catch {
    return url;
  }
}
