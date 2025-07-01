"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { ArrowLeft, CheckCircle, XCircle, Clock, Award, RotateCcw } from "lucide-react"
import { MathRenderer } from "@/components/math-renderer"
import type { CalculationType, AssessmentResult } from "@/app/page"

interface Question {
  id: string
  question: string
  options: string[]
  correct: number
  explanation: string
  difficulty: "easy" | "medium" | "hard"
  topic: string
}

interface AssessmentViewProps {
  calculation: CalculationType
  onBack: () => void
  onAssessmentComplete: (result: AssessmentResult) => void
  previousResults: AssessmentResult[]
}

const questions: Record<string, Question[]> = {
  "head-loss": [
    {
      id: "hl-1",
      question: "A perda de carga localizada em uma válvula é calculada pela fórmula:",
      options: [
        "$$h_L = K \\frac{V^2}{2g}$$",
        "$$h_L = f \\frac{L}{D} \\frac{V^2}{2g}$$",
        "$$h_L = \\frac{\\Delta P}{\\rho g}$$",
        "$$h_L = \\frac{Q^2}{C^2 A^2}$$",
      ],
      correct: 0,
      explanation:
        "A perda de carga localizada é dada por $$h_L = K \\frac{V^2}{2g}$$, onde K é o coeficiente de perda localizada, V é a velocidade do fluido e g é a aceleração da gravidade.",
      difficulty: "easy",
      topic: "Perda de Carga Localizada",
    },
    {
      id: "hl-2",
      question: "O coeficiente K para uma válvula gaveta totalmente aberta é aproximadamente:",
      options: ["0,1", "0,5", "1,0", "2,0"],
      correct: 0,
      explanation:
        "Para uma válvula gaveta totalmente aberta, o coeficiente K é aproximadamente 0,1, representando uma perda de carga muito baixa.",
      difficulty: "medium",
      topic: "Perda de Carga Localizada",
    },
    {
      id: "hl-3",
      question: "Em uma expansão súbita, a perda de carga depende principalmente de:",
      options: [
        "Apenas da velocidade inicial",
        "Da diferença entre as áreas das seções",
        "Apenas do material da tubulação",
        "Da temperatura do fluido",
      ],
      correct: 1,
      explanation:
        "Na expansão súbita, a perda de carga é função da mudança de velocidade causada pela diferença entre as áreas das seções: $$h_L = \\frac{(V_1 - V_2)^2}{2g}$$",
      difficulty: "medium",
      topic: "Perda de Carga Localizada",
    },
    {
      id: "hl-4",
      question: "Para minimizar perdas localizadas em curvas, deve-se:",
      options: [
        "Usar curvas de 90° sempre",
        "Aumentar o diâmetro da tubulação",
        "Usar curvas com raio de curvatura maior",
        "Diminuir a velocidade do fluido",
      ],
      correct: 2,
      explanation:
        "Curvas com maior raio de curvatura (R/D > 1,5) apresentam menores coeficientes de perda localizada, reduzindo significativamente as perdas de energia.",
      difficulty: "hard",
      topic: "Perda de Carga Localizada",
    },
    {
      id: "hl-5",
      question:
        "A perda de carga em uma contração súbita com relação de áreas $$\\frac{A_2}{A_1} = 0,5$$ tem coeficiente K aproximadamente:",
      options: ["0,1", "0,25", "0,375", "0,5"],
      correct: 2,
      explanation:
        "Para contração súbita, $$K = 0,5(1 - \\frac{A_2}{A_1})$$. Com $$\\frac{A_2}{A_1} = 0,5$$: $$K = 0,5(1 - 0,5) = 0,375$$",
      difficulty: "hard",
      topic: "Perda de Carga Localizada",
    },
  ],
  "pipe-flow": [
    {
      id: "pf-1",
      question: "A equação da continuidade para escoamento permanente em tubulação é:",
      options: [
        "$$Q = A \\cdot V$$",
        "$$A_1 V_1 = A_2 V_2$$",
        "$$\\rho_1 A_1 V_1 = \\rho_2 A_2 V_2$$",
        "Todas as anteriores",
      ],
      correct: 3,
      explanation:
        "Todas as equações são válidas: $$Q = A \\cdot V$$ define vazão, $$A_1 V_1 = A_2 V_2$$ para fluido incompressível, e $$\\rho_1 A_1 V_1 = \\rho_2 A_2 V_2$$ é a forma geral.",
      difficulty: "easy",
      topic: "Vazão em Tubulações",
    },
    {
      id: "pf-2",
      question: "Para um tubo de diâmetro 100 mm com velocidade de 2 m/s, a vazão é:",
      options: [
        "$$0,0157 \\text{ m}^3/\\text{s}$$",
        "$$0,0314 \\text{ m}^3/\\text{s}$$",
        "$$0,0628 \\text{ m}^3/\\text{s}$$",
        "$$0,1256 \\text{ m}^3/\\text{s}$$",
      ],
      correct: 0,
      explanation:
        "$$Q = A \\cdot V = \\frac{\\pi D^2}{4} \\cdot V = \\frac{\\pi \\times 0,1^2}{4} \\times 2 = 0,0157 \\text{ m}^3/\\text{s}$$",
      difficulty: "medium",
      topic: "Vazão em Tubulações",
    },
    {
      id: "pf-3",
      question: "A velocidade econômica em tubulações de água é geralmente:",
      options: ["0,5 a 1,0 m/s", "1,0 a 3,0 m/s", "3,0 a 5,0 m/s", "Acima de 5,0 m/s"],
      correct: 1,
      explanation:
        "A velocidade econômica para água em tubulações é tipicamente entre 1,0 e 3,0 m/s, balanceando custos de bombeamento e dimensionamento da tubulação.",
      difficulty: "medium",
      topic: "Vazão em Tubulações",
    },
    {
      id: "pf-4",
      question:
        "Em uma bifurcação, se $$Q_1 = 10 \\text{ L/s}$$ entra e $$Q_2 = 6 \\text{ L/s}$$ sai por um ramo, a vazão no outro ramo é:",
      options: ["4 L/s", "6 L/s", "10 L/s", "16 L/s"],
      correct: 0,
      explanation:
        "Pela conservação da massa: $$Q_1 = Q_2 + Q_3$$, então $$Q_3 = Q_1 - Q_2 = 10 - 6 = 4 \\text{ L/s}$$",
      difficulty: "easy",
      topic: "Vazão em Tubulações",
    },
    {
      id: "pf-5",
      question: "Para manter a mesma vazão ao reduzir o diâmetro de 200 mm para 100 mm, a velocidade:",
      options: ["Permanece igual", "Dobra", "Quadruplica", "Reduz pela metade"],
      correct: 2,
      explanation:
        "$$\\frac{V_2}{V_1} = \\frac{A_1}{A_2} = \\frac{D_1^2}{D_2^2} = \\frac{200^2}{100^2} = 4$$. A velocidade quadruplica.",
      difficulty: "hard",
      topic: "Vazão em Tubulações",
    },
  ],
  "pressure-drop": [
    {
      id: "pd-1",
      question: "A equação de Darcy-Weisbach para perda de carga distribuída é:",
      options: [
        "$$h_f = f \\frac{L}{D} \\frac{V^2}{2g}$$",
        "$$h_f = \\frac{10,67 Q^{1,85}}{C^{1,85} D^{4,87}}$$",
        "$$h_f = \\frac{Q^2}{K^2}$$",
        "$$h_f = \\lambda \\frac{L}{D} \\frac{V^2}{2g}$$",
      ],
      correct: 0,
      explanation:
        "A equação de Darcy-Weisbach é $$h_f = f \\frac{L}{D} \\frac{V^2}{2g}$$, onde f é o fator de atrito, L o comprimento, D o diâmetro, V a velocidade e g a gravidade.",
      difficulty: "easy",
      topic: "Perda de Pressão",
    },
    {
      id: "pd-2",
      question: "O fator de atrito f para escoamento laminar (Re < 2000) é:",
      options: [
        "$$f = \\frac{64}{Re}$$",
        "$$f = \\frac{16}{Re}$$",
        "$$f = 0,316 Re^{-0,25}$$",
        "$$f = 0,0791 Re^{-0,25}$$",
      ],
      correct: 0,
      explanation:
        "Para escoamento laminar em tubos circulares, o fator de atrito é $$f = \\frac{64}{Re}$$, onde Re é o número de Reynolds.",
      difficulty: "medium",
      topic: "Perda de Pressão",
    },
    {
      id: "pd-3",
      question: "A rugosidade relativa é definida como:",
      options: [
        "$$\\frac{\\varepsilon}{D}$$",
        "$$\\frac{D}{\\varepsilon}$$",
        "$$\\varepsilon \\times D$$",
        "$$\\frac{\\varepsilon}{L}$$",
      ],
      correct: 0,
      explanation:
        "A rugosidade relativa é $$\\frac{\\varepsilon}{D}$$, onde ε é a rugosidade absoluta da parede e D é o diâmetro interno do tubo.",
      difficulty: "medium",
      topic: "Perda de Pressão",
    },
    {
      id: "pd-4",
      question: "Para tubos comerciais de aço, a rugosidade absoluta ε é aproximadamente:",
      options: ["0,045 mm", "0,15 mm", "0,5 mm", "1,5 mm"],
      correct: 0,
      explanation:
        "Tubos comerciais de aço têm rugosidade absoluta típica de ε = 0,045 mm, valor usado nos cálculos de perda de carga.",
      difficulty: "hard",
      topic: "Perda de Pressão",
    },
    {
      id: "pd-5",
      question: "No diagrama de Moody, a zona de transição ocorre quando:",
      options: ["Re < 2000", "2000 < Re < 4000", "Re > 4000 e depende de ε/D", "Re > 10⁶"],
      correct: 2,
      explanation:
        "A zona de transição no diagrama de Moody ocorre para Re > 4000, onde o fator de atrito depende tanto do número de Reynolds quanto da rugosidade relativa ε/D.",
      difficulty: "hard",
      topic: "Perda de Pressão",
    },
  ],
  "pump-power": [
    {
      id: "pp-1",
      question: "A potência hidráulica de uma bomba é calculada por:",
      options: [
        "$$P_h = \\rho g Q H$$",
        "$$P_h = \\frac{\\rho g Q H}{\\eta}$$",
        "$$P_h = Q H$$",
        "$$P_h = \\frac{Q H}{\\eta}$$",
      ],
      correct: 0,
      explanation:
        "A potência hidráulica é $$P_h = \\rho g Q H$$, onde ρ é a densidade do fluido, g a gravidade, Q a vazão e H a altura manométrica.",
      difficulty: "easy",
      topic: "Potência da Bomba",
    },
    {
      id: "pp-2",
      question: "A eficiência global de uma bomba é o produto de:",
      options: [
        "$$\\eta_{global} = \\eta_{hidraulica} \\times \\eta_{mecanica}$$",
        "$$\\eta_{global} = \\eta_{hidraulica} \\times \\eta_{volumetrica}$$",
        "$$\\eta_{global} = \\eta_{hidraulica} \\times \\eta_{mecanica} \\times \\eta_{volumetrica}$$",
        "$$\\eta_{global} = \\eta_{mecanica} \\times \\eta_{volumetrica}$$",
      ],
      correct: 2,
      explanation:
        "A eficiência global é $$\\eta_{global} = \\eta_{hidraulica} \\times \\eta_{mecanica} \\times \\eta_{volumetrica}$$, considerando todas as perdas da bomba.",
      difficulty: "medium",
      topic: "Potência da Bomba",
    },
    {
      id: "pp-3",
      question: "Para uma bomba com Q = 50 L/s, H = 30 m e η = 75%, a potência no eixo é:",
      options: ["15 kW", "20 kW", "25 kW", "30 kW"],
      correct: 1,
      explanation:
        "$$P_{eixo} = \\frac{\\rho g Q H}{\\eta} = \\frac{1000 \\times 9,81 \\times 0,05 \\times 30}{0,75} = 19,62 \\approx 20 \\text{ kW}$$",
      difficulty: "medium",
      topic: "Potência da Bomba",
    },
    {
      id: "pp-4",
      question: "O NPSH (Net Positive Suction Head) é importante para evitar:",
      options: ["Sobrecarga do motor", "Cavitação na bomba", "Excesso de pressão", "Perda de eficiência"],
      correct: 1,
      explanation:
        "O NPSH disponível deve ser maior que o NPSH requerido para evitar cavitação, que pode danificar a bomba e reduzir drasticamente sua performance.",
      difficulty: "hard",
      topic: "Potência da Bomba",
    },
    {
      id: "pp-5",
      question: "A altura manométrica total (AMT) de uma bomba inclui:",
      options: [
        "Apenas a altura geométrica",
        "Altura geométrica + perdas de carga",
        "Altura geométrica + perdas + pressões",
        "Apenas as perdas de carga",
      ],
      correct: 2,
      explanation:
        "AMT = altura geométrica + perdas de carga + diferença de pressões entre sucção e recalque: $$H = H_{geo} + h_f + \\frac{P_2 - P_1}{\\rho g}$$",
      difficulty: "hard",
      topic: "Potência da Bomba",
    },
  ],
  "flow-velocity": [
    {
      id: "fv-1",
      question: "A velocidade média em uma seção circular é relacionada à vazão por:",
      options: [
        "$$V = \\frac{Q}{A} = \\frac{4Q}{\\pi D^2}$$",
        "$$V = \\frac{Q}{\\pi D^2}$$",
        "$$V = \\frac{Q}{D^2}$$",
        "$$V = \\frac{4Q}{D^2}$$",
      ],
      correct: 0,
      explanation:
        "A velocidade média é $$V = \\frac{Q}{A}$$, onde $$A = \\frac{\\pi D^2}{4}$$ para seção circular, resultando em $$V = \\frac{4Q}{\\pi D^2}$$.",
      difficulty: "easy",
      topic: "Velocidade do Fluxo",
    },
    {
      id: "fv-2",
      question: "Em escoamento laminar em tubo circular, o perfil de velocidades é:",
      options: ["Uniforme", "Parabólico", "Logarítmico", "Linear"],
      correct: 1,
      explanation:
        "No escoamento laminar, o perfil de velocidades é parabólico, com velocidade máxima no centro igual a 2 vezes a velocidade média.",
      difficulty: "medium",
      topic: "Velocidade do Fluxo",
    },
    {
      id: "fv-3",
      question: "A velocidade máxima no centro de um tubo em escoamento laminar é:",
      options: [
        "Igual à velocidade média",
        "1,5 vezes a velocidade média",
        "2 vezes a velocidade média",
        "2,5 vezes a velocidade média",
      ],
      correct: 2,
      explanation:
        "Em escoamento laminar, $$V_{max} = 2V_{media}$$, característica do perfil parabólico de velocidades.",
      difficulty: "medium",
      topic: "Velocidade do Fluxo",
    },
    {
      id: "fv-4",
      question: "Para evitar erosão em tubulações de água, a velocidade não deve exceder:",
      options: ["1 m/s", "2 m/s", "3 m/s", "5 m/s"],
      correct: 2,
      explanation:
        "Para evitar erosão excessiva, a velocidade da água em tubulações não deve exceder 3 m/s, especialmente em curvas e conexões.",
      difficulty: "hard",
      topic: "Velocidade do Fluxo",
    },
    {
      id: "fv-5",
      question: "Em um Venturi, a velocidade na garganta com relação de diâmetros D₁/D₂ = 2 e V₁ = 1 m/s é:",
      options: ["2 m/s", "4 m/s", "6 m/s", "8 m/s"],
      correct: 1,
      explanation:
        "Pela continuidade: $$\\frac{V_2}{V_1} = \\frac{A_1}{A_2} = \\frac{D_1^2}{D_2^2} = 2^2 = 4$$, então $$V_2 = 4 \\times 1 = 4 \\text{ m/s}$$",
      difficulty: "hard",
      topic: "Velocidade do Fluxo",
    },
  ],
  "reynolds-number": [
    {
      id: "rn-1",
      question: "O número de Reynolds é definido como:",
      options: [
        "$$Re = \\frac{\\rho V D}{\\mu}$$",
        "$$Re = \\frac{\\mu V D}{\\rho}$$",
        "$$Re = \\frac{V D}{\\nu}$$",
        "Ambas a primeira e terceira",
      ],
      correct: 3,
      explanation:
        "O número de Reynolds pode ser expresso como $$Re = \\frac{\\rho V D}{\\mu}$$ ou $$Re = \\frac{V D}{\\nu}$$, onde ν = μ/ρ é a viscosidade cinemática.",
      difficulty: "easy",
      topic: "Número de Reynolds",
    },
    {
      id: "rn-2",
      question: "Para tubos circulares, o escoamento é considerado laminar quando:",
      options: ["Re < 2000", "Re < 2300", "Re < 4000", "Re < 10000"],
      correct: 1,
      explanation:
        "Em tubos circulares, o escoamento é laminar para Re < 2300, valor crítico estabelecido experimentalmente.",
      difficulty: "medium",
      topic: "Número de Reynolds",
    },
    {
      id: "rn-3",
      question: "A zona de transição em tubos circulares ocorre para:",
      options: ["2000 < Re < 2300", "2300 < Re < 4000", "4000 < Re < 10000", "Re > 10000"],
      correct: 1,
      explanation:
        "A zona de transição, onde o escoamento pode ser laminar ou turbulento, ocorre para 2300 < Re < 4000.",
      difficulty: "medium",
      topic: "Número de Reynolds",
    },
    {
      id: "rn-4",
      question: "Para água a 20°C (ν = 1,0 × 10⁻⁶ m²/s) em tubo de 50 mm com V = 1 m/s, o Re é:",
      options: ["25.000", "50.000", "75.000", "100.000"],
      correct: 1,
      explanation: "$$Re = \\frac{V D}{\\nu} = \\frac{1 \\times 0,05}{1,0 \\times 10^{-6}} = 50.000$$",
      difficulty: "hard",
      topic: "Número de Reynolds",
    },
    {
      id: "rn-5",
      question: "O número de Reynolds crítico para placas planas é aproximadamente:",
      options: ["2300", "500.000", "1.000.000", "5.000.000"],
      correct: 1,
      explanation:
        "Para escoamento sobre placas planas, a transição laminar-turbulento ocorre em Re ≈ 500.000, baseado na distância da borda de ataque.",
      difficulty: "hard",
      topic: "Número de Reynolds",
    },
  ],
}

export default function AssessmentView({
  calculation,
  onBack,
  onAssessmentComplete,
  previousResults,
}: AssessmentViewProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({})
  const [showResults, setShowResults] = useState(false)
  const [timeLeft, setTimeLeft] = useState(1800) // 30 minutes
  const [isActive, setIsActive] = useState(true)

  const assessmentQuestions = questions[calculation.id] || []
  const totalQuestions = assessmentQuestions.length

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null
    if (isActive && timeLeft > 0 && !showResults) {
      interval = setInterval(() => {
        setTimeLeft((time) => time - 1)
      }, 1000)
    } else if (timeLeft === 0) {
      handleFinishAssessment()
    }
    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isActive, timeLeft, showResults])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const handleAnswerSelect = (questionIndex: number, answerIndex: number) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionIndex]: answerIndex,
    }))
  }

  const handleNextQuestion = () => {
    if (currentQuestion < totalQuestions - 1) {
      setCurrentQuestion(currentQuestion + 1)
    }
  }

  const handlePreviousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
    }
  }

  const handleFinishAssessment = () => {
    setIsActive(false)
    setShowResults(true)

    const correctAnswers = assessmentQuestions.reduce((count, question, index) => {
      return count + (selectedAnswers[index] === question.correct ? 1 : 0)
    }, 0)

    const score = Math.round((correctAnswers / totalQuestions) * 100)
    const passed = score >= 70

    const result: AssessmentResult = {
      calculationType: calculation.id,
      score,
      totalQuestions,
      correctAnswers,
      passed,
      completedAt: new Date(),
    }

    onAssessmentComplete(result)
  }

  const handleRestartAssessment = () => {
    setCurrentQuestion(0)
    setSelectedAnswers({})
    setShowResults(false)
    setTimeLeft(1800)
    setIsActive(true)
  }

  if (showResults) {
    const correctAnswers = assessmentQuestions.reduce((count, question, index) => {
      return count + (selectedAnswers[index] === question.correct ? 1 : 0)
    }, 0)
    const score = Math.round((correctAnswers / totalQuestions) * 100)
    const passed = score >= 70

    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-teal-50/30">
        <header className="bg-white shadow-sm border-b border-gray-200/50 backdrop-blur-sm">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Button variant="ghost" onClick={onBack} size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Voltar
                </Button>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">Resultado da Avaliação</h1>
                  <p className="text-sm text-gray-600">{calculation.title}</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="space-y-6">
            {/* Results Summary */}
            <Card className={`${passed ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"}`}>
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  {passed ? (
                    <CheckCircle className="w-12 h-12 text-green-600" />
                  ) : (
                    <XCircle className="w-12 h-12 text-red-600" />
                  )}
                  <div>
                    <h2 className={`text-2xl font-bold ${passed ? "text-green-800" : "text-red-800"}`}>
                      {passed ? "Parabéns! Você foi aprovado!" : "Não foi desta vez..."}
                    </h2>
                    <p className={`text-lg ${passed ? "text-green-700" : "text-red-700"}`}>
                      Sua pontuação: {score}% ({correctAnswers}/{totalQuestions} questões corretas)
                    </p>
                    <p className={`text-sm ${passed ? "text-green-600" : "text-red-600"}`}>
                      {passed ? "Nota mínima para aprovação: 70%" : "Você precisa de pelo menos 70% para ser aprovado"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Question Review */}
            <Card>
              <CardHeader>
                <CardTitle>Revisão das Questões</CardTitle>
                <CardDescription>Veja suas respostas e as explicações corretas</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {assessmentQuestions.map((question, index) => {
                  const userAnswer = selectedAnswers[index]
                  const isCorrect = userAnswer === question.correct
                  const wasAnswered = userAnswer !== undefined

                  return (
                    <div key={question.id} className="border rounded-lg p-4">
                      <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0">
                          {isCorrect ? (
                            <CheckCircle className="w-6 h-6 text-green-600" />
                          ) : wasAnswered ? (
                            <XCircle className="w-6 h-6 text-red-600" />
                          ) : (
                            <div className="w-6 h-6 rounded-full bg-gray-300" />
                          )}
                        </div>
                        <div className="flex-1 space-y-3">
                          <div>
                            <Badge variant="outline" className="mb-2">
                              Questão {index + 1}
                            </Badge>
                            <div className="font-medium text-gray-900">
                              <MathRenderer formula={question.question} />
                            </div>
                          </div>

                          <div className="space-y-2">
                            {question.options.map((option, optionIndex) => {
                              const isUserAnswer = userAnswer === optionIndex
                              const isCorrectAnswer = optionIndex === question.correct

                              return (
                                <div
                                  key={optionIndex}
                                  className={`p-3 rounded-lg border ${
                                    isCorrectAnswer
                                      ? "bg-green-50 border-green-200"
                                      : isUserAnswer
                                        ? "bg-red-50 border-red-200"
                                        : "bg-gray-50 border-gray-200"
                                  }`}
                                >
                                  <div className="flex items-center space-x-2">
                                    <span className="font-medium text-sm">
                                      {String.fromCharCode(65 + optionIndex)})
                                    </span>
                                    <div className="flex-1">
                                      <MathRenderer formula={option} />
                                    </div>
                                    {isCorrectAnswer && <CheckCircle className="w-4 h-4 text-green-600" />}
                                    {isUserAnswer && !isCorrectAnswer && <XCircle className="w-4 h-4 text-red-600" />}
                                  </div>
                                </div>
                              )
                            })}
                          </div>

                          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                            <h4 className="font-medium text-blue-800 mb-2">Explicação:</h4>
                            <div className="text-blue-700 text-sm">
                              <MathRenderer formula={question.explanation} />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex space-x-4">
              <Button onClick={handleRestartAssessment} className="bg-novaes-teal hover:bg-novaes-teal-dark">
                <RotateCcw className="w-4 h-4 mr-2" />
                Tentar Novamente
              </Button>
              <Button variant="outline" onClick={onBack}>
                Voltar ao Dashboard
              </Button>
            </div>
          </div>
        </main>
      </div>
    )
  }

  const currentQ = assessmentQuestions[currentQuestion]
  const progress = ((currentQuestion + 1) / totalQuestions) * 100

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-teal-50/30">
      <header className="bg-white shadow-sm border-b border-gray-200/50 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" onClick={onBack} size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Voltar
              </Button>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Avaliação: {calculation.title}</h1>
                <p className="text-sm text-gray-600">
                  Questão {currentQuestion + 1} de {totalQuestions}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-orange-600">
                <Clock className="w-4 h-4" />
                <span className="font-mono text-sm">{formatTime(timeLeft)}</span>
              </div>
              <Badge variant="outline" className="text-novaes-teal border-novaes-teal">
                {Math.round(progress)}% completo
              </Badge>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {/* Progress Bar */}
          <Card>
            <CardContent className="p-4">
              <Progress value={progress} className="w-full" />
            </CardContent>
          </Card>

          {/* Question */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">
                  Questão {currentQuestion + 1}
                  <Badge variant="outline" className="ml-2 text-xs">
                    {currentQ?.difficulty === "easy" && "Fácil"}
                    {currentQ?.difficulty === "medium" && "Médio"}
                    {currentQ?.difficulty === "hard" && "Difícil"}
                  </Badge>
                </CardTitle>
                <Badge variant="secondary">{currentQ?.topic}</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-lg font-medium text-gray-900">
                <MathRenderer formula={currentQ?.question || ""} />
              </div>

              <RadioGroup
                value={selectedAnswers[currentQuestion]?.toString() || ""}
                onValueChange={(value) => handleAnswerSelect(currentQuestion, Number.parseInt(value))}
              >
                <div className="space-y-3">
                  {currentQ?.options.map((option, index) => (
                    <div key={index} className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-gray-50">
                      <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                      <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer">
                        <div className="flex items-center space-x-2">
                          <span className="font-medium">{String.fromCharCode(65 + index)})</span>
                          <div className="flex-1">
                            <MathRenderer formula={option} />
                          </div>
                        </div>
                      </Label>
                    </div>
                  ))}
                </div>
              </RadioGroup>
            </CardContent>
          </Card>

          {/* Navigation */}
          <div className="flex items-center justify-between">
            <Button variant="outline" onClick={handlePreviousQuestion} disabled={currentQuestion === 0}>
              Anterior
            </Button>

            <div className="flex space-x-2">
              {assessmentQuestions.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentQuestion(index)}
                  className={`w-8 h-8 rounded-full text-xs font-medium ${
                    index === currentQuestion
                      ? "bg-novaes-teal text-white"
                      : selectedAnswers[index] !== undefined
                        ? "bg-green-100 text-green-800 border border-green-300"
                        : "bg-gray-100 text-gray-600 border border-gray-300"
                  }`}
                >
                  {index + 1}
                </button>
              ))}
            </div>

            {currentQuestion === totalQuestions - 1 ? (
              <Button
                onClick={handleFinishAssessment}
                className="bg-green-600 hover:bg-green-700"
                disabled={Object.keys(selectedAnswers).length === 0}
              >
                <Award className="w-4 h-4 mr-2" />
                Finalizar Avaliação
              </Button>
            ) : (
              <Button onClick={handleNextQuestion} disabled={currentQuestion === totalQuestions - 1}>
                Próxima
              </Button>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
