
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { BarChart3 } from "lucide-react";

interface ChartData {
  ano: number;
  valorInvestido: number;
  valorTotal: number;
  juros: number;
}

interface ChartCardProps {
  data: ChartData[];
}

export function ChartCard({ data }: ChartCardProps) {
  if (!data || data.length === 0) {
    return (
      <Card className="bg-gradient-card border-border/50 shadow-xl animate-fade-in">
        <CardContent className="flex items-center justify-center h-64">
          <div className="text-center text-muted-foreground">
            <BarChart3 className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>Dados do gráfico aparecerão aqui após o cálculo</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card border border-border/50 rounded-lg p-4 shadow-lg">
          <p className="font-semibold text-foreground">{`Ano ${label}`}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }} className="text-sm">
              {`${entry.dataKey === 'valorInvestido' ? 'Investido' : 
                 entry.dataKey === 'valorTotal' ? 'Total' : 'Juros'}: ${formatCurrency(entry.value)}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Gráfico de Linha - Evolução ao Longo do Tempo */}
      <Card className="bg-gradient-card border-border/50 shadow-xl animate-slide-up">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-3 text-xl text-foreground">
            <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-primary-foreground" />
            </div>
            Evolução do Investimento
          </CardTitle>
        </CardHeader>
        
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                <XAxis 
                  dataKey="ano" 
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                />
                <YAxis 
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                  tickFormatter={(value) => formatCurrency(value)}
                />
                <Tooltip content={<CustomTooltip />} />
                <Line 
                  type="monotone" 
                  dataKey="valorInvestido" 
                  stroke="hsl(var(--accent))" 
                  strokeWidth={3}
                  dot={{ fill: "hsl(var(--accent))", strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, stroke: "hsl(var(--accent))", strokeWidth: 2 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="valorTotal" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={3}
                  dot={{ fill: "hsl(var(--primary))", strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, stroke: "hsl(var(--primary))", strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          
          <div className="flex flex-wrap gap-4 mt-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-accent rounded-full"></div>
              <span className="text-muted-foreground">Valor Investido</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-primary rounded-full"></div>
              <span className="text-muted-foreground">Valor Total</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Gráfico de Barras - Comparação Investido vs Juros */}
      <Card className="bg-gradient-card border-border/50 shadow-xl animate-slide-up">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-3 text-xl text-foreground">
            <div className="w-10 h-10 bg-gradient-accent rounded-lg flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-accent-foreground" />
            </div>
            Composição do Rendimento
          </CardTitle>
        </CardHeader>
        
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                <XAxis 
                  dataKey="ano" 
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                />
                <YAxis 
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                  tickFormatter={(value) => formatCurrency(value)}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar 
                  dataKey="valorInvestido" 
                  stackId="a"
                  fill="hsl(var(--accent))"
                  radius={[0, 0, 4, 4]}
                />
                <Bar 
                  dataKey="juros" 
                  stackId="a"
                  fill="hsl(var(--primary))"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
          
          <div className="flex flex-wrap gap-4 mt-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-accent rounded-full"></div>
              <span className="text-muted-foreground">Capital Investido</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-primary rounded-full"></div>
              <span className="text-muted-foreground">Juros Acumulados</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
