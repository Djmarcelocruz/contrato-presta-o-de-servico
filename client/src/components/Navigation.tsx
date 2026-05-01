import { useLocation } from "wouter";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  Users,
  Package,
  TrendingUp,
  FileText,
  Briefcase,
  Receipt,
  BarChart3,
  Settings,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";

interface NavItem {
  label: string;
  path: string;
  icon: React.ReactNode;
  description: string;
}

const navItems: NavItem[] = [
  {
    label: "Dashboard",
    path: "/",
    icon: <LayoutDashboard className="w-5 h-5" />,
    description: "Resumo financeiro e alertas",
  },
  {
    label: "Clientes",
    path: "/clients",
    icon: <Users className="w-5 h-5" />,
    description: "Gestão de clientes",
  },
  {
    label: "Estoque",
    path: "/inventory",
    icon: <Package className="w-5 h-5" />,
    description: "Controle de equipamentos",
  },
  {
    label: "Fluxo de Caixa",
    path: "/cash-flow",
    icon: <TrendingUp className="w-5 h-5" />,
    description: "Entradas e saídas",
  },
  {
    label: "Orçamentos",
    path: "/budgets",
    icon: <FileText className="w-5 h-5" />,
    description: "Criar orçamentos",
  },
  {
    label: "Contratos",
    path: "/contracts",
    icon: <Briefcase className="w-5 h-5" />,
    description: "Contratos de serviço",
  },
  {
    label: "Recibos",
    path: "/receipts",
    icon: <Receipt className="w-5 h-5" />,
    description: "Recibos de pagamento",
  },
  {
    label: "Relatórios",
    path: "/reports",
    icon: <BarChart3 className="w-5 h-5" />,
    description: "Análises financeiras",
  },
];

export default function Navigation() {
  const [location, setLocation] = useLocation();
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path: string) => location === path;

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden md:fixed md:left-0 md:top-0 md:w-64 md:h-screen md:bg-background md:border-r-2 md:border-foreground md:flex md:flex-col md:pt-8 md:z-40">
      {/* Logo */}
      <div className="px-6 mb-8">
        <img src="/logo-djbrow.png" alt="DJ Brow" className="w-full h-auto mb-4" />
        <div className="h-1 bg-gradient-to-r from-primary via-primary to-transparent"></div>
      </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-4 space-y-2 overflow-y-auto">
          {navItems.map((item) => (
            <button
              key={item.path}
              onClick={() => setLocation(item.path)}
              className={`w-full text-left px-4 py-3 border-2 transition-all group ${
                isActive(item.path)
                  ? "border-primary bg-primary/10 text-foreground"
                  : "border-foreground text-muted-foreground hover:border-primary hover:text-foreground"
              }`}
            >
              <div className="flex items-center gap-3 mb-1">
                {item.icon}
                <span className="font-bold text-sm">{item.label}</span>
              </div>
              <p className="text-xs text-muted-foreground ml-8 group-hover:text-foreground/70">
                {item.description}
              </p>
            </button>
          ))}
        </nav>

        {/* Footer */}
        <div className="px-4 py-4 border-t-2 border-foreground space-y-2">
          <button
            onClick={() => setLocation("/settings")}
            className="w-full text-left px-4 py-2 border-2 border-foreground text-foreground hover:bg-foreground/10 transition-colors flex items-center gap-2"
          >
            <Settings className="w-4 h-4" />
            <span className="text-sm font-bold">Configurações</span>
          </button>
          <button
            onClick={() => logout()}
            className="w-full text-left px-4 py-2 border-2 border-destructive text-destructive hover:bg-destructive/10 transition-colors flex items-center gap-2"
          >
            <LogOut className="w-4 h-4" />
            <span className="text-sm font-bold">Sair</span>
          </button>
        </div>
      </div>

      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 bg-background border-b-2 border-foreground z-50 p-4 flex items-center justify-between">
        <h1 className="text-brutal-sm">DJ BROW</h1>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 border-2 border-foreground"
        >
          {mobileMenuOpen ? (
            <X className="w-5 h-5" />
          ) : (
            <Menu className="w-5 h-5" />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed top-16 left-0 right-0 bottom-0 bg-background border-b-2 border-foreground z-40 overflow-y-auto p-4 space-y-2">
          {navItems.map((item) => (
            <button
              key={item.path}
              onClick={() => {
                setLocation(item.path);
                setMobileMenuOpen(false);
              }}
              className={`w-full text-left px-4 py-3 border-2 transition-all ${
                isActive(item.path)
                  ? "border-primary bg-primary/10 text-foreground"
                  : "border-foreground text-muted-foreground hover:border-primary"
              }`}
            >
              <div className="flex items-center gap-3">
                {item.icon}
                <div>
                  <p className="font-bold text-sm">{item.label}</p>
                  <p className="text-xs text-muted-foreground">
                    {item.description}
                  </p>
                </div>
              </div>
            </button>
          ))}

          <div className="border-t-2 border-foreground pt-4 mt-4 space-y-2">
            <button
              onClick={() => {
                setLocation("/settings");
                setMobileMenuOpen(false);
              }}
              className="w-full text-left px-4 py-2 border-2 border-foreground text-foreground hover:bg-foreground/10 flex items-center gap-2"
            >
              <Settings className="w-4 h-4" />
              <span className="text-sm font-bold">Configurações</span>
            </button>
            <button
              onClick={() => logout()}
              className="w-full text-left px-4 py-2 border-2 border-destructive text-destructive hover:bg-destructive/10 flex items-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              <span className="text-sm font-bold">Sair</span>
            </button>
          </div>
        </div>
      )}
    </>
  );
}
