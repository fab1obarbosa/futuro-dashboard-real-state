
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { Home, Calculator, TrendingUp, Building, DollarSign, HelpCircle } from "lucide-react";

export function AppSidebar() {
  const menuItems = [
    {
      title: "Simulador",
      url: "#",
      icon: Calculator,
    },
    {
      title: "Análise de Imóveis",
      url: "#",
      icon: Building,
    },
    {
      title: "Rentabilidade",
      url: "#",
      icon: TrendingUp,
    },
    {
      title: "Financiamento",
      url: "#",
      icon: DollarSign,
    },
  ];

  return (
    <Sidebar className="border-r border-border/50 bg-sidebar-background">
      <SidebarHeader className="p-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
            <Home className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-sidebar-foreground">ImóvelSim</h2>
            <p className="text-xs text-sidebar-foreground/70">Simulador Imobiliário</p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-sidebar-foreground/70 font-medium px-3">
            Ferramentas
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild className="hover:bg-sidebar-accent">
                    <a href={item.url} className="flex items-center gap-3 px-3 py-2 text-sidebar-foreground hover:text-sidebar-accent-foreground">
                      <item.icon className="w-4 h-4" />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4">
        <div className="flex items-center gap-2 text-xs text-sidebar-foreground/50">
          <HelpCircle className="w-4 h-4" />
          <span>Ajuda & Suporte</span>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
