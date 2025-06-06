
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Building, Calculator } from "lucide-react";
import { useEffect } from "react";

interface PropertyData {
  cidade: string;
  estado: string;
  tipo: string;
  finalidade: string;
  valorCompra: string;
  valorEntrada: string;
  financiamento: string;
  valorFinanciado: string;
  percentualJuros: string;
  prazoFinanciamento: string;
  valorParcela: string;
  taxaCartorio: string;
  reformaMobilia: string;
  outrasDespesas: string;
}

interface PropertySimulatorCardProps {
  data: PropertyData;
  setData: (data: PropertyData) => void;
  onCalculate: () => void;
}

const cidades = [
  { nome: "São Paulo", estado: "SP" },
  { nome: "Rio de Janeiro", estado: "RJ" },
  { nome: "Belo Horizonte", estado: "MG" },
  { nome: "Brasília", estado: "DF" },
  { nome: "Curitiba", estado: "PR" },
  { nome: "Porto Alegre", estado: "RS" },
  { nome: "Salvador", estado: "BA" },
  { nome: "Fortaleza", estado: "CE" },
  { nome: "Recife", estado: "PE" },
  { nome: "Goiânia", estado: "GO" }
];

export function PropertySimulatorCard({ data, setData, onCalculate }: PropertySimulatorCardProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const updateData = (field: keyof PropertyData, value: string) => {
    const newData = { ...data, [field]: value };
    
    // Auto-calcular campos dependentes
    if (field === 'cidade') {
      const cidade = cidades.find(c => c.nome === value);
      if (cidade) {
        newData.estado = cidade.estado;
      }
    }
    
    if (field === 'valorCompra' || field === 'valorEntrada') {
      const valorCompra = parseFloat(newData.valorCompra) || 0;
      const valorEntrada = parseFloat(newData.valorEntrada) || 0;
      if (valorCompra > 0 && valorEntrada > 0) {
        newData.valorFinanciado = (valorCompra - valorEntrada).toString();
      }
    }
    
    setData(newData);
  };

  const valorCompraNum = parseFloat(data.valorCompra) || 0;
  const valorEntradaNum = parseFloat(data.valorEntrada) || 0;
  const valorFinanciadoNum = parseFloat(data.valorFinanciado) || 0;
  const parcelaNum = parseFloat(data.valorParcela) || 0;

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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="space-y-2">
            <Label htmlFor="cidade" className="text-foreground font-medium">Cidade</Label>
            <Select value={data.cidade} onValueChange={(value) => updateData('cidade', value)}>
              <SelectTrigger className="bg-background/50 border-border/50">
                <SelectValue placeholder="Selecione a cidade" />
              </SelectTrigger>
              <SelectContent>
                {cidades.map((cidade) => (
                  <SelectItem key={cidade.nome} value={cidade.nome}>
                    {cidade.nome}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-foreground font-medium">Estado</Label>
            <Input
              value={data.estado}
              readOnly
              className="bg-muted/50 border-border/50"
              placeholder="UF"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="tipo" className="text-foreground font-medium">Tipo</Label>
            <Select value={data.tipo} onValueChange={(value) => updateData('tipo', value)}>
              <SelectTrigger className="bg-background/50 border-border/50">
                <SelectValue placeholder="Selecione o tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="residencial">Residencial</SelectItem>
                <SelectItem value="comercial">Comercial</SelectItem>
                <SelectItem value="rural">Rural</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="finalidade" className="text-foreground font-medium">Finalidade</Label>
            <Select value={data.finalidade} onValueChange={(value) => updateData('finalidade', value)}>
              <SelectTrigger className="bg-background/50 border-border/50">
                <SelectValue placeholder="Selecione a finalidade" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="revenda">Revenda</SelectItem>
                <SelectItem value="aluguel">Aluguel</SelectItem>
                <SelectItem value="ambos">Ambos</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="valorCompra" className="text-foreground font-medium">Valor de Compra (R$)</Label>
            <Input
              id="valorCompra"
              type="number"
              placeholder="350000"
              value={data.valorCompra}
              onChange={(e) => updateData('valorCompra', e.target.value)}
              className="bg-background/50 border-border/50"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="valorEntrada" className="text-foreground font-medium">
              Valor da Entrada (R$)
              <span className="text-xs text-muted-foreground block">Min. 20% para financiamento</span>
            </Label>
            <Input
              id="valorEntrada"
              type="number"
              placeholder="70000"
              value={data.valorEntrada}
              onChange={(e) => updateData('valorEntrada', e.target.value)}
              className="bg-background/50 border-border/50"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="financiamento" className="text-foreground font-medium">Financiamento</Label>
            <Select value={data.financiamento} onValueChange={(value) => updateData('financiamento', value)}>
              <SelectTrigger className="bg-background/50 border-border/50">
                <SelectValue placeholder="Sim/Não" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sim">Sim</SelectItem>
                <SelectItem value="nao">Não</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {data.financiamento === 'sim' && (
            <>
              <div className="space-y-2">
                <Label className="text-foreground font-medium">Valor Financiado (R$)</Label>
                <Input
                  value={data.valorFinanciado}
                  onChange={(e) => updateData('valorFinanciado', e.target.value)}
                  className="bg-background/50 border-border/50"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="percentualJuros" className="text-foreground font-medium">
                  Juros do Financiamento (% a.a.)
                </Label>
                <Input
                  id="percentualJuros"
                  type="number"
                  step="0.1"
                  placeholder="10.5"
                  value={data.percentualJuros}
                  onChange={(e) => updateData('percentualJuros', e.target.value)}
                  className="bg-background/50 border-border/50"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="prazoFinanciamento" className="text-foreground font-medium">Prazo (meses)</Label>
                <Input
                  id="prazoFinanciamento"
                  type="number"
                  placeholder="360"
                  value={data.prazoFinanciamento}
                  onChange={(e) => updateData('prazoFinanciamento', e.target.value)}
                  className="bg-background/50 border-border/50"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="valorParcela" className="text-foreground font-medium">Valor da Parcela (R$)</Label>
                <Input
                  id="valorParcela"
                  type="number"
                  placeholder="2500"
                  value={data.valorParcela}
                  onChange={(e) => updateData('valorParcela', e.target.value)}
                  className="bg-background/50 border-border/50"
                />
              </div>
            </>
          )}

          <div className="space-y-2">
            <Label htmlFor="taxaCartorio" className="text-foreground font-medium">Taxa Cartório/ITBI (%)</Label>
            <Input
              id="taxaCartorio"
              type="number"
              step="0.1"
              value={data.taxaCartorio}
              onChange={(e) => updateData('taxaCartorio', e.target.value)}
              className="bg-background/50 border-border/50"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="reformaMobilia" className="text-foreground font-medium">Reforma/Mobília (R$) - Opcional</Label>
            <Input
              id="reformaMobilia"
              type="number"
              placeholder="0"
              value={data.reformaMobilia}
              onChange={(e) => updateData('reformaMobilia', e.target.value)}
              className="bg-background/50 border-border/50"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="outrasDespesas" className="text-foreground font-medium">Outras Despesas (R$)</Label>
            <Input
              id="outrasDespesas"
              type="number"
              placeholder="0"
              value={data.outrasDespesas}
              onChange={(e) => updateData('outrasDespesas', e.target.value)}
              className="bg-background/50 border-border/50"
            />
          </div>
        </div>

        {/* Resumo */}
        <div className="mt-6 p-4 bg-gradient-accent/10 rounded-lg border border-accent/20">
          <h3 className="font-semibold text-foreground mb-4">Resumo Financeiro</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">Valor de Compra:</span>
              <p className="font-semibold text-primary">{formatCurrency(valorCompraNum)}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Valor Financiado:</span>
              <p className="font-semibold text-accent">{formatCurrency(valorFinanciadoNum)}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Entrada:</span>
              <p className="font-semibold text-primary">{formatCurrency(valorEntradaNum)}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Parcela Mensal:</span>
              <p className="font-semibold text-accent">{formatCurrency(parcelaNum)}</p>
            </div>
          </div>
        </div>

        <Button 
          onClick={onCalculate}
          className="w-full bg-gradient-primary hover:opacity-90 text-primary-foreground font-semibold py-3"
        >
          <Calculator className="w-5 h-5 mr-2" />
          Calcular Análise
        </Button>
      </CardContent>
    </Card>
  );
}
