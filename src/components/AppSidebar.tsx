
import { Calculator, BarChart3, TrendingUp, DollarSign, PiggyBank, Target } from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";

const menuItems = [
  { 
    title: "Simulador", 
    url: "/", 
    icon: Calculator,
    description: "Simule seus investimentos"
  },
  { 
    title: "Relatórios", 
    url: "/relatorios", 
    icon: BarChart3,
    description: "Visualize seus resultados"
  },
  { 
    title: "Análises", 
    url: "/analises", 
    icon: TrendingUp,
    description: "Acompanhe tendências"
  },
  { 
    title: "Calculadoras", 
    url: "/calculadoras", 
    icon: DollarSign,
    description: "Ferramentas financeiras"
  },
];

export function AppSidebar() {
  const { collapsed } = useSidebar();
  const location = useLocation();
  const currentPath = location.pathname;

  const isActive = (path: string) => currentPath === path;
  const getNavCls = ({ isActive }: { isActive: boolean }) =>
    `${isActive 
      ? "bg-gradient-primary text-primary-foreground font-semibold shadow-lg" 
      : "hover:bg-accent/50 hover:text-accent-foreground"
    } transition-all duration-200 rounded-lg`;

  return (
    <Sidebar
      className={`${collapsed ? "w-16" : "w-72"} transition-all duration-300 border-r border-border/50`}
      collapsible
    >
      <div className="p-4 border-b border-border/50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
            <PiggyBank className="w-6 h-6 text-primary-foreground" />
          </div>
          {!collapsed && (
            <div>
              <h2 className="text-lg font-bold text-foreground">FinSim Pro</h2>
              <p className="text-xs text-muted-foreground">Simulador Financeiro</p>
            </div>
          )}
        </div>
      </div>

      <SidebarTrigger className="absolute -right-4 top-6 z-10 bg-card border border-border rounded-full p-2 shadow-lg hover:bg-accent" />

      <SidebarContent className="px-4 py-6">
        <SidebarGroup>
          <SidebarGroupLabel className="text-muted-foreground font-medium mb-4">
            {!collapsed && "Menu Principal"}
          </SidebarGroupLabel>

          <SidebarGroupContent>
            <SidebarMenu className="space-y-2">
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild className="h-auto p-0">
                    <NavLink 
                      to={item.url} 
                      end 
                      className={getNavCls}
                    >
                      <div className="flex items-center gap-3 p-3 w-full">
                        <item.icon className="w-5 h-5 flex-shrink-0" />
                        {!collapsed && (
                          <div className="flex-1 text-left">
                            <div className="font-medium">{item.title}</div>
                            <div className="text-xs opacity-70">{item.description}</div>
                          </div>
                        )}
                      </div>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {!collapsed && (
          <div className="mt-8 p-4 bg-gradient-card rounded-lg border border-border/50">
            <div className="flex items-center gap-2 mb-2">
              <Target className="w-5 h-5 text-primary" />
              <span className="font-semibold text-foreground">Meta Mensal</span>
            </div>
            <div className="text-2xl font-bold text-primary mb-1">R$ 2.500</div>
            <div className="text-xs text-muted-foreground">75% atingido</div>
            <div className="mt-3 bg-background/50 rounded-full h-2">
              <div className="bg-gradient-primary h-2 rounded-full w-3/4"></div>
            </div>
          </div>
        )}
      </SidebarContent>
    </Sidebar>
  );
}
