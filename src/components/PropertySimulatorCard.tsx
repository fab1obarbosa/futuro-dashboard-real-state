import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Building2 } from "lucide-react";
import { useState, useEffect } from "react";
import statesAndCities from "@/data/brazilianCities";

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
  setData: React.Dispatch<React.SetStateAction<PropertyData>>;
}

export function PropertySimulatorCard({ data, setData }: PropertySimulatorCardProps) {
  const [filteredCities, setFilteredCities] = useState<string[]>([]);
  const [citySearchTerm, setCitySearchTerm] = useState("");

  useEffect(() => {
    if (data.estado && statesAndCities[data.estado as keyof typeof statesAndCities]) {
      const cities = statesAndCities[data.estado as keyof typeof statesAndCities];
      const filtered = cities.filter(city => 
        city.toLowerCase().includes(citySearchTerm.toLowerCase())
      );
      setFilteredCities(filtered);
    } else {
      setFilteredCities([]);
    }
  }, [data.estado, citySearchTerm]);

  // Função para atualizar entrada automaticamente (20% do valor do imóvel)
  const updateEntrada = (valorCompra: string) => {
    const valor = parseFloat(valorCompra) || 0;
    const entrada = (valor * 0.20).toString(); // 20% do valor
    setData(prev => ({ ...prev, valorEntrada: entrada }));
  };

  const handleValueChange = (field: string, value: string) => {
    if (field === "valorCompra") {
      updateEntrada(value);
    }
    setData(prev => ({ ...prev, [field]: value }));
  };

  const formatCurrency = (value: string) => {
    const numericValue = value.replace(/\D/g, '');
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(Number(numericValue) / 100);
  };

  const handleCurrencyChange = (field: string, value: string) => {
    const numericValue = value.replace(/\D/g, '');
    handleValueChange(field, numericValue);
  };

  return (
    <Card className="bg-gradient-card border-border/50 shadow-lg">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-3 text-xl text-foreground">
          <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
            <Building2 className="w-4 h-4 text-primary-foreground" />
          </div>
          Simulador de Propriedades
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="estado" className="text-sm font-medium text-foreground">Estado</Label>
            <Select value={data.estado} onValueChange={(value) => handleValueChange("estado", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o estado" />
              </SelectTrigger>
              <SelectContent>
                {Object.keys(statesAndCities).map((estado) => (
                  <SelectItem key={estado} value={estado}>
                    {estado}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="cidade" className="text-sm font-medium text-foreground">Cidade</Label>
            <div className="relative">
              <Input
                value={citySearchTerm || data.cidade}
                onChange={(e) => {
                  setCitySearchTerm(e.target.value);
                  setData(prev => ({ ...prev, cidade: e.target.value }));
                }}
                placeholder="Digite para filtrar cidades..."
                className="w-full"
              />
              {filteredCities.length > 0 && citySearchTerm && (
                <div className="absolute z-50 w-full bg-popover border rounded-md shadow-lg max-h-48 overflow-y-auto mt-1">
                  {filteredCities.slice(0, 10).map((city) => (
                    <div
                      key={city}
                      className="px-3 py-2 text-sm cursor-pointer hover:bg-accent"
                      onClick={() => {
                        setData(prev => ({ ...prev, cidade: city }));
                        setCitySearchTerm("");
                      }}
                    >
                      {city}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="tipo" className="text-sm font-medium text-foreground">Tipo de Imóvel</Label>
            <Select value={data.tipo} onValueChange={(value) => handleValueChange("tipo", value)}>
              <SelectTrigger>
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
            <Label htmlFor="finalidade" className="text-sm font-medium text-foreground">Finalidade</Label>
            <Select value={data.finalidade} onValueChange={(value) => handleValueChange("finalidade", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione a finalidade" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="aluguel">Aluguel</SelectItem>
                <SelectItem value="revenda">Revenda</SelectItem>
                <SelectItem value="uso_proprio">Uso Próprio</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="valorCompra" className="text-sm font-medium text-foreground">Valor de Compra do Imóvel</Label>
          <Input
            id="valorCompra"
            value={data.valorCompra ? formatCurrency(data.valorCompra) : ''}
            onChange={(e) => handleCurrencyChange("valorCompra", e.target.value)}
            placeholder="R$ 0"
            className="text-base"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="financiamento" className="text-sm font-medium text-foreground">Financiamento</Label>
          <Select value={data.financiamento} onValueChange={(value) => handleValueChange("financiamento", value)}>
            <SelectTrigger>
              <SelectValue placeholder="Precisa de financiamento?" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="sim">Sim</SelectItem>
              <SelectItem value="nao">Não</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {data.financiamento === "sim" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gradient-accent/10 rounded-lg border border-accent/20">
            <div className="space-y-2">
              <Label htmlFor="valorEntrada" className="text-sm font-medium text-foreground">Valor da Entrada (20%)</Label>
              <Input
                id="valorEntrada"
                value={data.valorEntrada ? formatCurrency(data.valorEntrada) : ''}
                onChange={(e) => handleCurrencyChange("valorEntrada", e.target.value)}
                placeholder="R$ 0"
                className="text-base"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="valorFinanciado" className="text-sm font-medium text-foreground">Valor Financiado</Label>
              <Input
                id="valorFinanciado"
                value={data.valorFinanciado ? formatCurrency(data.valorFinanciado) : ''}
                onChange={(e) => handleCurrencyChange("valorFinanciado", e.target.value)}
                placeholder="R$ 0"
                className="text-base"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="percentualJuros" className="text-sm font-medium text-foreground">Percentual de Juros (% a.a.)</Label>
              <Input
                id="percentualJuros"
                value={data.percentualJuros}
                onChange={(e) => handleValueChange("percentualJuros", e.target.value)}
                placeholder="Ex: 8.5"
                type="number"
                step="0.1"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="prazoFinanciamento" className="text-sm font-medium text-foreground">Prazo do Financiamento (anos)</Label>
              <Input
                id="prazoFinanciamento"
                value={data.prazoFinanciamento}
                onChange={(e) => handleValueChange("prazoFinanciamento", e.target.value)}
                placeholder="Ex: 30"
                type="number"
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="valorParcela" className="text-sm font-medium text-foreground">Valor da Parcela Mensal</Label>
              <Input
                id="valorParcela"
                value={data.valorParcela ? formatCurrency(data.valorParcela) : ''}
                onChange={(e) => handleCurrencyChange("valorParcela", e.target.value)}
                placeholder="R$ 0"
                className="text-base"
              />
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="taxaCartorio" className="text-sm font-medium text-foreground">Taxa de Cartório (%)</Label>
            <Input
              id="taxaCartorio"
              value={data.taxaCartorio}
              onChange={(e) => handleValueChange("taxaCartorio", e.target.value)}
              placeholder="3.0"
              type="number"
              step="0.1"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="reformaMobilia" className="text-sm font-medium text-foreground">Reforma/Mobília</Label>
            <Input
              id="reformaMobilia"
              value={data.reformaMobilia ? formatCurrency(data.reformaMobilia) : ''}
              onChange={(e) => handleCurrencyChange("reformaMobilia", e.target.value)}
              placeholder="R$ 0"
              className="text-base"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="outrasDespesas" className="text-sm font-medium text-foreground">Outras Despesas</Label>
            <Input
              id="outrasDespesas"
              value={data.outrasDespesas ? formatCurrency(data.outrasDespesas) : ''}
              onChange={(e) => handleCurrencyChange("outrasDespesas", e.target.value)}
              placeholder="R$ 0"
              className="text-base"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
