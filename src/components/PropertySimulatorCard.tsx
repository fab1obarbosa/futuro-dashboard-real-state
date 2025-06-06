
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Building } from "lucide-react";
import { useEffect, useState } from "react";

interface PropertyData {
  estado: string;
  cidade: string;
  tipo: string;
  finalidade: string;
  valorCompra: string;
  financiamento: string;
  valorEntrada: string;
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
}

const estadosCidades = {
  "SP": ["São Paulo", "Campinas", "Santos", "Ribeirão Preto", "Sorocaba", "Osasco", "Bauru", "Piracicaba"],
  "RJ": ["Rio de Janeiro", "Niterói", "Nova Iguaçu", "Duque de Caxias", "Campos dos Goytacazes", "Petrópolis"],
  "MG": ["Belo Horizonte", "Uberlândia", "Contagem", "Juiz de Fora", "Betim", "Montes Claros"],
  "RS": ["Porto Alegre", "Caxias do Sul", "Pelotas", "Canoas", "Santa Maria", "Gravataí"],
  "PR": ["Curitiba", "Londrina", "Maringá", "Ponta Grossa", "Cascavel", "São José dos Pinhais"],
  "SC": ["Florianópolis", "Joinville", "Blumenau", "São José", "Criciúma", "Chapecó"],
  "BA": ["Salvador", "Feira de Santana", "Vitória da Conquista", "Camaçari", "Juazeiro", "Ilhéus"],
  "GO": ["Goiânia", "Aparecida de Goiânia", "Anápolis", "Rio Verde", "Luziânia", "Águas Lindas"],
  "DF": ["Brasília"],
  "CE": ["Fortaleza", "Caucaia", "Juazeiro do Norte", "Maracanaú", "Sobral", "Crato"]
};

const taxasJurosPorEstado = {
  "SP": "10.5",
  "RJ": "11.0",
  "MG": "10.8",
  "RS": "10.7",
  "PR": "10.6",
  "SC": "10.4",
  "BA": "11.2",
  "GO": "10.9",
  "DF": "10.3",
  "CE": "11.5"
};

export function PropertySimulatorCard({ data, setData }: PropertySimulatorCardProps) {
  const [cidadesFiltradas, setCidadesFiltradas] = useState<string[]>([]);

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

  const updateData = (field: keyof PropertyData, value: string) => {
    const newData = { ...data, [field]: value };
    
    // Auto-calcular campos dependentes
    if (field === 'estado') {
      setCidadesFiltradas(estadosCidades[value as keyof typeof estadosCidades] || []);
      newData.cidade = "";
      newData.percentualJuros = taxasJurosPorEstado[value as keyof typeof taxasJurosPorEstado] || "10.5";
    }
    
    if (field === 'valorCompra' || field === 'valorEntrada') {
      const valorCompra = parseFloat(newData.valorCompra.replace(/\D/g, '')) / 100 || 0;
      const valorEntrada = parseFloat(newData.valorEntrada.replace(/\D/g, '')) / 100 || 0;
      if (valorCompra > 0 && valorEntrada > 0) {
        const valorFinanciado = valorCompra - valorEntrada;
        newData.valorFinanciado = (valorFinanciado * 100).toString();
      }
    }

    // Cálculo automático de parcela ou prazo
    if (field === 'prazoFinanciamento' || field === 'percentualJuros' || field === 'valorFinanciado') {
      const valorFinanciado = parseFloat(newData.valorFinanciado) / 100 || 0;
      const juros = parseFloat(newData.percentualJuros) / 100 / 12 || 0;
      const prazo = parseFloat(newData.prazoFinanciamento) || 0;
      
      if (valorFinanciado > 0 && juros > 0 && prazo > 0) {
        const parcela = valorFinanciado * (juros * Math.pow(1 + juros, prazo)) / (Math.pow(1 + juros, prazo) - 1);
        newData.valorParcela = (parcela * 100).toString();
      }
    }

    if (field === 'valorParcela' && newData.valorFinanciado && newData.percentualJuros) {
      const valorFinanciado = parseFloat(newData.valorFinanciado) / 100 || 0;
      const juros = parseFloat(newData.percentualJuros) / 100 / 12 || 0;
      const parcela = parseFloat(newData.valorParcela.replace(/\D/g, '')) / 100 || 0;
      
      if (valorFinanciado > 0 && juros > 0 && parcela > 0) {
        const prazo = Math.log(1 + (valorFinanciado * juros) / parcela) / Math.log(1 + juros);
        newData.prazoFinanciamento = Math.round(prazo).toString();
      }
    }
    
    setData(newData);
  };

  const handleCurrencyInput = (field: keyof PropertyData, value: string) => {
    const formatted = formatInputCurrency(value);
    updateData(field, value.replace(/\D/g, ''));
  };

  const getCurrencyDisplayValue = (value: string) => {
    if (!value) return '';
    const amount = parseFloat(value) / 100;
    return amount.toLocaleString('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };

  const valorCompraNum = parseFloat(data.valorCompra) / 100 || 0;
  const valorEntradaNum = parseFloat(data.valorEntrada) / 100 || 0;
  const valorFinanciadoNum = parseFloat(data.valorFinanciado) / 100 || 0;
  const parcelaNum = parseFloat(data.valorParcela) / 100 || 0;

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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="estado" className="text-foreground font-medium">Estado</Label>
            <Select value={data.estado} onValueChange={(value) => updateData('estado', value)}>
              <SelectTrigger className="bg-background/50 border-border/50">
                <SelectValue placeholder="Selecione o estado" />
              </SelectTrigger>
              <SelectContent>
                {Object.keys(estadosCidades).map((estado) => (
                  <SelectItem key={estado} value={estado}>
                    {estado}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="cidade" className="text-foreground font-medium">Cidade</Label>
            <Select value={data.cidade} onValueChange={(value) => updateData('cidade', value)} disabled={!data.estado}>
              <SelectTrigger className="bg-background/50 border-border/50">
                <SelectValue placeholder="Selecione a cidade" />
              </SelectTrigger>
              <SelectContent>
                {cidadesFiltradas.map((cidade) => (
                  <SelectItem key={cidade} value={cidade}>
                    {cidade}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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
              type="text"
              placeholder="350.000,00"
              value={getCurrencyDisplayValue(data.valorCompra)}
              onChange={(e) => handleCurrencyInput('valorCompra', e.target.value)}
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
                <Label htmlFor="valorEntrada" className="text-foreground font-medium">
                  Valor da Entrada (R$)
                  <span className="text-xs text-muted-foreground block">Financiamentos exigem mín. 20% do valor</span>
                </Label>
                <Input
                  id="valorEntrada"
                  type="text"
                  placeholder="70.000,00"
                  value={getCurrencyDisplayValue(data.valorEntrada)}
                  onChange={(e) => handleCurrencyInput('valorEntrada', e.target.value)}
                  className="bg-background/50 border-border/50"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-foreground font-medium">Valor Financiado (R$)</Label>
                <Input
                  value={getCurrencyDisplayValue(data.valorFinanciado)}
                  readOnly
                  className="bg-muted/50 border-border/50"
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
                  type="text"
                  placeholder="2.500,00"
                  value={getCurrencyDisplayValue(data.valorParcela)}
                  onChange={(e) => handleCurrencyInput('valorParcela', e.target.value)}
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
              type="text"
              placeholder="0,00"
              value={getCurrencyDisplayValue(data.reformaMobilia)}
              onChange={(e) => handleCurrencyInput('reformaMobilia', e.target.value)}
              className="bg-background/50 border-border/50"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="outrasDespesas" className="text-foreground font-medium">Opcional - Outras Despesas (R$)</Label>
            <Input
              id="outrasDespesas"
              type="text"
              placeholder="0,00"
              value={getCurrencyDisplayValue(data.outrasDespesas)}
              onChange={(e) => handleCurrencyInput('outrasDespesas', e.target.value)}
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
      </CardContent>
    </Card>
  );
}
