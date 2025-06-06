
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Target, TrendingUp, DollarSign, Home } from "lucide-react";

interface PropertyData {
  valorCompra: string;
  valorEntrada: string;
  valorFinanciado: string;
  valorParcela: string;
  reformaMobilia: string;
  outrasDespesas: string;
  taxaCartorio: string;
}

interface RevenueData {
  aluguelMensal: string;
  vacanciaMedia: string;
  condominio: string;
  iptu: string;
  despesasFixas: string;
}

interface PropertyAnalysisCardProps {
  propertyData: PropertyData;
  revenueData: RevenueData;
}

export function PropertyAnalysisCard({ propertyData, revenueData }: PropertyAnalysisCardProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  // Cálculos
  const valorCompra = parseFloat(propertyData.valorCompra) || 0;
  const valorEntrada = parseFloat(propertyData.valorEntrada) || 0;
  const reforma = parseFloat(propertyData.reformaMobilia) || 0;
  const outrasDespesas = parseFloat(propertyData.outrasDespesas) || 0;
  const taxaCartorio = (parseFloat(propertyData.taxaCartorio) || 0) / 100;
  
  const custoCartorio = valorCompra * taxaCartorio;
  const custoTotalInvestimento = valorEntrada + reforma + outrasDespesas + custoCartorio;
  
  const aluguelBruto = parseFloat(revenueData.aluguelMensal) || 0;
  const condominio = parseFloat(revenueData.condominio) || 0;
  const iptu = parseFloat(revenueData.iptu) || 0;
  const despesasFixas = parseFloat(revenueData.despesasFixas) || 0;
  const vacanciaPerc = parseFloat(revenueData.vacanciaMedia) || 0;
  
  const despesasMensais = condominio + iptu + despesasFixas;
  const vacanciaEstimada = (aluguelBruto * vacanciaPerc) / 100;
  const receitaLiquidaMensal = aluguelBruto - despesasMensais - vacanciaEstimada;
  const receitaLiquidaAnual = receitaLiquidaMensal * 12;
  
  const roi = custoTotalInvestimento > 0 ? (receitaLiquidaAnual / custoTotalInvestimento) * 100 : 0;
  const paybackMeses = receitaLiquidaMensal > 0 ? custoTotalInvestimento / receitaLiquidaMensal : 0;
  
  // Comparativos (valores aproximados)
  const cdiAnual = 11.75; // CDI atual aproximado
  const poupancaAnual = 6.17; // Poupança atual aproximada
  
  const melhorQueInvestimentos = roi > cdiAnual && roi > poupancaAnual;

  const analysisItems = [
    {
      title: "Custo Total do Investimento",
      value: formatCurrency(custoTotalInvestimento),
      icon: Target,
      color: "text-primary",
      bgColor: "bg-primary/10"
    },
    {
      title: "ROI Anual",
      value: `${roi.toFixed(2)}%`,
      icon: TrendingUp,
      color: "text-accent",
      bgColor: "bg-accent/10"
    },
    {
      title: "Receita Líquida Mensal",
      value: formatCurrency(receitaLiquidaMensal),
      icon: DollarSign,
      color: "text-primary",
      bgColor: "bg-primary/10"
    },
    {
      title: "Receita Líquida Anual",
      value: formatCurrency(receitaLiquidaAnual),
      icon: DollarSign,
      color: "text-accent",
      bgColor: "bg-accent/10"
    },
    {
      title: "Payback Estimado",
      value: `${paybackMeses.toFixed(0)} meses (${(paybackMeses/12).toFixed(1)} anos)`,
      icon: Home,
      color: "text-primary",
      bgColor: "bg-primary/10"
    }
  ];

  return (
    <Card className="bg-gradient-card border-border/50 shadow-xl animate-slide-up">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-3 text-xl text-foreground">
          <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
            <Target className="w-5 h-5 text-primary-foreground" />
          </div>
          Análise do Imóvel
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {analysisItems.map((item, index) => (
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
              <div className={`text-xl font-bold ${item.color}`}>
                {item.value}
              </div>
            </div>
          ))}
        </div>

        {/* Comparativo de Investimentos */}
        <div className="mt-6 p-4 bg-gradient-accent/10 rounded-lg border border-accent/20">
          <h3 className="font-semibold text-foreground mb-3">Comparativo de Investimentos</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="text-center">
              <span className="text-muted-foreground">Imóvel (ROI)</span>
              <p className="font-bold text-xl text-primary">{roi.toFixed(2)}%</p>
            </div>
            <div className="text-center">
              <span className="text-muted-foreground">CDI</span>
              <p className="font-bold text-xl text-accent">{cdiAnual}%</p>
            </div>
            <div className="text-center">
              <span className="text-muted-foreground">Poupança</span>
              <p className="font-bold text-xl text-accent">{poupancaAnual}%</p>
            </div>
          </div>
          
          {!melhorQueInvestimentos && (
            <div className="mt-4 p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
              <p className="text-sm text-destructive font-medium">
                ⚠️ Atenção: Este investimento tem rentabilidade inferior ao CDI ou Poupança.
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
