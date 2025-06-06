
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calculator, TrendingUp } from "lucide-react";

interface SimulatorCardProps {
  valorInicial: string;
  setValorInicial: (value: string) => void;
  valorMensal: string;
  setValorMensal: (value: string) => void;
  taxa: string;
  setTaxa: (value: string) => void;
  periodo: string;
  setPeriodo: (value: string) => void;
  tipoInvestimento: string;
  setTipoInvestimento: (value: string) => void;
  onCalculate: () => void;
  isCalculating?: boolean;
}

export function SimulatorCard({
  valorInicial,
  setValorInicial,
  valorMensal,
  setValorMensal,
  taxa,
  setTaxa,
  periodo,
  setPeriodo,
  tipoInvestimento,
  setTipoInvestimento,
  onCalculate,
  isCalculating = false
}: SimulatorCardProps) {
  return (
    <Card className="bg-gradient-card border-border/50 shadow-xl animate-fade-in">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-3 text-xl text-foreground">
          <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
            <Calculator className="w-5 h-5 text-primary-foreground" />
          </div>
          Simulador de Investimentos
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="valorInicial" className="text-foreground font-medium">
              Valor Inicial (R$)
            </Label>
            <Input
              id="valorInicial"
              type="number"
              placeholder="10000"
              value={valorInicial}
              onChange={(e) => setValorInicial(e.target.value)}
              className="bg-background/50 border-border/50 focus:border-primary transition-colors"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="valorMensal" className="text-foreground font-medium">
              Aporte Mensal (R$)
            </Label>
            <Input
              id="valorMensal"
              type="number"
              placeholder="500"
              value={valorMensal}
              onChange={(e) => setValorMensal(e.target.value)}
              className="bg-background/50 border-border/50 focus:border-primary transition-colors"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="taxa" className="text-foreground font-medium">
              Taxa de Juros (% ao ano)
            </Label>
            <Input
              id="taxa"
              type="number"
              step="0.01"
              placeholder="12.5"
              value={taxa}
              onChange={(e) => setTaxa(e.target.value)}
              className="bg-background/50 border-border/50 focus:border-primary transition-colors"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="periodo" className="text-foreground font-medium">
              Período (anos)
            </Label>
            <Input
              id="periodo"
              type="number"
              placeholder="10"
              value={periodo}
              onChange={(e) => setPeriodo(e.target.value)}
              className="bg-background/50 border-border/50 focus:border-primary transition-colors"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-foreground font-medium">Tipo de Investimento</Label>
          <Select value={tipoInvestimento} onValueChange={setTipoInvestimento}>
            <SelectTrigger className="bg-background/50 border-border/50 focus:border-primary">
              <SelectValue placeholder="Selecione o tipo" />
            </SelectTrigger>
            <SelectContent className="bg-card border-border/50">
              <SelectItem value="poupanca">Poupança (6% a.a.)</SelectItem>
              <SelectItem value="cdi">CDI (12% a.a.)</SelectItem>
              <SelectItem value="ipca">IPCA+ (10% a.a.)</SelectItem>
              <SelectItem value="acoes">Ações (15% a.a.)</SelectItem>
              <SelectItem value="personalizado">Personalizado</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button 
          onClick={onCalculate}
          disabled={isCalculating}
          className="w-full bg-gradient-primary hover:opacity-90 text-primary-foreground font-semibold py-3 transition-all duration-200 transform hover:scale-[1.02]"
        >
          {isCalculating ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
              Calculando...
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Calcular Investimento
            </div>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
