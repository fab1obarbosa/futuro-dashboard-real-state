
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Menu, Bell, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        {/* Header Mobile */}
        <header className="fixed top-0 left-0 right-0 z-50 h-16 bg-card/95 backdrop-blur-sm border-b border-border/50 flex items-center justify-between px-4 lg:hidden">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2"
            >
              <Menu className="w-5 h-5" />
            </Button>
            <h1 className="text-lg font-bold text-foreground">FinSim Pro</h1>
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" className="p-2">
              <Bell className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="sm" className="p-2">
              <User className="w-5 h-5" />
            </Button>
          </div>
        </header>

        {/* Sidebar */}
        <div className={`
          fixed lg:relative top-0 left-0 z-40 h-full
          transform transition-transform duration-300 ease-in-out
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}>
          <AppSidebar />
        </div>

        {/* Overlay para mobile */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/50 z-30 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
        <main className="flex-1 flex flex-col lg:ml-0">
          {/* Header Desktop */}
          <header className="hidden lg:flex h-16 bg-card/50 backdrop-blur-sm border-b border-border/50 items-center justify-between px-6">
            <div>
              <h1 className="text-xl font-bold text-foreground">Simulador Financeiro</h1>
              <p className="text-sm text-muted-foreground">Planeje seu futuro financeiro</p>
            </div>
            
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" className="p-2">
                <Bell className="w-5 h-5" />
              </Button>
              <div className="w-8 h-8 bg-gradient-primary rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-primary-foreground" />
              </div>
            </div>
          </header>

          {/* Content */}
          <div className="flex-1 p-4 lg:p-6 mt-16 lg:mt-0">
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
