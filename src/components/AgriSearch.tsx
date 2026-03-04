import { useState } from "react";
import { Search, Loader2, X, ArrowRight, BookOpen, ExternalLink, Download, Printer, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

interface SearchResult {
  title: string;
  summary: string;
  sections: { title: string; content: string; sources?: string[] }[];
  keyFacts: string[];
  references?: { title: string; url?: string; type?: string }[];
  relatedTopics?: string[];
}

const AgriSearch = () => {
  const [query, setQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [result, setResult] = useState<SearchResult | null>(null);
  const [showPopup, setShowPopup] = useState(false);
  const navigate = useNavigate();

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsSearching(true);
    try {
      const { data, error } = await supabase.functions.invoke("agri-search", {
        body: { query: query.trim() },
      });

      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      
      setResult(data.data);
      setShowPopup(true);
    } catch (err: any) {
      toast.error(err.message || "Erreur lors de la recherche");
    } finally {
      setIsSearching(false);
    }
  };

  const handleViewFull = () => {
    setShowPopup(false);
    // Store result in sessionStorage for the results page
    sessionStorage.setItem("agri-search-result", JSON.stringify(result));
    sessionStorage.setItem("agri-search-query", query);
    navigate("/recherche");
  };

  return (
    <>
      <motion.form 
        onSubmit={handleSearch} 
        className="w-full max-w-xl mx-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.8 }}
      >
        <div className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-accent transition-colors" />
          <Input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Rechercher sur l'agriculture mondiale..."
            className="pl-12 pr-28 py-6 text-base rounded-full border-2 border-border/50 focus:border-accent bg-background/80 backdrop-blur-sm shadow-lg"
            disabled={isSearching}
          />
          <Button 
            type="submit" 
            size="sm" 
            disabled={isSearching || !query.trim()}
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full px-5 bg-gradient-to-r from-accent to-accent/80 hover:from-accent/90 hover:to-accent/70 text-accent-foreground"
          >
            {isSearching ? <Loader2 className="w-4 h-4 animate-spin" /> : <>Rechercher</>}
          </Button>
        </div>
        <p className="text-xs text-muted-foreground/60 text-center mt-2">
          Recherche assistée par IA — Agriculture, développement rural, marchés mondiaux
        </p>
      </motion.form>

      {/* Results Popup */}
      <Dialog open={showPopup} onOpenChange={setShowPopup}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-foreground flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-accent" />
              {result?.title}
            </DialogTitle>
          </DialogHeader>
          
          {result && (
            <div className="space-y-4">
              <p className="text-muted-foreground leading-relaxed border-l-4 border-accent pl-4">
                {result.summary}
              </p>

              {result.keyFacts && result.keyFacts.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {result.keyFacts.slice(0, 4).map((fact, i) => (
                    <div key={i} className="flex items-start gap-2 p-3 bg-accent/5 rounded-lg border border-accent/10">
                      <ChevronRight className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-foreground">{fact}</span>
                    </div>
                  ))}
                </div>
              )}

              {result.sections?.slice(0, 2).map((section, i) => (
                <div key={i}>
                  <h4 className="font-semibold text-foreground mb-2">{section.title}</h4>
                  <div 
                    className="text-sm text-muted-foreground leading-relaxed prose prose-sm max-w-none" 
                    dangerouslySetInnerHTML={{ __html: section.content.slice(0, 500) + (section.content.length > 500 ? '...' : '') }} 
                  />
                </div>
              ))}

              <div className="flex gap-3 pt-4 border-t border-border">
                <Button onClick={handleViewFull} className="flex-1 bg-gradient-to-r from-primary to-accent text-primary-foreground">
                  Voir l'analyse complète <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
                <Button variant="outline" onClick={() => setShowPopup(false)}>
                  Fermer
                </Button>
              </div>

              <p className="text-[10px] text-muted-foreground/50 text-center">
                Inocent KOFFI — Innovation & Consultation | ikoffi.agricapital.ci
              </p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AgriSearch;
