
import { useState, useEffect } from "react";
import { Layout } from "@/components/Layout";
import { PropertySimulatorCard } from "@/components/PropertySimulatorCard";
import { RevenueProjectionCard } from "@/components/RevenueProjectionCard";
import { PropertyAnalysisCard } from "@/components/PropertyAnalysisCard";
import { RiskAssessmentCard } from "@/components/RiskAssessmentCard";
import { ChartsAnalysisCard } from "@/components/ChartsAnalysisCard";
import { useToast } from "@/hooks/use-toast";

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

interface RevenueData {
  aluguelMensal: string;
  vacanciaMedia: string;
  condominio: string;
  iptu: string;
  despesasFixas: string;
}

const Index = () => {
  const { toast } = useToast();
  const [propertyData, setPropertyData] = useState<PropertyData>({
    cidade: "",
    estado: "",
    tipo: "",
    finalidade: "",
    valorCompra: "",
    valorEntrada: "",
    financiamento: "nao",
    valorFinanciado: "",
    percentualJuros: "",
    prazoFinanciamento: "",
    valorParcela: "",
    taxaCartorio: "3.0",
    reformaMobilia: "",
    outrasDespesas: ""
  });

  const [revenueData, setRevenueData] = useState<RevenueData>({
    aluguelMensal: "",
    vacanciaMedia: "8.0",
    condominio: "",
    iptu: "",
    despesasFixas: ""
  });

  const [isCalculated, setIsCalculated] = useState(false);

  const calculateAnalysis = () => {
    if (!propertyData.valorCompra || !propertyData.valorEntrada) {
      toast({
        title: "Dados incompletos",
        description: "Preencha pelo menos o valor de compra e entrada do imóvel.",
        variant: "destructive",
      });
      return;
    }

    setIsCalculated(true);
    toast({
      title: "Análise calculada!",
      description: "Todos os dados foram processados com sucesso.",
    });
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4 animate-fade-in">
          <h1 className="text-4xl lg:text-5xl font-bold text-foreground">
            Simulador de <span className="text-background bg-yellow-primary px-2 py-1 rounded">Imóveis</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Analise a rentabilidade dos seus investimentos imobiliários e descubra o potencial de retorno em aluguel e revenda.
          </p>
        </div>

        {/* Simulador de Imóveis */}
        <PropertySimulatorCard 
          data={propertyData}
          setData={setPropertyData}
          onCalculate={calculateAnalysis}
        />

        {/* Receita Projetada */}
        <RevenueProjectionCard 
          data={revenueData}
          setData={setRevenueData}
          propertyData={propertyData}
        />

        {/* Análise do Imóvel */}
        {isCalculated && (
          <PropertyAnalysisCard 
            propertyData={propertyData}
            revenueData={revenueData}
          />
        )}

        {/* Avaliação de Riscos */}
        {isCalculated && (
          <RiskAssessmentCard 
            propertyData={propertyData}
            revenueData={revenueData}
          />
        )}

        {/* Gráficos e Análises */}
        {isCalculated && (
          <ChartsAnalysisCard 
            propertyData={propertyData}
            revenueData={revenueData}
          />
        )}

        {/* Footer */}
        <footer className="mt-16 py-8 border-t border-border/50 text-center">
          <h3 className="text-xl font-bold text-foreground mb-2">Construa seu Futuro</h3>
          <p className="text-sm text-muted-foreground">Todos os Direitos Reservados</p>
        </footer>
      </div>
    </Layout>
  );
};

export default Index;
