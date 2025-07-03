export type CalculationType = {
  id: string;
  title: string;
  description: string;
  icon: string; // Manter como string, emojis funcionam bem em Text no RN
  category: string;
};

export type CalculationHistory = {
  id: string; // Pode ser um timestamp ou UUID
  type: string; // Título do cálculo, ex: "Perda de Carga Localizada"
  timestamp: string; // ISO string date
  inputs: Record<string, number | string>; // As entradas podem ser números ou texto inicialmente
  result: Record<string, any>; // O resultado pode ter múltiplos campos
};

export type ViewMode = "splash" | "dashboard" | "calculation" | "learning";

// Dados de exemplo, podem ser movidos para um arquivo de constantes ou carregados de uma API/config
export const calculationsData: CalculationType[] = [
  {
    id: "head-loss",
    title: "Perda de Carga Localizada",
    description: "Calcule perdas de pressão em conexões, válvulas e componentes",
    icon: "🔧",
    category: "Perda de Pressão",
  },
  {
    id: "pipe-flow",
    title: "Vazão em Tubulações",
    description: "Determine a vazão através de tubos usando vários métodos",
    icon: "🌊",
    category: "Análise de Fluxo",
  },
  {
    id: "pressure-drop",
    title: "Perda de Pressão",
    description: "Calcule a perda de pressão ao longo de tubulações",
    icon: "📉",
    category: "Perda de Pressão",
  },
  {
    id: "pump-power",
    title: "Potência da Bomba",
    description: "Calcule a potência necessária e eficiência da bomba",
    icon: "⚡",
    category: "Projeto de Bombas",
  },
  {
    id: "flow-velocity",
    title: "Velocidade do Fluxo",
    description: "Determine a velocidade do fluido em tubos e canais",
    icon: "🏃",
    category: "Análise de Fluxo",
  },
  {
    id: "reynolds-number",
    title: "Número de Reynolds",
    description: "Calcule o número de Reynolds para determinação do regime de fluxo",
    icon: "🔢",
    category: "Análise de Fluxo",
  },
];
