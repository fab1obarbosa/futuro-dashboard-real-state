
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
  aportesMensais: string;
  inquilinoPagaCustos: string;
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
  const valorParcela = parseFloat(propertyData.valorParcela) / 100 || 0;
  
  const custoCartorio = valorCompra * taxaCartorio;
  const totalJurosFinanciamento = prazoFinanciamento > 0 ? (valorParcela * prazoFinanciamento * 12) - valorFinanciado : 0;
  
  // Custo total corrigido: valor do imóvel + juros do financiamento + outros custos - entrada
  const custoTotalInvestimento = valorCompra + totalJurosFinanciamento + reforma + outrasDespesas + custoCartorio - valorEntrada;
  
  const aluguelBruto = parseFloat(revenueData.aluguelMensal) / 100 || 0;
  const condominio = parseFloat(revenueData.condominio) / 100 || 0;
  const iptu = parseFloat(revenueData.iptu) / 100 || 0;
  const despesasFixas = parseFloat(revenueData.despesasFixas) / 100 || 0;
  const vacanciaPerc = parseFloat(revenueData.vacanciaMedia) || 8.0;
  const aportesMensais = parseFloat(revenueData.aportesMensais) / 100 || 0;
  
  // Custos mensais apenas do financiamento
  const custosMensais = valorParcela;
  
  // Receita líquida considerando se inquilino paga custos à parte
  const custosDescontadosAluguel = revenueData.inquilinoPagaCustos === "sim" ? 0 : (condominio + iptu + despesasFixas);
  const vacanciaEstimada = (aluguelBruto * vacanciaPerc) / 100;
  const receitaLiquidaMensal = aluguelBruto - custosDescontadosAluguel - vacanciaEstimada;
  const receitaLiquidaAnual = receitaLiquidaMensal * 12;
  
  const resultadoMensal = receitaLiquidaMensal - custosMensais;
  
  // ROI baseado apenas no valor do imóvel
  const roiMensal = valorCompra > 0 ? (receitaLiquidaMensal / valorCompra) * 100 : 0;
  const roiAnual = roiMensal * 12;
  
  // Payback baseado no valor do investimento total
  const fluxoMensalTotal = receitaLiquidaMensal + aportesMensais;
  const paybackMeses = fluxoMensalTotal > 0 ? valorCompra / fluxoMensalTotal : 0;
  
  // Valorização anual estimada (5% ao ano)
  const valorizacaoAnual = 5;
  const valorFuturoImovel = valorCompra * Math.pow(1 + valorizacaoAnual / 100, 1);
  const ganhoValorizacao = valorFuturoImovel - valorCompra;
  
  // Comparativos (valores aproximados)
  const cdiAnual = 11.75;
  const poupancaAnual = 6.17;

  const analysisItems = [
    {
      title: "Custo Total do Investimento",
      value: formatCurrency(custoTotalInvestimento),
      icon: Target,
      color: "text-yellow-primary",
      bgColor: "bg-primary/10"
    },
    {
      title: "Custos Mensais (Financiamento)",
      value: formatCurrency(custosMensais),
      icon: Calculator,
      color: "text-red-highlight",
      bgColor: "bg-red-500/10"
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
      color: "text-yellow-primary",
      bgColor: "bg-primary/10"
    },
    {
      title: "ROI Anual",
      value: `${roiAnual.toFixed(2)}%`,
      icon: TrendingUp,
      color: "text-yellow-primary",
      bgColor: "bg-primary/10"
    },
    {
      title: "Resultado Mensal Final",
      value: formatCurrency(resultadoMensal),
      icon: Target,
      color: resultadoMensal > 0 ? "text-accent" : "text-red-highlight",
      bgColor: resultadoMensal > 0 ? "bg-accent/10" : "bg-red-500/10"
    },
    {
      title: "Payback Estimado",
      value: `${paybackMeses.toFixed(0)} meses (${(paybackMeses/12).toFixed(1)} anos)`,
      icon: Home,
      color: "text-yellow-primary",
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
    <Card className="bg-gradient-card border-border/50 shadow-lg">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-3 text-lg sm:text-xl text-foreground">
          <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
            <Target className="w-3 h-3 sm:w-4 sm:h-4 text-primary-foreground" />
          </div>
          Análise do Imóvel
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3">
          {analysisItems.map((item, index) => (
            <div 
              key={item.title}
              className="p-2 sm:p-3 rounded-lg bg-background/30 border border-border/30 hover:bg-background/50 transition-all duration-200"
            >
              <div className="flex items-center gap-2 mb-1 sm:mb-2">
                <div className={`w-5 h-5 sm:w-6 sm:h-6 ${item.bgColor} rounded-lg flex items-center justify-center`}>
                  <item.icon className={`w-2.5 h-2.5 sm:w-3 sm:h-3 ${item.color}`} />
                </div>
                <span className="text-xs font-medium text-muted-foreground">{item.title}</span>
              </div>
              <div className={`text-xs sm:text-sm font-bold ${item.color}`}>
                {item.value}
              </div>
            </div>
          ))}
        </div>

        {/* Resumo dos Dados Financeiros */}
        <div className="mt-4 p-3 bg-gradient-primary/10 rounded-lg border border-primary/20">
          <h3 className="font-semibold text-foreground mb-2 text-sm sm:text-base">💰 Resumo Financeiro</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs sm:text-sm text-muted-foreground">
            <div>
              <p><strong>Valor do Imóvel:</strong> {formatCurrency(valorCompra)}</p>
              <p><strong>Valor da Entrada:</strong> {formatCurrency(valorEntrada)}</p>
              <p><strong>Valor Financiado:</strong> {formatCurrency(valorFinanciado)}</p>
            </div>
            <div>
              <p><strong>Parcela Mensal:</strong> {formatCurrency(valorParcela)}</p>
              <p><strong>Juros Total:</strong> {formatCurrency(totalJurosFinanciamento)}</p>
              <p><strong>Prazo:</strong> {prazoFinanciamento} anos</p>
            </div>
          </div>
        </div>

        {/* Resumo do Resultado Mensal */}
        <div className="mt-3 p-3 bg-gradient-accent/10 rounded-lg border border-accent/20">
          <h3 className="font-semibold text-foreground mb-2 text-sm sm:text-base">Resumo do Resultado Mensal</h3>
          <div className="text-xs sm:text-sm text-muted-foreground">
            <p>Receita Líquida: {formatCurrency(receitaLiquidaMensal)} - Custo Financiamento: {formatCurrency(custosMensais)} = <strong className={resultadoMensal >= 0 ? "text-accent" : "text-red-highlight"}>{formatCurrency(resultadoMensal)}</strong></p>
            {revenueData.inquilinoPagaCustos === "sim" ? (
              <p className="mt-1 text-xs">*Inquilino paga custos separadamente (condomínio, IPTU, despesas fixas)</p>
            ) : (
              <p className="mt-1 text-xs">*Descontado do aluguel: Condomínio ({formatCurrency(condominio)}), IPTU ({formatCurrency(iptu)}), Outras Despesas ({formatCurrency(despesasFixas)})</p>
            )}
          </div>
        </div>

        {/* Comparativo de Investimentos */}
        <div className="mt-3 p-3 bg-gradient-accent/10 rounded-lg border border-accent/20">
          <h3 className="font-semibold text-foreground mb-3 text-sm sm:text-base">Comparativo de Investimentos</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3 text-xs sm:text-sm">
            <div className="text-center">
              <span className="text-muted-foreground">Imóvel (ROI)</span>
              <p className="font-bold text-lg text-yellow-primary">{roiAnual.toFixed(2)}%</p>
            </div>
            <div className="text-center">
              <span className="text-muted-foreground">CDI</span>
              <p className="font-bold text-lg text-accent">{cdiAnual}%</p>
            </div>
            <div className="text-center">
              <span className="text-muted-foreground">Poupança</span>
              <p className="font-bold text-lg text-accent">{poupancaAnual}%</p>
            </div>
          </div>
          
          {roiAnual <= Math.max(cdiAnual, poupancaAnual) && (
            <div className="mt-3 p-2 bg-red-500/10 border border-red-300/20 rounded-lg">
              <p className="text-xs text-red-highlight font-medium">
                ⚠️ Atenção: Este investimento tem rentabilidade inferior ao CDI ou Poupança.
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
