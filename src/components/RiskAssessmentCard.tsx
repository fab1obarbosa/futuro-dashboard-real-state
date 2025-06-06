
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { AlertTriangle, Shield } from "lucide-react";

interface PropertyData {
  cidade: string;
  tipo: string;
  valorCompra: string;
}

interface RevenueData {
  aluguelMensal: string;
  vacanciaMedia: string;
}

interface RiskAssessmentCardProps {
  propertyData: PropertyData;
  revenueData: RevenueData;
}

export function RiskAssessmentCard({ propertyData, revenueData }: RiskAssessmentCardProps) {
  // Simulação de cálculos de risco baseados nos dados
  const calculateLiquidity = () => {
    const cidades = {
      "São Paulo": 85,
      "Rio de Janeiro": 80,
      "Belo Horizonte": 75,
      "Brasília": 70,
      "Curitiba": 70,
      "Porto Alegre": 68,
      "Salvador": 65,
      "Fortaleza": 62,
      "Recife": 60,
      "Goiânia": 58
    };
    return cidades[propertyData.cidade as keyof typeof cidades] || 50;
  };

  const calculateLocation = () => {
    const tipos = {
      "residencial": 75,
      "comercial": 65,
      "rural": 45
    };
    return tipos[propertyData.tipo as keyof typeof tipos] || 50;
  };

  const calculateCompetition = () => {
    const valorCompra = parseFloat(propertyData.valorCompra) || 0;
    if (valorCompra < 200000) return 85;
    if (valorCompra < 500000) return 70;
    if (valorCompra < 1000000) return 55;
    return 40;
  };

  const calculateVacancyRisk = () => {
    const vacancia = parseFloat(revenueData.vacanciaMedia) || 0;
    if (vacancia <= 5) return 85;
    if (vacancia <= 10) return 70;
    if (vacancia <= 15) return 55;
    return 35;
  };

  const calculateDevaluationRisk = () => {
    const location = calculateLocation();
    const liquidity = calculateLiquidity();
    return (location + liquidity) / 2;
  };

  const liquidez = calculateLiquidity();
  const localizacao = calculateLocation();
  const concorrencia = calculateCompetition();
  const riscoVacancia = calculateVacancyRisk();
  const riscoDesvalorizacao = calculateDevaluationRisk();
  
  const mediaGeral = (liquidez + localizacao + concorrencia + riscoVacancia + riscoDesvalorizacao) / 5;

  const getInvestmentAdvice = (score: number) => {
    if (score >= 75) return { text: "✅ Excelente investimento! Baixo risco e boa perspectiva de retorno.", color: "text-green-600" };
    if (score >= 60) return { text: "⚠️ Investimento médio. Considere os riscos antes de prosseguir.", color: "text-yellow-600" };
    return { text: "❌ Investimento arriscado. Recomendamos cautela e reavaliação.", color: "text-red-600" };
  };

  const advice = getInvestmentAdvice(mediaGeral);

  const riskItems = [
    {
      title: "Liquidez do Imóvel",
      description: "Facilidade de venda ou locação",
      value: liquidez
    },
    {
      title: "Localização",
      description: "Qualidade da região e infraestrutura",
      value: localizacao
    },
    {
      title: "Concorrência",
      description: "Disponibilidade de imóveis similares",
      value: concorrencia
    },
    {
      title: "Risco de Vacância",
      description: "Probabilidade de ficar vazio",
      value: riscoVacancia
    },
    {
      title: "Risco de Desvalorização",
      description: "Potencial de perda de valor",
      value: riscoDesvalorizacao
    }
  ];

  return (
    <Card className="bg-gradient-card border-border/50 shadow-xl animate-slide-up">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-3 text-xl text-foreground">
          <div className="w-10 h-10 bg-gradient-accent rounded-lg flex items-center justify-center">
            <Shield className="w-5 h-5 text-accent-foreground" />
          </div>
          Avaliação de Riscos
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {riskItems.map((item, index) => (
          <div key={item.title} className="space-y-2">
            <div className="flex justify-between items-center">
              <div>
                <h4 className="font-medium text-foreground">{item.title}</h4>
                <p className="text-sm text-muted-foreground">{item.description}</p>
              </div>
              <span className="text-lg font-bold text-primary">{item.value.toFixed(0)}%</span>
            </div>
            <Progress 
              value={item.value} 
              className="h-3"
            />
          </div>
        ))}

        {/* Média Geral */}
        <div className="mt-8 p-4 bg-gradient-primary/10 rounded-lg border border-primary/20">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-semibold text-foreground">Média Geral de Riscos</h3>
            <span className="text-2xl font-bold text-primary">{mediaGeral.toFixed(0)}%</span>
          </div>
          <Progress value={mediaGeral} className="h-4 mb-3" />
          <p className={`text-sm font-medium ${advice.color}`}>
            {advice.text}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
