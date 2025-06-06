
import { useState, useEffect } from "react";
import { Layout } from "@/components/Layout";
import { SimulatorCard } from "@/components/SimulatorCard";
import { ResultsCard } from "@/components/ResultsCard";
import { ChartCard } from "@/components/ChartCard";
import { useToast } from "@/hooks/use-toast";

interface Results {
  valorFinal: number;
  totalInvestido: number;
  totalJuros: number;
  rentabilidade: number;
}

interface ChartData {
  ano: number;
  valorInvestido: number;
  valorTotal: number;
  juros: number;
}

const Index = () => {
  const { toast } = useToast();
  const [valorInicial, setValorInicial] = useState("10000");
  const [valorMensal, setValorMensal] = useState("500");
  const [taxa, setTaxa] = useState("12");
  const [periodo, setPeriodo] = useState("10");
  const [tipoInvestimento, setTipoInvestimento] = useState("cdi");
  const [results, setResults] = useState<Results | null>(null);
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [isCalculating, setIsCalculating] = useState(false);

  // Atualizar taxa baseada no tipo de investimento
  useEffect(() => {
    const taxasPredefinidas = {
      poupanca: "6",
      cdi: "12",
      ipca: "10",
      acoes: "15",
      personalizado: taxa
    };
    
    if (tipoInvestimento !== "personalizado") {
      setTaxa(taxasPredefinidas[tipoInvestimento as keyof typeof taxasPredefinidas]);
    }
  }, [tipoInvestimento]);

  const calculateInvestment = async () => {
    const valorInicialNum = parseFloat(valorInicial) || 0;
    const valorMensalNum = parseFloat(valorMensal) || 0;
    const taxaNum = parseFloat(taxa) || 0;
    const periodoNum = parseInt(periodo) || 0;

    if (taxaNum <= 0 || periodoNum <= 0) {
      toast({
        title: "Erro",
        description: "Por favor, insira valores válidos para taxa e período.",
        variant: "destructive",
      });
      return;
    }

    setIsCalculating(true);

    // Simular carregamento para melhor UX
    await new Promise(resolve => setTimeout(resolve, 1000));

    try {
      const taxaMensal = taxaNum / 100 / 12;
      const totalMeses = periodoNum * 12;
      
      let valorAtual = valorInicialNum;
      const dadosGrafico: ChartData[] = [];
      
      // Calcular ano a ano
      for (let ano = 0; ano <= periodoNum; ano++) {
        const mesesDecorridos = ano * 12;
        let valorAcumulado = valorInicialNum;
        
        // Calcular juros compostos do valor inicial
        if (mesesDecorridos > 0) {
          valorAcumulado = valorInicialNum * Math.pow(1 + taxaMensal, mesesDecorridos);
        }
        
        // Calcular valor dos aportes mensais
        let valorAportes = 0;
        if (mesesDecorridos > 0 && valorMensalNum > 0) {
          valorAportes = valorMensalNum * (Math.pow(1 + taxaMensal, mesesDecorridos) - 1) / taxaMensal;
        }
        
        const valorTotal = valorAcumulado + valorAportes;
        const totalInvestidoAno = valorInicialNum + (valorMensalNum * mesesDecorridos);
        const jurosAno = valorTotal - totalInvestidoAno;
        
        dadosGrafico.push({
          ano,
          valorInvestido: totalInvestidoAno,
          valorTotal: valorTotal,
          juros: jurosAno
        });
      }

      const dadosFinal = dadosGrafico[dadosGrafico.length - 1];
      const totalInvestido = valorInicialNum + (valorMensalNum * totalMeses);
      const totalJuros = dadosFinal.valorTotal - totalInvestido;
      const rentabilidade = (totalJuros / totalInvestido) * 100;

      const resultados: Results = {
        valorFinal: dadosFinal.valorTotal,
        totalInvestido,
        totalJuros,
        rentabilidade
      };

      setResults(resultados);
      setChartData(dadosGrafico);

      toast({
        title: "Cálculo realizado!",
        description: "Sua simulação foi processada com sucesso.",
      });

    } catch (error) {
      toast({
        title: "Erro no cálculo",
        description: "Ocorreu um erro ao processar sua simulação. Tente novamente.",
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
            Simulador de <span className="text-transparent bg-clip-text bg-gradient-primary">Investimentos</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Descubra o potencial dos seus investimentos e planeje seu futuro financeiro com nossa ferramenta completa de simulação.
          </p>
        </div>

        {/* Grid Layout Responsivo */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          {/* Coluna Esquerda - Simulador */}
          <div className="space-y-6">
            <SimulatorCard
              valorInicial={valorInicial}
              setValorInicial={setValorInicial}
              valorMensal={valorMensal}
              setValorMensal={setValorMensal}
              taxa={taxa}
              setTaxa={setTaxa}
              periodo={periodo}
              setPeriodo={setPeriodo}
              tipoInvestimento={tipoInvestimento}
              setTipoInvestimento={setTipoInvestimento}
              onCalculate={calculateInvestment}
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
              title: "Comece Cedo",
              description: "Quanto antes você começar a investir, mais tempo seus juros compostos terão para trabalhar a seu favor.",
              color: "bg-gradient-primary"
            },
            {
              title: "Seja Consistente",
              description: "Aportes mensais regulares podem fazer uma diferença significativa no resultado final.",
              color: "bg-gradient-accent"
            },
            {
              title: "Diversifique",
              description: "Não coloque todos os ovos na mesma cesta. Diversificar reduz riscos e otimiza retornos.",
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
