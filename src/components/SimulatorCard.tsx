
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Building, TrendingUp } from "lucide-react";

interface SimulatorCardProps {
  valorImovel: string;
  setValorImovel: (value: string) => void;
  valorEntrada: string;
  setValorEntrada: (value: string) => void;
  valorAluguel: string;
  setValorAluguel: (value: string) => void;
  custosAdicionais: string;
  setCustosAdicionais: (value: string) => void;
  valorizacaoAnual: string;
  setValorizacaoAnual: (value: string) => void;
  periodo: string;
  setPeriodo: (value: string) => void;
  tipoAnalise: string;
  setTipoAnalise: (value: string) => void;
  onCalculate: () => void;
  isCalculating?: boolean;
}

export function SimulatorCard({
  valorImovel,
  setValorImovel,
  valorEntrada,
  setValorEntrada,
  valorAluguel,
  setValorAluguel,
  custosAdicionais,
  setCustosAdicionais,
  valorizacaoAnual,
  setValorizacaoAnual,
  periodo,
  setPeriodo,
  tipoAnalise,
  setTipoAnalise,
  onCalculate,
  isCalculating = false
}: SimulatorCardProps) {
  return (
    <Card className="bg-gradient-card border-border/50 shadow-xl animate-fade-in">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-3 text-xl text-foreground">
          <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
            <Building className="w-5 h-5 text-primary-foreground" />
          </div>
          Simulador de Imóveis
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="valorImovel" className="text-foreground font-medium">
              Valor do Imóvel (R$)
            </Label>
            <Input
              id="valorImovel"
              type="number"
              placeholder="350000"
              value={valorImovel}
              onChange={(e) => setValorImovel(e.target.value)}
              className="bg-background/50 border-border/50 focus:border-primary transition-colors"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="valorEntrada" className="text-foreground font-medium">
              Valor de Entrada (R$)
            </Label>
            <Input
              id="valorEntrada"
              type="number"
              placeholder="70000"
              value={valorEntrada}
              onChange={(e) => setValorEntrada(e.target.value)}
              className="bg-background/50 border-border/50 focus:border-primary transition-colors"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="valorAluguel" className="text-foreground font-medium">
              Valor do Aluguel Mensal (R$)
            </Label>
            <Input
              id="valorAluguel"
              type="number"
              placeholder="2500"
              value={valorAluguel}
              onChange={(e) => setValorAluguel(e.target.value)}
              className="bg-background/50 border-border/50 focus:border-primary transition-colors"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="custosAdicionais" className="text-foreground font-medium">
              Custos Mensais (R$)
            </Label>
            <Input
              id="custosAdicionais"
              type="number"
              placeholder="300"
              value={custosAdicionais}
              onChange={(e) => setCustosAdicionais(e.target.value)}
              className="bg-background/50 border-border/50 focus:border-primary transition-colors"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="valorizacaoAnual" className="text-foreground font-medium">
              Valorização Anual (%)
            </Label>
            <Input
              id="valorizacaoAnual"
              type="number"
              step="0.1"
              placeholder="5.0"
              value={valorizacaoAnual}
              onChange={(e) => setValorizacaoAnual(e.target.value)}
              className="bg-background/50 border-border/50 focus:border-primary transition-colors"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="periodo" className="text-foreground font-medium">
              Período de Análise (anos)
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
          <Label className="text-foreground font-medium">Tipo de Análise</Label>
          <Select value={tipoAnalise} onValueChange={setTipoAnalise}>
            <SelectTrigger className="bg-background/50 border-border/50 focus:border-primary">
              <SelectValue placeholder="Selecione o tipo" />
            </SelectTrigger>
            <SelectContent className="bg-card border-border/50">
              <SelectItem value="aluguel">Apenas Aluguel</SelectItem>
              <SelectItem value="revenda">Apenas Revenda</SelectItem>
              <SelectItem value="completa">Aluguel + Revenda</SelectItem>
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
              Analisar Imóvel
            </div>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
