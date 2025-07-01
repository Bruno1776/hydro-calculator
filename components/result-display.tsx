"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calculator, FileDown, Home, RotateCcw } from "lucide-react"
import CalculationSteps from "@/components/calculation-steps"
import type { CalculationHistory, CalculationStep } from "@/types/calculation"

interface ResultDisplayProps {
  calculationTitle: string
  inputs: Record<string, any>
  result: Record<string, any>
  steps?: CalculationStep[]
  onNewCalculation: () => void
  onBackToDashboard: () => void
  onAddToHistory: (calculation: CalculationHistory) => void
}

export default function ResultDisplay({
  calculationTitle,
  inputs,
  result,
  steps,
  onNewCalculation,
  onBackToDashboard,
  onAddToHistory,
}: ResultDisplayProps) {
  const handleSaveToHistory = () => {
    const historyItem: CalculationHistory = {
      id: Date.now().toString(),
      calculationType: calculationTitle.toLowerCase().replace(/\s+/g, "-"),
      calculationTitle,
      inputs,
      results: result,
      timestamp: new Date(),
      steps,
    }

    onAddToHistory(historyItem)
  }

  const handleNewCalculation = () => {
    handleSaveToHistory()
    onNewCalculation()
  }

  const handleBackToDashboard = () => {
    handleSaveToHistory()
    onBackToDashboard()
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-r from-green-50 to-teal-50 border-green-200">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center space-x-2 mb-2">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <Calculator className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <CardTitle className="text-2xl text-green-800">Cálculo Concluído!</CardTitle>
          <CardDescription className="text-green-700">Seus resultados foram calculados com sucesso</CardDescription>
        </CardHeader>
      </Card>

      {/* Results */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl text-novaes-teal">Resultados</CardTitle>
          <CardDescription>Valores calculados para {calculationTitle}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(result).map(([key, value]) => (
              <div key={key} className="p-4 bg-gray-50 rounded-lg">
                <div className="text-sm text-gray-600 mb-1">{key}</div>
                <div className="text-lg font-semibold text-novaes-teal">{value}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Steps */}
      {steps && steps.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-xl text-novaes-teal">Passo a Passo</CardTitle>
            <CardDescription>Desenvolvimento detalhado do cálculo</CardDescription>
          </CardHeader>
          <CardContent>
            <CalculationSteps steps={steps} />
          </CardContent>
        </Card>
      )}

      {/* Input Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl text-novaes-teal">Parâmetros Utilizados</CardTitle>
          <CardDescription>Valores de entrada fornecidos</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(inputs).map(([key, value]) => (
              <div key={key} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="text-gray-700">{key}:</span>
                <Badge variant="outline" className="font-mono">
                  {value}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Button onClick={handleNewCalculation} className="flex-1 bg-novaes-teal hover:bg-novaes-teal-dark">
          <RotateCcw className="w-4 h-4 mr-2" />
          Novo Cálculo
        </Button>
        <Button variant="outline" onClick={handleBackToDashboard} className="flex-1 bg-transparent">
          <Home className="w-4 h-4 mr-2" />
          Voltar ao Dashboard
        </Button>
        <Button variant="outline" className="flex-1 border-red-300 text-red-600 hover:bg-red-50 bg-transparent">
          <FileDown className="w-4 h-4 mr-2" />
          Exportar PDF
        </Button>
      </div>
    </div>
  )
}
