"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, BookOpen } from "lucide-react"
import Image from "next/image"
import type { CalculationType } from "@/app/page"
import type { CalculationHistory } from "@/types/calculation"
import HeadLossCalculator from "@/components/calculators/head-loss-calculator"
import PipeFlowCalculator from "@/components/calculators/pipe-flow-calculator"
import PressureDropCalculator from "@/components/calculators/pressure-drop-calculator"
import PumpPowerCalculator from "@/components/calculators/pump-power-calculator"
import FlowVelocityCalculator from "@/components/calculators/flow-velocity-calculator"
import ReynoldsNumberCalculator from "@/components/calculators/reynolds-number-calculator"

interface CalculationViewProps {
  calculation: CalculationType
  onBack: () => void
  onToggleMode: () => void
  isLearningMode: boolean
  onAddToHistory: (calculation: CalculationHistory) => void
}

export default function CalculationView({
  calculation,
  onBack,
  onToggleMode,
  isLearningMode,
  onAddToHistory,
}: CalculationViewProps) {
  const renderCalculator = () => {
    const commonProps = { onAddToHistory }

    switch (calculation.id) {
      case "head-loss":
        return <HeadLossCalculator {...commonProps} />
      case "pipe-flow":
        return <PipeFlowCalculator {...commonProps} />
      case "pressure-drop":
        return <PressureDropCalculator {...commonProps} />
      case "pump-power":
        return <PumpPowerCalculator {...commonProps} />
      case "flow-velocity":
        return <FlowVelocityCalculator {...commonProps} />
      case "reynolds-number":
        return <ReynoldsNumberCalculator {...commonProps} />
      default:
        return <div>Calculadora não implementada ainda</div>
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-teal-50/30">
      <header className="bg-white shadow-sm border-b border-gray-200/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                onClick={onBack}
                size="sm"
                className="hover:bg-novaes-teal/10 hover:text-novaes-teal"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">Voltar ao Dashboard</span>
                <span className="sm:hidden">Voltar</span>
              </Button>
              <div className="flex items-center space-x-3">
                <span className="text-xl sm:text-2xl">{calculation.icon}</span>
                <div>
                  <h1 className="text-lg sm:text-2xl font-bold text-gray-900">{calculation.title}</h1>
                  <p className="text-novaes-gray text-sm sm:text-base hidden sm:block">{calculation.description}</p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Image
                src="/images/logo-star.png"
                alt="Grupo Novaes"
                width={32}
                height={32}
                className="w-6 h-6 sm:w-8 sm:h-8 opacity-60"
              />
              <Button
                variant="outline"
                onClick={onToggleMode}
                size="sm"
                className="border-novaes-teal text-novaes-teal hover:bg-novaes-teal hover:text-white bg-transparent"
              >
                <BookOpen className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">Modo Aprendizado</span>
                <span className="sm:hidden">Aprender</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <Card className="bg-white/80 backdrop-blur-sm border-gray-200">
          <CardHeader className="bg-novaes-gradient-subtle">
            <CardTitle className="text-lg sm:text-xl text-novaes-teal">Ferramenta de Cálculo</CardTitle>
            <CardDescription className="text-sm sm:text-base text-novaes-gray">
              Insira seus parâmetros abaixo para realizar o cálculo
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">{renderCalculator()}</CardContent>
        </Card>
      </main>
    </div>
  )
}
