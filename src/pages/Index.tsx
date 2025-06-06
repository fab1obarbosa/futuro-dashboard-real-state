
import { useState, useEffect } from "react";
import { Layout } from "@/components/Layout";
import { SimulatorCard } from "@/components/SimulatorCard";
import { ResultsCard } from "@/components/ResultsCard";
import { ChartCard } from "@/components/ChartCard";
import { useToast } from "@/hooks/use-toast";

interface Results {
  rentabilidadeMensal: number;
  rentabilidadeAnual: number;
  valorFinalImovel: number;
  totalRecebidoAluguel: number;
  lucroTotal: number;
  retornoInvestimento: number;
  payback: number;
}

interface ChartData {
  ano: number;
  valorImovel: number;
  aluguelAcumulado: number;
  lucroTotal: number;
}

const Index = () => {
  const { toast } = useToast();
  const [valorImovel, setValorImovel] = useState("350000");
  const [valorEntrada, setValorEntrada] = useState("70000");
  const [valorAluguel, setValorAluguel] = useState("2500");
  const [custosAdicionais, setCustosAdicionais] = useState("300");
  const [valorizacaoAnual, setValorizacaoAnual] = useState("5.0");
  const [periodo, setPeriodo] = useState("10");
  const [tipoAnalise, setTipoAnalise] = useState("completa");
  const [results, setResults] = useState<Results | null>(null);
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [isCalculating, setIsCalculating] = useState(false);

  const calculateRealEstate = async () => {
    const valorImovelNum = parseFloat(valorImovel) || 0;
    const valorEntradaNum = parseFloat(valorEntrada) || 0;
    const valorAluguelNum = parseFloat(valorAluguel) || 0;
    const custosAdicionaisNum = parseFloat(custosAdicionais) || 0;
    const valorizacaoAnualNum = parseFloat(valorizacaoAnual) || 0;
    const periodoNum = parseInt(periodo) || 0;

    if (valorImovelNum <= 0 || valorEntradaNum <= 0 || periodoNum <= 0) {
      toast({
        title: "Erro",
        description: "Por favor, insira valores válidos para todos os campos obrigatórios.",
        variant: "destructive",
      });
      return;
    }

    setIsCalculating(true);

    // Simular carregamento para melhor UX
    await new Promise(resolve => setTimeout(resolve, 1000));

    try {
      const aluguelLiquido = valorAluguelNum - custosAdicionaisNum;
      const rentabilidadeMensal = (aluguelLiquido / valorEntradaNum) * 100;
      const rentabilidadeAnual = rentabilidadeMensal * 12;
      
      // Calcular valorização do imóvel ao longo dos anos
      const dadosGrafico: ChartData[] = [];
      let aluguelAcumuladoTotal = 0;
      
      for (let ano = 0; ano <= periodoNum; ano++) {
        const valorImovelAtual = valorImovelNum * Math.pow(1 + valorizacaoAnualNum / 100, ano);
        aluguelAcumuladoTotal = aluguelLiquido * 12 * ano;
        
        const lucroValorizacao = valorImovelAtual - valorImovelNum;
        const lucroTotalAno = aluguelAcumuladoTotal + lucroValorizacao - valorEntradaNum;
        
        dadosGrafico.push({
          ano,
          valorImovel: valorImovelAtual,
          aluguelAcumulado: aluguelAcumuladoTotal,
          lucroTotal: lucroTotalAno
        });
      }

      const dadosFinal = dadosGrafico[dadosGrafico.length - 1];
      const valorFinalImovel = dadosFinal.valorImovel;
      const totalRecebidoAluguel = dadosFinal.aluguelAcumulado;
      const lucroValorizacao = valorFinalImovel - valorImovelNum;
      const lucroTotal = totalRecebidoAluguel + lucroValorizacao - valorEntradaNum;
      const retornoInvestimento = (lucroTotal / valorEntradaNum) * 100;
      const payback = valorEntradaNum / (aluguelLiquido * 12);

      const resultados: Results = {
        rentabilidadeMensal,
        rentabilidadeAnual,
        valorFinalImovel,
        totalRecebidoAluguel,
        lucroTotal,
        retornoInvestimento,
        payback
      };

      setResults(resultados);
      setChartData(dadosGrafico);

      toast({
        title: "Análise concluída!",
        description: "Sua análise imobiliária foi processada com sucesso.",
      });

    } catch (error) {
      toast({
        title: "Erro na análise",
        description: "Ocorreu um erro ao processar sua análise. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsCalculating(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4 animate-fade-in">
          <h1 className="text-4xl lg:text-5xl font-bold text-foreground">
            Simulador de <span className="text-transparent bg-clip-text bg-gradient-primary">Imóveis</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Analise a rentabilidade dos seus investimentos imobiliários e descubra o potencial de retorno em aluguel e revenda.
          </p>
        </div>

        {/* Grid Layout Responsivo */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          {/* Coluna Esquerda - Simulador */}
          <div className="space-y-6">
            <SimulatorCard
              valorImovel={valorImovel}
              setValorImovel={setValorImovel}
              valorEntrada={valorEntrada}
              setValorEntrada={setValorEntrada}
              valorAluguel={valorAluguel}
              setValorAluguel={setValorAluguel}
              custosAdicionais={custosAdicionais}
              setCustosAdicionais={setCustosAdicionais}
              valorizacaoAnual={valorizacaoAnual}
              setValorizacaoAnual={setValorizacaoAnual}
              periodo={periodo}
              setPeriodo={setPeriodo}
              tipoAnalise={tipoAnalise}
              setTipoAnalise={setTipoAnalise}
              onCalculate={calculateRealEstate}
              isCalculating={isCalculating}
            />

            <ResultsCard results={results} />
          </div>

          {/* Coluna Direita - Gráficos */}
          <div className="space-y-6">
            <ChartCard data={chartData} />
          </div>
        </div>

        {/* Cards de Dicas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          {[
            {
              title: "Localização é Tudo",
              description: "A localização é o fator mais importante para a valorização e facilidade de locação do imóvel.",
              color: "bg-gradient-primary"
            },
            {
              title: "Analise os Custos",
              description: "Considere todos os custos: IPTU, condomínio, manutenção, vacância e administração predial.",
              color: "bg-gradient-accent"
            },
            {
              title: "Diversifique",
              description: "Considere diferentes tipos de imóveis e regiões para reduzir riscos e otimizar retornos.",
              color: "bg-gradient-card"
            }
          ].map((tip, index) => (
            <div 
              key={tip.title}
              className={`p-6 rounded-xl ${tip.color} border border-border/50 shadow-lg animate-fade-in hover:scale-105 transition-transform duration-200`}
              style={{ animationDelay: `${index * 200}ms` }}
            >
              <h3 className="text-lg font-semibold text-foreground mb-2">{tip.title}</h3>
              <p className="text-muted-foreground text-sm">{tip.description}</p>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default Index;
