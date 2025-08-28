import { BookOpen, Calendar, FileText, MapPin, Upload, Home, GraduationCap, CloudSun, X, Sparkles, BookMarked, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useNavigate, useLocation } from "react-router-dom";
interface SidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
  className?: string;
  onClose?: () => void;
}
const menuItems = [{
  id: "dashboard",
  label: "Dashboard",
  icon: Home,
  route: "/"
}, {
  id: "caderno",
  label: "Caderno Digital",
  icon: BookOpen,
  route: "/caderno"
}, {
  id: "agenda",
  label: "Agenda",
  icon: Calendar,
  route: "/agenda"
}, {
  id: "biblioteca",
  label: "Biblioteca PDF",
  icon: FileText,
  route: "/biblioteca"
}, {
  id: "visitas",
  label: "Visitas Técnicas",
  icon: MapPin,
  route: "/visitas"
}, {
  id: "upload",
  label: "Upload",
  icon: Upload,
  route: "/upload"
}, {
  id: "notas",
  label: "Notas",
  icon: GraduationCap,
  route: "/notas"
}, {
  id: "disciplinas",
  label: "Disciplinas",
  icon: BookMarked,
  route: "/disciplinas"
}, {
  id: "simulado",
  label: "Simulado IA",
  icon: Target,
  route: "/simulado"
}, {
  id: "agrostudy-ia",
  label: "AgroStudy IA",
  icon: Sparkles,
  route: "/agrostudy-ia"
}, {
  id: "clima",
  label: "Clima",
  icon: CloudSun,
  route: "/clima"
}];
export const Sidebar = ({
  activeSection,
  onSectionChange,
  className,
  onClose
}: SidebarProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const handleItemClick = (item: typeof menuItems[0]) => {
    onSectionChange(item.id);
    navigate(item.route);
    onClose?.(); // Fecha o sidebar no mobile após selecionar
  };
  const getActiveSection = () => {
    const currentPath = location.pathname;
    const activeItem = menuItems.find(item => item.route === currentPath);
    return activeItem?.id || activeSection;
  };
  const currentActiveSection = getActiveSection();
  return <aside className={cn("w-64 bg-card border-r border-border overflow-y-auto", className)}>
      {/* Header do sidebar mobile */}
      <div className="md:hidden flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 bg-agro-green rounded-md flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-xs">AS</span>
          </div>
          <h2 className="font-semibold text-agro-green">AgroStudy</h2>
        </div>
        
      </div>

      <nav className="p-4 space-y-2">
        {menuItems.map(item => <Button key={item.id} variant={currentActiveSection === item.id ? "secondary" : "ghost"} className={cn("w-full justify-start h-10 transition-all duration-200", currentActiveSection === item.id && "bg-agro-green/10 text-agro-green border-l-2 border-agro-green")} onClick={() => handleItemClick(item)}>
            <item.icon className="mr-3 h-4 w-4" />
            {item.label}
          </Button>)}
      </nav>
      
      {/* Widget rápido de clima */}
      <div className="mx-4 mt-6 p-3 bg-gradient-to-r from-agro-sky/10 to-agro-green/10 rounded-lg border border-agro-green/20">
        <div className="flex items-center space-x-2 text-sm">
          <CloudSun className="h-4 w-4 text-agro-sky" />
          <div>
            <p className="font-medium text-agro-green">Hoje</p>
            <p className="text-muted-foreground text-xs">25°C • Ensolarado</p>
          </div>
        </div>
      </div>
    </aside>;
};

export default Sidebar;