
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { TrendingUp, DollarSign, Target, Percent, Home } from "lucide-react";

interface Results {
  rentabilidadeMensal: number;
  rentabilidadeAnual: number;
  valorFinalImovel: number;
  totalRecebidoAluguel: number;
  lucroTotal: number;
  retornoInvestimento: number;
  payback: number;
}

interface ResultsCardProps {
  results: Results | null;
}

export function ResultsCard({ results }: ResultsCardProps) {
  if (!results) {
    return (
      <Card className="bg-gradient-card border-border/50 shadow-xl animate-fade-in">
        <CardContent className="flex items-center justify-center h-64">
          <div className="text-center text-muted-foreground">
            <Home className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>Configure os parâmetros e clique em "Analisar" para ver os resultados</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const resultItems = [
    {
      title: "Rentabilidade Mensal",
      value: `${results.rentabilidadeMensal.toFixed(2)}%`,
      icon: Percent,
      color: "text-primary",
      bgColor: "bg-primary/10"
    },
    {
      title: "Rentabilidade Anual",
      value: `${results.rentabilidadeAnual.toFixed(2)}%`,
      icon: TrendingUp,
      color: "text-accent",
      bgColor: "bg-accent/10"
    },
    {
      title: "Valor Final do Imóvel",
      value: formatCurrency(results.valorFinalImovel),
      icon: Home,
      color: "text-primary",
      bgColor: "bg-primary/10"
    },
    {
      title: "Total Recebido (Aluguel)",
      value: formatCurrency(results.totalRecebidoAluguel),
      icon: DollarSign,
      color: "text-accent",
      bgColor: "bg-accent/10"
    },
    {
      title: "Lucro Total",
      value: formatCurrency(results.lucroTotal),
      icon: Target,
      color: "text-primary",
      bgColor: "bg-primary/10"
    },
    {
      title: "Payback (anos)",
      value: `${results.payback.toFixed(1)} anos`,
      icon: TrendingUp,
      color: "text-accent",
      bgColor: "bg-accent/10"
    }
  ];

  return (
    <Card className="bg-gradient-card border-border/50 shadow-xl animate-slide-up">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-3 text-xl text-foreground">
          <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-primary-foreground" />
          </div>
          Análise do Imóvel
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {resultItems.map((item, index) => (
            <div 
              key={item.title}
              className="p-4 rounded-lg bg-background/30 border border-border/30 hover:bg-background/50 transition-all duration-200"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex items-center gap-3 mb-2">
                <div className={`w-8 h-8 ${item.bgColor} rounded-lg flex items-center justify-center`}>
                  <item.icon className={`w-4 h-4 ${item.color}`} />
                </div>
                <span className="text-sm font-medium text-muted-foreground">{item.title}</span>
              </div>
              <div className={`text-2xl font-bold ${item.color}`}>
                {item.value}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 p-4 bg-gradient-accent/10 rounded-lg border border-accent/20">
          <div className="flex items-center gap-2 mb-2">
            <Home className="w-5 h-5 text-accent" />
            <span className="font-semibold text-foreground">Resumo do Investimento</span>
          </div>
          <p className="text-sm text-muted-foreground">
            Com uma rentabilidade anual de <strong className="text-accent">{results.rentabilidadeAnual.toFixed(1)}%</strong>, 
            seu investimento terá um retorno total de <strong className="text-primary">{formatCurrency(results.lucroTotal)}</strong> 
            em {results.payback.toFixed(1)} anos de payback.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
