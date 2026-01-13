import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { 
  Menu, LayoutDashboard, Star, Handshake, MessageSquare, 
  Mail, FileText, Image, BarChart3, Globe, Settings, Database, LogOut 
} from "lucide-react";
import { cn } from "@/lib/utils";

interface AdminMobileMenuProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  onLogout: () => void;
}

const menuItems = [
  { id: "dashboard", icon: LayoutDashboard, label: "Tableau de bord" },
  { id: "testimonials", icon: Star, label: "Témoignages" },
  { id: "partnerships", icon: Handshake, label: "Partenariats" },
  { id: "contacts", icon: MessageSquare, label: "Messages" },
  { id: "newsletter", icon: Mail, label: "Newsletter" },
  { id: "blog", icon: FileText, label: "Blog" },
  { id: "comments", icon: MessageSquare, label: "Commentaires" },
  { id: "media", icon: Image, label: "Médias" },
  { id: "database", icon: Database, label: "Base de données" },
  { id: "analytics", icon: BarChart3, label: "Analytiques" },
  { id: "seo", icon: Globe, label: "SEO" },
  { id: "settings", icon: Settings, label: "Paramètres" },
];

const AdminMobileMenu = ({ activeTab, onTabChange, onLogout }: AdminMobileMenuProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleTabClick = (tabId: string) => {
    onTabChange(tabId);
    setIsOpen(false);
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="lg:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Menu Admin</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-72 p-0">
        <SheetHeader className="p-4 border-b">
          <SheetTitle className="text-left">
            <span className="text-primary font-bold">AGRICAPITAL</span>
            <span className="block text-sm text-muted-foreground font-normal">Administration</span>
          </SheetTitle>
        </SheetHeader>
        
        <nav className="flex flex-col h-[calc(100vh-80px)]">
          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleTabClick(item.id)}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 text-left",
                  activeTab === item.id
                    ? "bg-primary text-primary-foreground shadow-md"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <item.icon className="h-5 w-5 flex-shrink-0" />
                <span className="font-medium">{item.label}</span>
              </button>
            ))}
          </div>
          
          <div className="p-4 border-t">
            <Button 
              variant="outline" 
              onClick={onLogout} 
              className="w-full justify-start"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Déconnexion
            </Button>
          </div>
        </nav>
      </SheetContent>
    </Sheet>
  );
};

export default AdminMobileMenu;
