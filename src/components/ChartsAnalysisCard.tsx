
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { BarChart3, Download } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PropertyData {
  valorCompra: string;
  valorEntrada: string;
  valorParcela: string;
  prazoFinanciamento: string;
}

interface RevenueData {
  aluguelMensal: string;
  vacanciaMedia: string;
  condominio: string;
  iptu: string;
  despesasFixas: string;
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

  // Cálculos para os gráficos
  const aluguelBruto = parseFloat(revenueData.aluguelMensal) / 100 || 0;
  const valorParcela = parseFloat(propertyData.valorParcela) / 100 || 0;
  const condominio = parseFloat(revenueData.condominio) / 100 || 0;
  const iptu = parseFloat(revenueData.iptu) / 100 || 0;
  const despesasFixas = parseFloat(revenueData.despesasFixas) / 100 || 0;
  
  const despesasTotais = valorParcela + condominio + iptu + despesasFixas;
  const receitaLiquida = aluguelBruto - despesasTotais;
  
  const roiMensal = 0.71;
  const roiAnual = 8.5;
  
  // Sinalização baseada no ROI
  const getSemaforo = (roi: number) => {
    if (roi >= 12) return { cor: "bg-green-500", texto: "Viável", emoji: "✅" };
    if (roi >= 8) return { cor: "bg-yellow-500", texto: "Arriscado", emoji: "⚠️" };
    return { cor: "bg-red-500", texto: "Não Viável", emoji: "❌" };
  };

  const semaforo = getSemaforo(roiAnual);

  // Dados para gráfico de receitas vs despesas
  const revenueVsExpenses = [
    { categoria: 'Receita Bruta', valor: aluguelBruto, fill: 'hsl(var(--primary))' },
    { categoria: 'Despesas', valor: despesasTotais, fill: 'hsl(var(--destructive))' }
  ];

  // Dados para comparativo de investimentos
  const investmentComparison = [
    { tipo: 'Imóvel', rentabilidade: roiAnual, fill: 'hsl(var(--primary))' },
    { tipo: 'CDI', rentabilidade: 11.75, fill: 'hsl(var(--accent))' },
    { tipo: 'Poupança', rentabilidade: 6.17, fill: 'hsl(var(--muted))' }
  ];

  // Dados para aluguel vs revenda (10 anos)
  const aluguelVsRevenda = Array.from({ length: 11 }, (_, i) => ({
    ano: i,
    aluguel: aluguelBruto * 12 * i,
    revenda: i === 10 ? parseFloat(propertyData.valorCompra) / 100 * 1.5 : 0, // 50% valorização em 10 anos
    patrimonio: (aluguelBruto * 12 * i) + (i === 10 ? parseFloat(propertyData.valorCompra) / 100 * 0.5 : 0)
  }));

  const COLORS = ['hsl(var(--primary))', 'hsl(var(--accent))', 'hsl(var(--muted))'];

  const handleDownloadReport = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Header com botão de download */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-foreground">Gráficos e Análises</h2>
        <Button onClick={handleDownloadReport} className="bg-gradient-primary">
          <Download className="w-4 h-4 mr-2" />
          Baixar Relatório
        </Button>
      </div>

      {/* ROI e Sinalização */}
      <Card className="bg-gradient-card border-border/50 shadow-xl">
        <CardHeader>
          <CardTitle className="text-center">Análise de Viabilidade</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div>
              <h3 className="text-sm text-muted-foreground mb-2">ROI Mensal</h3>
              <p className="text-2xl font-bold text-primary">{roiMensal}%</p>
            </div>
            <div>
              <h3 className="text-sm text-muted-foreground mb-2">ROI Anual</h3>
              <p className="text-2xl font-bold text-primary">{roiAnual}%</p>
            </div>
            <div>
              <h3 className="text-sm text-muted-foreground mb-2">Sinalização</h3>
              <div className={`w-16 h-16 mx-auto rounded-full ${semaforo.cor} flex items-center justify-center`}>
                <span className="text-white text-2xl">{semaforo.emoji}</span>
              </div>
              <p className="text-sm mt-2 font-medium">{semaforo.texto}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Gráfico de Receitas vs Despesas */}
      <Card className="bg-gradient-card border-border/50 shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <BarChart3 className="w-5 h-5" />
            Receitas vs Despesas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueVsExpenses}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="categoria" stroke="hsl(var(--muted-foreground))" />
                <YAxis stroke="hsl(var(--muted-foreground))" tickFormatter={formatCurrency} />
                <Tooltip formatter={(value: number) => formatCurrency(value)} />
                <Bar dataKey="valor" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Comparativo de Investimentos */}
      <Card className="bg-gradient-card border-border/50 shadow-xl">
        <CardHeader>
          <CardTitle>Comparativo de Investimentos (%)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={investmentComparison}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="tipo" stroke="hsl(var(--muted-foreground))" />
                <YAxis stroke="hsl(var(--muted-foreground))" />
                <Tooltip formatter={(value: number) => `${value}%`} />
                <Bar dataKey="rentabilidade" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Evolução Patrimonial - Aluguel vs Revenda */}
      <Card className="bg-gradient-card border-border/50 shadow-xl">
        <CardHeader>
          <CardTitle>Retorno: Aluguel vs Revenda (10 anos)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={aluguelVsRevenda}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="ano" stroke="hsl(var(--muted-foreground))" />
                <YAxis stroke="hsl(var(--muted-foreground))" tickFormatter={formatCurrency} />
                <Tooltip formatter={(value: number) => formatCurrency(value)} />
                <Line 
                  type="monotone" 
                  dataKey="aluguel" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={3}
                  name="Receita Aluguel"
                />
                <Line 
                  type="monotone" 
                  dataKey="revenda" 
                  stroke="hsl(var(--accent))" 
                  strokeWidth={3}
                  strokeDasharray="5 5"
                  name="Ganho Revenda"
                />
                <Line 
                  type="monotone" 
                  dataKey="patrimonio" 
                  stroke="hsl(var(--yellow-primary))" 
                  strokeWidth={3}
                  name="Patrimônio Total"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 flex justify-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-4 h-1 bg-primary"></div>
              <span>Receita Aluguel</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-1 bg-accent" style={{backgroundImage: 'repeating-linear-gradient(to right, hsl(var(--accent)) 0, hsl(var(--accent)) 5px, transparent 5px, transparent 10px)'}}></div>
              <span>Ganho Revenda</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-1 bg-yellow-primary"></div>
              <span>Patrimônio Total</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Resumo Final */}
      <Card className="bg-gradient-to-br from-primary/20 via-accent/20 to-yellow-primary/20 border-primary/30 shadow-2xl">
        <CardHeader>
          <CardTitle className="text-center text-xl">🏠 Resumo Final da Análise</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h3 className="font-bold text-lg text-primary mb-4">📊 Indicadores Principais</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-background/50 rounded-lg">
                  <span className="text-foreground">💰 ROI Anual:</span>
                  <span className="font-bold text-xl text-primary">{roiAnual}%</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-background/50 rounded-lg">
                  <span className="text-foreground">⏱️ Payback:</span>
                  <span className="font-bold text-xl text-accent">140 meses</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-background/50 rounded-lg">
                  <span className="text-foreground">💵 Receita Líquida:</span>
                  <span className="font-bold text-xl text-primary">{formatCurrency(receitaLiquida)}/mês</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-background/50 rounded-lg">
                  <span className="text-foreground">⚠️ Risco Geral:</span>
                  <span className="font-bold text-xl text-yellow-600">Médio</span>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <h3 className="font-bold text-lg text-accent mb-4">💡 Recomendações</h3>
              <div className="space-y-3">
                <div className="p-3 bg-background/50 rounded-lg">
                  <span className="text-foreground">🔄 Considere renegociar o valor de compra</span>
                </div>
                <div className="p-3 bg-background/50 rounded-lg">
                  <span className="text-foreground">🏘️ Avalie outras opções na região</span>
                </div>
                <div className="p-3 bg-background/50 rounded-lg">
                  <span className="text-foreground">📈 Compare com outros investimentos</span>
                </div>
                <div className="p-3 bg-background/50 rounded-lg">
                  <span className="text-foreground">📊 Monitore o mercado imobiliário local</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
