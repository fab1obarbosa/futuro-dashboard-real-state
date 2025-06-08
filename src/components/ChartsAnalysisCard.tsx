
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, AreaChart, Area, Legend } from 'recharts';
import { BarChart3, Download, TrendingUp, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PropertyData {
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
  
  // Cálculos de custos
  const custosDescontadosAluguel = revenueData.inquilinoPagaCustos === "sim" ? 0 : (condominio + iptu + despesasFixas);
  const vacanciaPerc = parseFloat(revenueData.vacanciaMedia) || 8.0;
  const vacanciaEstimada = (aluguelBruto * vacanciaPerc) / 100;
  const receitaLiquida = aluguelBruto - custosDescontadosAluguel - vacanciaEstimada;
  
  // ROI corrigido
  const roiMensal = valorCompra > 0 ? (receitaLiquida / valorCompra) * 100 : 0;
  const roiAnual = roiMensal * 12;
  
  // Sinalização baseada no ROI
  const getSemaforo = (roi: number) => {
    if (roi >= 12) return { cor: "bg-green-500", texto: "Viável", emoji: "✅" };
    if (roi >= 8) return { cor: "bg-yellow-500", texto: "Arriscado", emoji: "⚠️" };
    return { cor: "bg-red-500", texto: "Não Viável", emoji: "❌" };
  };

  const semaforo = getSemaforo(roiAnual);

  // Dados para gráfico de pizza - receitas vs despesas
  const pieData = [
    { name: 'Receita Líquida', value: Math.max(0, receitaLiquida), fill: 'hsl(var(--primary))' },
    { name: 'Custos do Financiamento', value: valorParcela, fill: 'hsl(var(--destructive))' }
  ];

  // Dados para comparativo de investimentos (pizza)
  const investmentPieData = [
    { name: 'Imóvel', value: roiAnual, fill: 'hsl(var(--primary))' },
    { name: 'CDI', value: 11.75, fill: 'hsl(var(--accent))' },
    { name: 'Poupança', value: 6.17, fill: 'hsl(var(--muted))' }
  ];

  // Evolução patrimonial - aluguel vs revenda (10 anos)
  const evolutionData = Array.from({ length: 11 }, (_, i) => ({
    ano: i,
    aluguelAcumulado: receitaLiquida * 12 * i,
    valorizacaoImovel: valorCompra * Math.pow(1.05, i),
    patrimonioTotal: (receitaLiquida * 12 * i) + (valorCompra * Math.pow(1.05, i))
  }));

  // Gráfico de rentabilidade mensal
  const rentabilidadeData = Array.from({ length: 12 }, (_, i) => ({
    mes: `Mês ${i + 1}`,
    receita: aluguelBruto,
    vacancia: vacanciaEstimada,
    custosInquilino: custosDescontadosAluguel,
    receitaLiquida: receitaLiquida
  }));

  // Gráfico de valorização do imóvel para revenda
  const valorizacaoData = Array.from({ length: 11 }, (_, i) => ({
    ano: i,
    valorImovel: valorCompra * Math.pow(1.05, i),
    ganhoValorizacao: (valorCompra * Math.pow(1.05, i)) - valorCompra
  }));

  const COLORS = ['hsl(var(--primary))', 'hsl(var(--accent))', 'hsl(var(--destructive))', 'hsl(var(--yellow-primary))'];

  const generatePDFReport = () => {
    const reportData = {
      propertyData,
      revenueData,
      calculations: {
        valorCompra,
        receitaLiquida,
        roiAnual,
        valorParcela,
        payback: valorCompra / (receitaLiquida * 12)
      }
    };
    
    // Criar dados estruturados para o relatório
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
- ROI Anual: ${roiAnual.toFixed(2)}%
- Status do Investimento: ${semaforo.texto}

PROJEÇÕES:
- Retorno em 5 anos: ${formatCurrency(receitaLiquida * 12 * 5)}
- Valorização estimada em 5 anos: ${formatCurrency(valorCompra * Math.pow(1.05, 5) - valorCompra)}
`;
    
    // Criar blob e download
    const blob = new Blob([reportContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `relatorio-investimento-${propertyData.cidade}.txt`;
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
              <p className="text-xl font-bold text-primary">{roiMensal.toFixed(2)}%</p>
            </div>
            <div>
              <h3 className="text-xs text-muted-foreground mb-1">ROI Anual</h3>
              <p className="text-xl font-bold text-primary">{roiAnual.toFixed(2)}%</p>
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
              Receitas vs Despesas
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
            <CardTitle className="text-sm">Comparativo de Investimentos (%)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={investmentPieData}
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
            <CardTitle className="text-sm">Rentabilidade Mensal - Fluxo de Caixa</CardTitle>
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
                  <Area type="monotone" dataKey="receitaLiquida" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.3} name="Receita Líquida" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Valorização do Imóvel para Revenda */}
        <Card className="bg-gradient-card border-border/50 shadow-lg">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Valorização do Imóvel (Revenda)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={valorizacaoData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="ano" stroke="hsl(var(--muted-foreground))" fontSize={10} />
                  <YAxis stroke="hsl(var(--muted-foreground))" tickFormatter={formatCurrency} fontSize={10} />
                  <Tooltip formatter={(value: number) => formatCurrency(value)} />
                  <Legend />
                  <Line type="monotone" dataKey="valorImovel" stroke="hsl(var(--accent))" strokeWidth={2} name="Valor do Imóvel" />
                  <Line type="monotone" dataKey="ganhoValorizacao" stroke="hsl(var(--primary))" strokeWidth={2} name="Ganho por Valorização" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Evolução Patrimonial */}
        <Card className="bg-gradient-card border-border/50 shadow-lg lg:col-span-2">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Evolução Patrimonial - Aluguel vs Revenda (10 anos)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={evolutionData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="ano" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <YAxis stroke="hsl(var(--muted-foreground))" tickFormatter={formatCurrency} fontSize={12} />
                  <Tooltip formatter={(value: number) => formatCurrency(value)} />
                  <Legend />
                  <Line type="monotone" dataKey="aluguelAcumulado" stroke="hsl(var(--primary))" strokeWidth={3} name="Aluguel Acumulado" />
                  <Line type="monotone" dataKey="valorizacaoImovel" stroke="hsl(var(--accent))" strokeWidth={3} name="Valor do Imóvel" />
                  <Line type="monotone" dataKey="patrimonioTotal" stroke="hsl(var(--yellow-primary))" strokeWidth={3} name="Patrimônio Total" />
                </LineChart>
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
              <h3 className="font-bold text-base text-primary mb-3 flex items-center gap-2">
                <DollarSign className="w-4 h-4" />
                Indicadores Principais
              </h3>
              <div className="space-y-2">
                <div className="flex justify-between items-center p-3 bg-background/50 rounded-lg">
                  <span className="text-foreground text-sm">💰 ROI Anual:</span>
                  <span className="font-bold text-lg text-primary">{roiAnual.toFixed(2)}%</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-background/50 rounded-lg">
                  <span className="text-foreground text-sm">💵 Receita Líquida:</span>
                  <span className="font-bold text-lg text-primary">{formatCurrency(receitaLiquida)}/mês</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-background/50 rounded-lg">
                  <span className="text-foreground text-sm">📊 Status:</span>
                  <span className={`font-bold text-lg ${semaforo.texto === 'Viável' ? 'text-green-400' : semaforo.texto === 'Arriscado' ? 'text-yellow-400' : 'text-red-highlight'}`}>
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
                <div className="p-3 bg-background/50 rounded-lg">
                  <span className="text-foreground text-sm">⚠️ Retornos podem variar conforme região</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
