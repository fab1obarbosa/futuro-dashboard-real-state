
import { Bell, User, Download } from "lucide-react";
import { Button } from "@/components/ui/button";

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const handleDownloadReport = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card/50 backdrop-blur-sm border-b border-border/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 lg:px-6 h-16 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-foreground">Construa seu Futuro</h1>
            <p className="text-sm text-muted-foreground hidden md:block">Simulador de Investimentos Imobiliários</p>
          </div>
          
          <div className="flex items-center gap-4">
            <Button 
              onClick={handleDownloadReport}
              variant="outline" 
              size="sm" 
              className="hidden md:flex"
            >
              <Download className="w-4 h-4 mr-2" />
              Baixar Relatório
            </Button>
            <Button 
              onClick={handleDownloadReport}
              variant="outline" 
              size="sm" 
              className="md:hidden p-2"
            >
              <Download className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="p-4 lg:p-6">
        {children}
      </main>
    </div>
  );
}
