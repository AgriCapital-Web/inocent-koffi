import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Star,
  Handshake,
  MessageSquare,
  Mail,
  FileText,
  Settings,
  Users,
  BarChart3,
  Database,
  Globe,
  Image,
} from "lucide-react";

interface NavItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  active?: boolean;
}

const NavItem = ({ to, icon, label, active }: NavItemProps) => (
  <Link
    to={to}
    className={cn(
      "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200",
      active
        ? "bg-primary text-primary-foreground shadow-md"
        : "text-muted-foreground hover:bg-muted hover:text-foreground"
    )}
  >
    {icon}
    <span className="font-medium">{label}</span>
  </Link>
);

interface AdminSidebarProps {
  currentSection: string;
  onSectionChange: (section: string) => void;
}

const AdminSidebar = ({ currentSection, onSectionChange }: AdminSidebarProps) => {
  const menuItems = [
    { id: "dashboard", icon: <LayoutDashboard className="h-5 w-5" />, label: "Tableau de bord" },
    { id: "testimonials", icon: <Star className="h-5 w-5" />, label: "Témoignages" },
    { id: "partnerships", icon: <Handshake className="h-5 w-5" />, label: "Partenariats" },
    { id: "contacts", icon: <MessageSquare className="h-5 w-5" />, label: "Messages" },
    { id: "newsletter", icon: <Mail className="h-5 w-5" />, label: "Newsletter" },
    { id: "blog", icon: <FileText className="h-5 w-5" />, label: "Blog" },
    { id: "media", icon: <Image className="h-5 w-5" />, label: "Médias" },
    { id: "analytics", icon: <BarChart3 className="h-5 w-5" />, label: "Analytiques" },
    { id: "seo", icon: <Globe className="h-5 w-5" />, label: "SEO" },
    { id: "settings", icon: <Settings className="h-5 w-5" />, label: "Paramètres" },
  ];

  return (
    <aside className="w-64 bg-card border-r min-h-screen p-4 hidden lg:block">
      <div className="space-y-2">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onSectionChange(item.id)}
            className={cn(
              "w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 text-left",
              currentSection === item.id
                ? "bg-primary text-primary-foreground shadow-md"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
          >
            {item.icon}
            <span className="font-medium">{item.label}</span>
          </button>
        ))}
      </div>
    </aside>
  );
};

export default AdminSidebar;
