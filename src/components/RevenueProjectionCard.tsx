
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { TrendingUp, Calculator } from "lucide-react";

interface PropertyData {
  estado: string;
  cidade: string;
  tipo: string;
  valorCompra: string;
}

interface RevenueData {
  aluguelMensal: string;
  vacanciaMedia: string;
  condominio: string;
  iptu: string;
  despesasFixas: string;
}

interface RevenueProjectionCardProps {
  data: RevenueData;
  setData: (data: RevenueData) => void;
  propertyData: PropertyData;
  onCalculate: () => void;
}

export function RevenueProjectionCard({ data, setData, propertyData, onCalculate }: RevenueProjectionCardProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatInputCurrency = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    const amount = parseFloat(numbers) / 100;
    return amount.toLocaleString('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };

  const getCurrencyDisplayValue = (value: string) => {
    if (!value) return '';
    const amount = parseFloat(value) / 100;
    return amount.toLocaleString('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };

  const handleCurrencyInput = (field: keyof RevenueData, value: string) => {
    setData({ ...data, [field]: value.replace(/\D/g, '') });
  };

  const updateData = (field: keyof RevenueData, value: string) => {
    setData({ ...data, [field]: value });
  };

  const estimateRent = () => {
    const valorCompra = parseFloat(propertyData.valorCompra) / 100 || 0;
    if (valorCompra > 0) {
      // Estimativa baseada em 0.5% a 0.8% do valor do imóvel
      const rentEstimate = valorCompra * 0.006; // 0.6% como média
      setData({ ...data, aluguelMensal: (rentEstimate * 100).toString() });
    }
  };

  const aluguelBruto = parseFloat(data.aluguelMensal) / 100 || 0;
  const condominio = parseFloat(data.condominio) / 100 || 0;
  const iptu = parseFloat(data.iptu) / 100 || 0;
  const despesasFixas = parseFloat(data.despesasFixas) / 100 || 0;
  const vacanciaPerc = parseFloat(data.vacanciaMedia) || 0;
  
  const despesasMensais = condominio + iptu + despesasFixas;
  const vacanciaEstimada = (aluguelBruto * vacanciaPerc) / 100;
  const receitaLiquida = aluguelBruto - despesasMensais - vacanciaEstimada;

  return (
    <Card className="bg-gradient-card border-border/50 shadow-xl animate-fade-in">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-3 text-xl text-foreground">
          <div className="w-10 h-10 bg-gradient-accent rounded-lg flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-accent-foreground" />
          </div>
          Receita Projetada
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="aluguelMensal" className="text-foreground font-medium">
              Aluguel Mensal Previsto (R$)
            </Label>
            <div className="flex gap-2">
              <Input
                id="aluguelMensal"
                type="text"
                placeholder="2.500,00"
                value={getCurrencyDisplayValue(data.aluguelMensal)}
                onChange={(e) => handleCurrencyInput('aluguelMensal', e.target.value)}
                className="bg-background/50 border-border/50"
              />
              <Button 
                onClick={estimateRent}
                variant="outline"
                size="sm"
                className="px-3"
              >
                <Calculator className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="vacanciaMedia" className="text-foreground font-medium">Vacância Média (%)</Label>
            <Input
              id="vacanciaMedia"
              type="number"
              step="0.1"
              value={data.vacanciaMedia}
              onChange={(e) => updateData('vacanciaMedia', e.target.value)}
              className="bg-background/50 border-border/50"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="condominio" className="text-foreground font-medium">Condomínio (R$) - Opcional</Label>
            <Input
              id="condominio"
              type="text"
              placeholder="0,00"
              value={getCurrencyDisplayValue(data.condominio)}
              onChange={(e) => handleCurrencyInput('condominio', e.target.value)}
              className="bg-background/50 border-border/50"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="iptu" className="text-foreground font-medium">IPTU Mensal (R$)</Label>
            <Input
              id="iptu"
              type="text"
              placeholder="200,00"
              value={getCurrencyDisplayValue(data.iptu)}
              onChange={(e) => handleCurrencyInput('iptu', e.target.value)}
              className="bg-background/50 border-border/50"
            />
          </div>

          <div className="md:col-span-2 space-y-2">
            <Label htmlFor="despesasFixas" className="text-foreground font-medium">Despesas Fixas/Variadas (R$)</Label>
            <Input
              id="despesasFixas"
              type="text"
              placeholder="300,00"
              value={getCurrencyDisplayValue(data.despesasFixas)}
              onChange={(e) => handleCurrencyInput('despesasFixas', e.target.value)}
              className="bg-background/50 border-border/50"
            />
          </div>
        </div>

        {/* Botão de Calcular */}
        <div className="flex justify-center">
          <Button 
            onClick={onCalculate}
            className="bg-gradient-primary hover:opacity-90 text-primary-foreground font-semibold py-3 px-8"
          >
            <Calculator className="w-5 h-5 mr-2" />
            Calcular Análise
          </Button>
        </div>

        {/* Resumo da Receita */}
        <div className="mt-6 p-4 bg-gradient-primary/10 rounded-lg border border-primary/20">
          <h3 className="font-semibold text-foreground mb-4">Resumo da Receita</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">Aluguel Bruto:</span>
              <p className="font-semibold text-primary">{formatCurrency(aluguelBruto)}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Despesas Mensais:</span>
              <p className="font-semibold text-red-400">{formatCurrency(despesasMensais)}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Vacância Estimada:</span>
              <p className="font-semibold text-red-400">{formatCurrency(vacanciaEstimada)}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Receita Líquida:</span>
              <p className="font-semibold text-accent">{formatCurrency(receitaLiquida)}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
