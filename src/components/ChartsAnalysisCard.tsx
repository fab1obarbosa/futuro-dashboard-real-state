
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, AreaChart, Area, Legend, CandlestickChart } from 'recharts';
import { BarChart3, Download, TrendingUp, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PropertyData {
  estado: string;
  cidade: string;
  tipo: string;
  finalidade: string;
  valorCompra: string;
  valorEntrada: string;
  valorParcela: string;
  prazoFinanciamento: string;
  valorFinanciado: string;
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
  inquilinoPagaCustos: string;
}

interface ChartsAnalysisCardProps {
  propertyData: PropertyData;
  revenueData: RevenueData;
}

export function ChartsAnalysisCard({ propertyData, revenueData }: ChartsAnalysisCardProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  // Cálculos corrigidos baseados nos dados reais
  const valorCompra = parseFloat(propertyData.valorCompra) / 100 || 0;
  const valorEntrada = parseFloat(propertyData.valorEntrada) / 100 || 0;
  const aluguelBruto = parseFloat(revenueData.aluguelMensal) / 100 || 0;
  const valorParcela = parseFloat(propertyData.valorParcela) / 100 || 0;
  const condominio = parseFloat(revenueData.condominio) / 100 || 0;
  const iptu = parseFloat(revenueData.iptu) / 100 || 0;
  const despesasFixas = parseFloat(revenueData.despesasFixas) / 100 || 0;
  const reforma = parseFloat(propertyData.reformaMobilia) / 100 || 0;
  const outrasDespesas = parseFloat(propertyData.outrasDespesas) / 100 || 0;
  const prazoFinanciamento = parseFloat(propertyData.prazoFinanciamento) || 0;
  
  // Cálculos de custos
  const custosDescontadosAluguel = revenueData.inquilinoPagaCustos === "sim" ? 0 : (condominio + iptu + despesasFixas);
  const vacanciaPerc = parseFloat(revenueData.vacanciaMedia) || 8.0;
  const vacanciaEstimada = (aluguelBruto * vacanciaPerc) / 100;
  const receitaLiquida = aluguelBruto - custosDescontadosAluguel - vacanciaEstimada;
  
  // ROI corrigido baseado no valor total investido
  const valorTotalInvestido = valorCompra + reforma + outrasDespesas;
  const roiMensal = valorTotalInvestido > 0 ? (receitaLiquida / valorTotalInvestido) * 100 : 0;
  const roiAnual = roiMensal * 12;
  
  // Sinalização corrigida baseada no fluxo de caixa
  const fluxoMensalLiquido = receitaLiquida - valorParcela;
  const getSemaforo = (fluxo: number, roi: number) => {
    if (fluxo > 0 && roi >= 8) return { cor: "bg-green-500", texto: "Viável", emoji: "✅" };
    if (fluxo >= 0 && roi >= 6) return { cor: "bg-yellow-500", texto: "Moderado", emoji: "⚠️" };
    return { cor: "bg-red-500", texto: "Arriscado", emoji: "❌" };
  };

  const semaforo = getSemaforo(fluxoMensalLiquido, roiAnual);

  // Dados para gráfico de pizza - receitas vs despesas corrigido
  const pieData = [
    { name: 'Receita Líquida', value: Math.max(0, receitaLiquida), fill: '#FFD700' },
    { name: 'Parcelas Financiamento', value: valorParcela, fill: '#e80916' }
  ];

  // Dados para comparativo de investimentos vs CDI/Poupança
  const investmentComparisonData = [
    { name: 'Imóvel (ROI)', value: roiAnual, fill: '#FFD700' },
    { name: 'CDI', value: 11.75, fill: '#4FC3F7' },
    { name: 'Poupança', value: 6.17, fill: '#81C784' }
  ];

  // Gráfico de velas - Comparativo Longo vs Curto Prazo
  const candlestickData = Array.from({ length: 10 }, (_, i) => {
    const ano = i + 1;
    const rendaAcumuladaAluguel = receitaLiquida * 12 * ano;
    const valorizacaoImovel = valorCompra * Math.pow(1.05, ano) - valorCompra;
    const totalImovel = rendaAcumuladaAluguel + valorizacaoImovel;
    const cdiAcumulado = valorTotalInvestido * Math.pow(1.1175, ano) - valorTotalInvestido;
    const poupancaAcumulada = valorTotalInvestido * Math.pow(1.0617, ano) - valorTotalInvestido;
    
    return {
      ano: `Ano ${ano}`,
      imovel: totalImovel,
      cdi: cdiAcumulado,
      poupanca: poupancaAcumulada,
      aluguelAcumulado: rendaAcumuladaAluguel,
      valorizacao: valorizacaoImovel
    };
  });

  // Evolução patrimonial em colunas
  const evolutionData = Array.from({ length: 11 }, (_, i) => ({
    ano: i,
    aluguelAcumulado: receitaLiquida * 12 * i,
    valorizacaoImovel: valorCompra * Math.pow(1.05, i),
    patrimonioTotal: (receitaLiquida * 12 * i) + (valorCompra * Math.pow(1.05, i))
  }));

  // Gráfico de rentabilidade mensal
  const rentabilidadeData = Array.from({ length: 12 }, (_, i) => ({
    mes: `Mês ${i + 1}`,
    receitaLiquida: receitaLiquida,
    lucroMensal: fluxoMensalLiquido
  }));

  // Gráfico de valorização para revenda
  const valorizacaoRevendaData = Array.from({ length: 11 }, (_, i) => ({
    ano: i,
    valorImovel: valorCompra * Math.pow(1.05, i),
    ganhoValorizacao: (valorCompra * Math.pow(1.05, i)) - valorCompra,
    percentualGanho: ((valorCompra * Math.pow(1.05, i)) / valorCompra - 1) * 100
  }));

  const COLORS = ['#FFD700', '#4FC3F7', '#e80916', '#81C784'];

  const generatePDFReport = () => {
    const reportData = {
      propertyData,
      revenueData,
      calculations: {
        valorCompra,
        receitaLiquida,
        roiAnual,
        valorParcela,
        fluxoMensalLiquido,
        payback: valorTotalInvestido / (receitaLiquida * 12)
      }
    };
    
    const reportContent = `
RELATÓRIO DE ANÁLISE DE INVESTIMENTO IMOBILIÁRIO

DADOS DO IMÓVEL:
- Localização: ${propertyData.estado} - ${propertyData.cidade}
- Tipo: ${propertyData.tipo}
- Valor de Compra: ${formatCurrency(valorCompra)}
- Valor da Entrada: ${formatCurrency(valorEntrada)}
- Valor Financiado: ${formatCurrency(parseFloat(propertyData.valorFinanciado) / 100)}

ANÁLISE FINANCEIRA:
- Aluguel Mensal: ${formatCurrency(aluguelBruto)}
- Receita Líquida Mensal: ${formatCurrency(receitaLiquida)}
- Parcela Financiamento: ${formatCurrency(valorParcela)}
- Fluxo Mensal Líquido: ${formatCurrency(fluxoMensalLiquido)}
- ROI Anual: ${roiAnual.toFixed(2)}%
- Status do Investimento: ${semaforo.texto}

PROJEÇÕES:
- Retorno em 5 anos (aluguel): ${formatCurrency(receitaLiquida * 12 * 5)}
- Valorização estimada em 5 anos: ${formatCurrency(valorCompra * Math.pow(1.05, 5) - valorCompra)}
- Patrimônio total em 5 anos: ${formatCurrency((receitaLiquida * 12 * 5) + (valorCompra * Math.pow(1.05, 5)))}

IMPORTANTE: Todo retorno e valorização podem variar de acordo com o bairro e acontecimentos 
da localização no período, podendo valorizar ou desvalorizar.
`;
    
    const blob = new Blob([reportContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `relatorio-investimento-${propertyData.cidade || 'imovel'}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4">
      {/* Header com botão de download */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-foreground">Gráficos e Análises</h2>
        <Button onClick={generatePDFReport} className="bg-gradient-primary text-sm">
          <Download className="w-4 h-4 mr-2" />
          Baixar Relatório
        </Button>
      </div>

      {/* ROI e Sinalização */}
      <Card className="bg-gradient-card border-border/50 shadow-lg">
        <CardHeader className="pb-3">
          <CardTitle className="text-center text-lg">Análise de Viabilidade</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div>
              <h3 className="text-xs text-muted-foreground mb-1">ROI Mensal</h3>
              <p className="text-xl font-bold text-yellow-primary">{roiMensal.toFixed(2)}%</p>
            </div>
            <div>
              <h3 className="text-xs text-muted-foreground mb-1">ROI Anual</h3>
              <p className="text-xl font-bold text-yellow-primary">{roiAnual.toFixed(2)}%</p>
            </div>
            <div>
              <h3 className="text-xs text-muted-foreground mb-1">Sinalização</h3>
              <div className={`w-12 h-12 mx-auto rounded-full ${semaforo.cor} flex items-center justify-center`}>
                <span className="text-white text-lg">{semaforo.emoji}</span>
              </div>
              <p className="text-xs mt-1 font-medium">{semaforo.texto}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Gráficos em Grid Responsivo */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        
        {/* Receitas vs Despesas (Pizza) */}
        <Card className="bg-gradient-card border-border/50 shadow-lg">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm">
              <BarChart3 className="w-4 h-4" />
              Receitas vs Despesas Mensais
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    outerRadius={60}
                    dataKey="value"
                    label={({value}) => formatCurrency(value)}
                  />
                  <Tooltip formatter={(value: number) => formatCurrency(value)} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Comparativo de Investimentos (Pizza) */}
        <Card className="bg-gradient-card border-border/50 shadow-lg">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Comparativo ROI Anual (%)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={investmentComparisonData}
                    cx="50%"
                    cy="50%"
                    outerRadius={60}
                    dataKey="value"
                    label={({value}) => `${value.toFixed(1)}%`}
                  />
                  <Tooltip formatter={(value: number) => `${value.toFixed(2)}%`} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Rentabilidade Mensal */}
        <Card className="bg-gradient-card border-border/50 shadow-lg">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Fluxo de Caixa Mensal</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={rentabilidadeData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="mes" stroke="hsl(var(--muted-foreground))" fontSize={10} />
                  <YAxis stroke="hsl(var(--muted-foreground))" tickFormatter={formatCurrency} fontSize={10} />
                  <Tooltip formatter={(value: number) => formatCurrency(value)} />
                  <Legend />
                  <Area type="monotone" dataKey="receitaLiquida" stroke="#FFD700" fill="#FFD700" fillOpacity={0.3} name="Receita Líquida" />
                  <Area type="monotone" dataKey="lucroMensal" stroke="#4FC3F7" fill="#4FC3F7" fillOpacity={0.3} name="Lucro Final" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Valorização para Revenda */}
        <Card className="bg-gradient-card border-border/50 shadow-lg">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Valorização para Revenda</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={valorizacaoRevendaData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="ano" stroke="hsl(var(--muted-foreground))" fontSize={10} />
                  <YAxis stroke="hsl(var(--muted-foreground))" tickFormatter={formatCurrency} fontSize={10} />
                  <Tooltip formatter={(value: number) => formatCurrency(value)} />
                  <Legend />
                  <Line type="monotone" dataKey="valorImovel" stroke="#4FC3F7" strokeWidth={2} name="Valor do Imóvel" />
                  <Line type="monotone" dataKey="ganhoValorizacao" stroke="#FFD700" strokeWidth={2} name="Ganho por Valorização" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Comparativo Longo Prazo - Gráfico de Velas */}
        <Card className="bg-gradient-card border-border/50 shadow-lg lg:col-span-2">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Comparativo Longo Prazo: Imóvel vs CDI vs Poupança</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={candlestickData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="ano" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <YAxis stroke="hsl(var(--muted-foreground))" tickFormatter={formatCurrency} fontSize={12} />
                  <Tooltip formatter={(value: number) => formatCurrency(value)} />
                  <Legend />
                  <Line type="monotone" dataKey="imovel" stroke="#FFD700" strokeWidth={3} name="Total Imóvel (Aluguel + Valorização)" />
                  <Line type="monotone" dataKey="cdi" stroke="#4FC3F7" strokeWidth={3} name="CDI Acumulado" />
                  <Line type="monotone" dataKey="poupanca" stroke="#81C784" strokeWidth={3} name="Poupança Acumulada" />
                  <Line type="monotone" dataKey="aluguelAcumulado" stroke="#e80916" strokeWidth={2} strokeDasharray="5 5" name="Apenas Aluguel" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Evolução Patrimonial em Colunas */}
        <Card className="bg-gradient-card border-border/50 shadow-lg lg:col-span-2">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Evolução Patrimonial (10 anos)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={evolutionData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="ano" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <YAxis stroke="hsl(var(--muted-foreground))" tickFormatter={formatCurrency} fontSize={12} />
                  <Tooltip formatter={(value: number) => formatCurrency(value)} />
                  <Legend />
                  <Bar dataKey="aluguelAcumulado" fill="#FFD700" name="Aluguel Acumulado" />
                  <Bar dataKey="valorizacaoImovel" fill="#4FC3F7" name="Valor do Imóvel" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Resumo Final Melhorado */}
      <Card className="bg-gradient-to-br from-primary/20 via-accent/20 to-yellow-primary/20 border-primary/30 shadow-xl">
        <CardHeader>
          <CardTitle className="text-center text-lg flex items-center justify-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Resumo Final da Análise
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h3 className="font-bold text-base text-yellow-primary mb-3 flex items-center gap-2">
                <DollarSign className="w-4 h-4" />
                Indicadores Principais
              </h3>
              <div className="space-y-2">
                <div className="flex justify-between items-center p-3 bg-background/50 rounded-lg">
                  <span className="text-foreground text-sm">💰 ROI Anual:</span>
                  <span className="font-bold text-lg text-yellow-primary">{roiAnual.toFixed(2)}%</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-background/50 rounded-lg">
                  <span className="text-foreground text-sm">💵 Fluxo Mensal:</span>
                  <span className={`font-bold text-lg ${fluxoMensalLiquido >= 0 ? 'text-green-400' : 'text-red-highlight'}`}>{formatCurrency(fluxoMensalLiquido)}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-background/50 rounded-lg">
                  <span className="text-foreground text-sm">📊 Status:</span>
                  <span className={`font-bold text-lg ${semaforo.texto === 'Viável' ? 'text-green-400' : semaforo.texto === 'Moderado' ? 'text-yellow-400' : 'text-red-highlight'}`}>
                    {semaforo.texto}
                  </span>
                </div>
              </div>
            </div>
            <div className="space-y-3">
              <h3 className="font-bold text-base text-accent mb-3">💡 Recomendações</h3>
              <div className="space-y-2">
                <div className="p-3 bg-background/50 rounded-lg">
                  <span className="text-foreground text-sm">🔄 Considere renegociar o valor de compra</span>
                </div>
                <div className="p-3 bg-background/50 rounded-lg">
                  <span className="text-foreground text-sm">🏘️ Avalie outras opções na região</span>
                </div>
                <div className="p-3 bg-background/50 rounded-lg">
                  <span className="text-foreground text-sm">📈 Compare com outros investimentos</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Aviso sobre variações */}
      <div className="mt-4 p-4 bg-gradient-accent/10 rounded-lg border border-accent/20">
        <p className="text-sm text-muted-foreground text-center">
          ⚠️ <strong>Importante:</strong> Todo retorno e valorização podem variar de acordo com o bairro e acontecimentos da localização no período, podendo valorizar ou desvalorizar.
        </p>
      </div>
    </div>
  );
}
