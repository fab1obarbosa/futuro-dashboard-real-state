
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Target, TrendingUp, DollarSign, Home, Calculator } from "lucide-react";

interface PropertyData {
  valorCompra: string;
  valorEntrada: string;
  valorFinanciado: string;
  valorParcela: string;
  reformaMobilia: string;
  outrasDespesas: string;
  taxaCartorio: string;
  prazoFinanciamento: string;
  percentualJuros: string;
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
  const valorCompra = parseFloat(propertyData.valorCompra) / 100 || 0;
  const valorEntrada = parseFloat(propertyData.valorEntrada) / 100 || 0;
  const valorFinanciado = parseFloat(propertyData.valorFinanciado) / 100 || 0;
  const reforma = parseFloat(propertyData.reformaMobilia) / 100 || 0;
  const outrasDespesas = parseFloat(propertyData.outrasDespesas) / 100 || 0;
  const taxaCartorio = (parseFloat(propertyData.taxaCartorio) || 0) / 100;
  const prazoFinanciamento = parseFloat(propertyData.prazoFinanciamento) || 0;
  const jurosAnual = parseFloat(propertyData.percentualJuros) || 0;
  
  const custoCartorio = valorCompra * taxaCartorio;
  const valorParcela = parseFloat(propertyData.valorParcela) / 100 || 0;
  const totalJurosFinanciamento = (valorParcela * prazoFinanciamento) - valorFinanciado;
  const custoTotalInvestimento = valorCompra + totalJurosFinanciamento + reforma + outrasDespesas + custoCartorio;
  
  const aluguelBruto = parseFloat(revenueData.aluguelMensal) / 100 || 0;
  const condominio = parseFloat(revenueData.condominio) / 100 || 0;
  const iptu = parseFloat(revenueData.iptu) / 100 || 0;
  const despesasFixas = parseFloat(revenueData.despesasFixas) / 100 || 0;
  const vacanciaPerc = parseFloat(revenueData.vacanciaMedia) || 0;
  
  const custosMensais = valorParcela + condominio + iptu + despesasFixas;
  const vacanciaEstimada = (aluguelBruto * vacanciaPerc) / 100;
  const receitaLiquidaMensal = aluguelBruto - vacanciaEstimada;
  const receitaLiquidaAnual = receitaLiquidaMensal * 12;
  const resultadoMensal = receitaLiquidaMensal - custosMensais;
  
  const roiMensal = custoTotalInvestimento > 0 ? (resultadoMensal / custoTotalInvestimento) * 100 : 0;
  const roiAnual = roiMensal * 12;
  const paybackMeses = resultadoMensal > 0 ? custoTotalInvestimento / resultadoMensal : 0;
  
  // Valorização anual estimada (5% ao ano)
  const valorizacaoAnual = 5;
  const valorFuturoImovel = valorCompra * Math.pow(1 + valorizacaoAnual / 100, 1);
  const ganhoValorizacao = valorFuturoImovel - valorCompra;
  
  // Comparativos (valores aproximados)
  const cdiAnual = 11.75; // CDI atual aproximado
  const poupancaAnual = 6.17; // Poupança atual aproximada
  
  const melhorQueInvestimentos = roiAnual > cdiAnual && roiAnual > poupancaAnual;

  const analysisItems = [
    {
      title: "Custo Total do Investimento",
      value: formatCurrency(custoTotalInvestimento),
      icon: Target,
      color: "text-primary",
      bgColor: "bg-primary/10"
    },
    {
      title: "Custos Mensais",
      value: formatCurrency(custosMensais),
      icon: Calculator,
      color: "text-destructive",
      bgColor: "bg-destructive/10"
    },
    {
      title: "Receita Líquida Mensal",
      value: formatCurrency(receitaLiquidaMensal),
      icon: DollarSign,
      color: "text-accent",
      bgColor: "bg-accent/10"
    },
    {
      title: "Receita Líquida Anual",
      value: formatCurrency(receitaLiquidaAnual),
      icon: DollarSign,
      color: "text-accent",
      bgColor: "bg-accent/10"
    },
    {
      title: "ROI Mensal",
      value: `${roiMensal.toFixed(2)}%`,
      icon: TrendingUp,
      color: "text-primary",
      bgColor: "bg-primary/10"
    },
    {
      title: "ROI Anual",
      value: `${roiAnual.toFixed(2)}%`,
      icon: TrendingUp,
      color: "text-primary",
      bgColor: "bg-primary/10"
    },
    {
      title: "Resultado Mensal Final",
      value: formatCurrency(resultadoMensal),
      icon: Target,
      color: resultadoMensal > 0 ? "text-accent" : "text-destructive",
      bgColor: resultadoMensal > 0 ? "bg-accent/10" : "bg-destructive/10"
    },
    {
      title: "Payback Estimado",
      value: `${paybackMeses.toFixed(0)} meses (${(paybackMeses/12).toFixed(1)} anos)`,
      icon: Home,
      color: "text-primary",
      bgColor: "bg-primary/10"
    },
    {
      title: "Valorização Anual",
      value: `${valorizacaoAnual}% (${formatCurrency(ganhoValorizacao)})`,
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
              <div className={`text-lg font-bold ${item.color}`}>
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
              <p className="font-bold text-xl text-primary">{roiAnual.toFixed(2)}%</p>
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
