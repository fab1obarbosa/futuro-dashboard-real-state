
import { useState, useEffect } from "react";
import { Layout } from "@/components/Layout";
import { PropertySimulatorCard } from "@/components/PropertySimulatorCard";
import { RevenueProjectionCard } from "@/components/RevenueProjectionCard";
import { PropertyAnalysisCard } from "@/components/PropertyAnalysisCard";
import { RiskAssessmentCard } from "@/components/RiskAssessmentCard";
import { ChartsAnalysisCard } from "@/components/ChartsAnalysisCard";
import { useToast } from "@/hooks/use-toast";

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
    estado: "",
    cidade: "",
    tipo: "",
    finalidade: "",
    valorCompra: "",
    financiamento: "nao",
    valorEntrada: "",
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
    if (!propertyData.valorCompra || !revenueData.aluguelMensal) {
      toast({
        title: "Dados incompletos",
        description: "Preencha pelo menos o valor de compra do imóvel e o aluguel mensal.",
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
      <div className="max-w-4xl mx-auto space-y-6 px-4">
        {/* Header */}
        <div className="text-center space-y-4 animate-fade-in">
          <h1 className="text-3xl lg:text-4xl font-bold text-foreground">
            Simulador de <span className="bg-yellow-primary text-black px-2 py-1 rounded font-bold">Investimentos</span> Imobiliários
          </h1>
          <p className="text-base text-muted-foreground max-w-2xl mx-auto">
            Analise a rentabilidade dos seus investimentos imobiliários e descubra o potencial de retorno em aluguel e revenda.
          </p>
        </div>

        {/* Simulador de Imóveis */}
        <PropertySimulatorCard 
          data={propertyData}
          setData={setPropertyData}
        />

        {/* Receita Projetada */}
        <RevenueProjectionCard 
          data={revenueData}
          setData={setRevenueData}
          propertyData={propertyData}
          onCalculate={calculateAnalysis}
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
        <footer className="mt-12 py-4 border-t border-border/30 text-center">
          <p className="text-xs text-muted-foreground">
            <span className="font-semibold">Construa seu Futuro</span> - Todos os Direitos Reservados
          </p>
        </footer>
      </div>
    </Layout>
  );
};

export default Index;
