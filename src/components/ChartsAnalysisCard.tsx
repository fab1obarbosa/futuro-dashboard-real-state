
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { BarChart3, Download } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PropertyData {
  valorCompra: string;
  valorEntrada: string;
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
  const aluguelBruto = parseFloat(revenueData.aluguelMensal) || 0;
  const despesasMensais = (parseFloat(revenueData.condominio) || 0) + 
                         (parseFloat(revenueData.iptu) || 0) + 
                         (parseFloat(revenueData.despesasFixas) || 0);
  
  // Dados para gráfico de evolução patrimonial (5 anos)
  const evolutionData = Array.from({ length: 6 }, (_, i) => ({
    ano: i,
    receita: aluguelBruto * 12 * i,
    despesas: despesasMensais * 12 * i,
    lucroLiquido: (aluguelBruto - despesasMensais) * 12 * i
  }));

  // Dados para gráfico de receitas vs despesas
  const revenueVsExpenses = [
    { categoria: 'Receita Bruta', valor: aluguelBruto, fill: 'hsl(var(--primary))' },
    { categoria: 'Despesas', valor: despesasMensais, fill: 'hsl(var(--destructive))' },
    { categoria: 'Receita Líquida', valor: aluguelBruto - despesasMensais, fill: 'hsl(var(--accent))' }
  ];

  // Dados para comparativo de investimentos
  const investmentComparison = [
    { tipo: 'Imóvel', rentabilidade: 8.5, fill: 'hsl(var(--primary))' },
    { tipo: 'CDI', rentabilidade: 11.75, fill: 'hsl(var(--accent))' },
    { tipo: 'Poupança', rentabilidade: 6.17, fill: 'hsl(var(--muted))' }
  ];

  // Dados para composição dos ganhos
  const gainsComposition = [
    { name: 'Aluguel', value: 70, fill: 'hsl(var(--primary))' },
    { name: 'Valorização', value: 30, fill: 'hsl(var(--accent))' }
  ];

  const COLORS = ['hsl(var(--primary))', 'hsl(var(--accent))', 'hsl(var(--muted))'];

  const handleDownloadReport = () => {
    // Função para gerar relatório em PDF (implementação simulada)
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
              <p className="text-2xl font-bold text-primary">0.71%</p>
            </div>
            <div>
              <h3 className="text-sm text-muted-foreground mb-2">ROI Anual</h3>
              <p className="text-2xl font-bold text-primary">8.5%</p>
            </div>
            <div>
              <h3 className="text-sm text-muted-foreground mb-2">Sinalização</h3>
              <div className="w-16 h-16 mx-auto rounded-full bg-yellow-500 flex items-center justify-center">
                <span className="text-white font-bold">⚠️</span>
              </div>
              <p className="text-sm mt-2 text-yellow-600">Arriscado</p>
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
          <div className="h-80">
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
          <div className="h-80">
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

      {/* Composição dos Ganhos */}
      <Card className="bg-gradient-card border-border/50 shadow-xl">
        <CardHeader>
          <CardTitle>Composição dos Ganhos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={gainsComposition}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {gainsComposition.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Evolução Patrimonial */}
      <Card className="bg-gradient-card border-border/50 shadow-xl">
        <CardHeader>
          <CardTitle>Evolução Patrimonial</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={evolutionData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="ano" stroke="hsl(var(--muted-foreground))" />
                <YAxis stroke="hsl(var(--muted-foreground))" tickFormatter={formatCurrency} />
                <Tooltip formatter={(value: number) => formatCurrency(value)} />
                <Line type="monotone" dataKey="receita" stroke="hsl(var(--primary))" strokeWidth={2} />
                <Line type="monotone" dataKey="despesas" stroke="hsl(var(--destructive))" strokeWidth={2} />
                <Line type="monotone" dataKey="lucroLiquido" stroke="hsl(var(--accent))" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Resumo Final */}
      <Card className="bg-gradient-primary/10 border-primary/20 shadow-xl">
        <CardHeader>
          <CardTitle>Resumo Final da Análise</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-3">Indicadores Principais</h3>
              <ul className="space-y-2 text-sm">
                <li>• ROI Anual: <span className="font-semibold">8.5%</span></li>
                <li>• Payback: <span className="font-semibold">140 meses</span></li>
                <li>• Receita Líquida: <span className="font-semibold">{formatCurrency(aluguelBruto - despesasMensais)}/mês</span></li>
                <li>• Risco Geral: <span className="font-semibold">Médio</span></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-3">Recomendações</h3>
              <ul className="space-y-2 text-sm">
                <li>• Considere renegociar o valor de compra</li>
                <li>• Avalie outras opções na região</li>
                <li>• Compare com outros investimentos</li>
                <li>• Monitore o mercado imobiliário local</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
