"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import UnitConverter from "@/components/unit-converter"
import CalculationSteps from "@/components/calculation-steps"
import UnitInput from "@/components/unit-input"
import ResultDisplay from "@/components/result-display"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import type { CalculationHistory, CalculationStep } from "@/types/calculation"
import { convertUnit } from "@/types/calculation"

interface PipeFlowCalculatorProps {
  onAddToHistory: (calculation: CalculationHistory) => void
}

export default function PipeFlowCalculator({ onAddToHistory }: PipeFlowCalculatorProps) {
  const [diameter, setDiameter] = useState("")
  const [diameterUnit, setDiameterUnit] = useState("mm")
  const [velocity, setVelocity] = useState("")
  const [velocityUnit, setVelocityUnit] = useState("m/s")
  const [result, setResult] = useState<number | null>(null)
  const [resultUnit, setResultUnit] = useState("L/s")
  const [steps, setSteps] = useState<CalculationStep[]>([])

  // Converter states
  const [converterValue, setConverterValue] = useState("")
  const [converterFromUnit, setConverterFromUnit] = useState("L/s")
  const [converterToUnit, setConverterToUnit] = useState("gpm")
  const [converterType, setConverterType] = useState<"length" | "velocity" | "flowRate">("flowRate")

  const calculateFlow = () => {
    const inputDiameter = Number.parseFloat(diameter)
    const inputVelocity = Number.parseFloat(velocity)

    if (inputDiameter > 0 && inputVelocity > 0) {
      // Convert inputs to standard units (m, m/s)
      const diameterInM = convertUnit(inputDiameter, diameterUnit, "m", "length")
      const velocityInMS = convertUnit(inputVelocity, velocityUnit, "m/s", "velocity")

      const area = (Math.PI * (diameterInM * diameterInM)) / 4
      const flowRateInM3S = area * velocityInMS

      // Convert result to desired unit
      const resultInDesiredUnit = convertUnit(flowRateInM3S, "m³/s", resultUnit, "flowRate")
      setResult(resultInDesiredUnit)

      // Generate calculation steps
      const calculationSteps: CalculationStep[] = [
        {
          step: 1,
          description: "Identificar os valores conhecidos",
          formula: "Q = A \\times V",
          calculation: `D = ${inputDiameter} \\text{ ${diameterUnit}} = ${diameterInM.toFixed(4)} \\text{ m}, V = ${inputVelocity} \\text{ ${velocityUnit}} = ${velocityInMS.toFixed(3)} \\text{ m/s}`,
          result: "Valores identificados e convertidos",
        },
        {
          step: 2,
          description: "Calcular a área da seção transversal",
          formula: "A = \\frac{\\pi D^2}{4}",
          calculation: `A = \\frac{\\pi \\times (${diameterInM.toFixed(4)})^2}{4} = \\frac{\\pi \\times ${(diameterInM * diameterInM).toFixed(6)}}{4} = ${area.toFixed(6)} \\text{ m}^2`,
          result: `${area.toFixed(6)} m²`,
        },
        {
          step: 3,
          description: "Calcular a vazão em m³/s",
          formula: "Q = A \\times V",
          calculation: `Q = ${area.toFixed(6)} \\times ${velocityInMS.toFixed(3)} = ${flowRateInM3S.toFixed(6)} \\text{ m}^3\\text{/s}`,
          result: `${flowRateInM3S.toFixed(6)} m³/s`,
        },
        {
          step: 4,
          description: `Converter para ${resultUnit}`,
          formula: `Q_{${resultUnit}} = Q_{m^3/s} \\times fator`,
          calculation: `Q = ${flowRateInM3S.toFixed(6)} \\text{ m}^3\\text{/s} = ${resultInDesiredUnit.toFixed(4)} \\text{ ${resultUnit}}`,
          result: `${resultInDesiredUnit.toFixed(4)} ${resultUnit}`,
        },
      ]

      setSteps(calculationSteps)

      // Add to history
      const historyEntry: CalculationHistory = {
        id: Date.now().toString(),
        calculationType: "pipe-flow",
        calculationTitle: "Vazão em Tubulações",
        inputs: {
          Diâmetro: `${inputDiameter} ${diameterUnit}`,
          Velocidade: `${inputVelocity} ${velocityUnit}`,
        },
        results: {
          Vazão: `${resultInDesiredUnit.toFixed(4)} ${resultUnit}`,
        },
        timestamp: new Date(),
        steps: calculationSteps,
      }

      onAddToHistory(historyEntry)
    }
  }

  const reset = () => {
    setDiameter("")
    setVelocity("")
    setResult(null)
    setSteps([])
  }

  const transferDiameterToConverter = () => {
    setConverterValue(diameter)
    setConverterFromUnit(diameterUnit)
    setConverterType("length")
  }

  const transferVelocityToConverter = () => {
    setConverterValue(velocity)
    setConverterFromUnit(velocityUnit)
    setConverterType("velocity")
  }

  const transferResultToConverter = () => {
    if (result !== null) {
      setConverterValue(result.toString())
      setConverterFromUnit(resultUnit)
      setConverterType("flowRate")
    }
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue="calculator" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="calculator">Calculadora</TabsTrigger>
          <TabsTrigger value="units">Conversões</TabsTrigger>
          <TabsTrigger value="steps">Passos</TabsTrigger>
        </TabsList>

        <TabsContent value="calculator" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <UnitInput
                label="Diâmetro da Tubulação"
                value={diameter}
                onValueChange={setDiameter}
                unit={diameterUnit}
                onUnitChange={setDiameterUnit}
                unitType="length"
                placeholder="Digite o diâmetro"
                onTransferToConverter={transferDiameterToConverter}
                showTransferButton={!!diameter}
              />

              <UnitInput
                label="Velocidade do Fluxo"
                value={velocity}
                onValueChange={setVelocity}
                unit={velocityUnit}
                onUnitChange={setVelocityUnit}
                unitType="velocity"
                placeholder="Digite a velocidade"
                onTransferToConverter={transferVelocityToConverter}
                showTransferButton={!!velocity}
              />

              <div>
                <Label>Unidade do Resultado</Label>
                <Select value={resultUnit} onValueChange={setResultUnit}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="L/s">L/s</SelectItem>
                    <SelectItem value="m³/h">m³/h</SelectItem>
                    <SelectItem value="m³/s">m³/s</SelectItem>
                    <SelectItem value="gpm">gpm</SelectItem>
                    <SelectItem value="cfm">cfm</SelectItem>
                    <SelectItem value="L/min">L/min</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                <Button onClick={calculateFlow} className="flex-1">
                  Calcular
                </Button>
                <Button variant="outline" onClick={reset} className="flex-1 bg-transparent">
                  Limpar
                </Button>
              </div>
            </div>

            <div className="space-y-4">
              {result !== null && (
                <ResultDisplay
                  title="Resultado do Cálculo"
                  value={result}
                  unit={resultUnit}
                  description="Vazão"
                  onTransferToConverter={transferResultToConverter}
                  additionalInfo={
                    resultUnit === "L/s"
                      ? `${(result * 3.6).toFixed(2)} m³/h`
                      : resultUnit === "m³/h"
                        ? `${(result / 3.6).toFixed(2)} L/s`
                        : undefined
                  }
                />
              )}

              <Alert>
                <AlertDescription>
                  <strong>Fórmula:</strong> Q = A × V
                  <br />
                  Onde A = π × D²/4
                </AlertDescription>
              </Alert>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="units" className="space-y-4">
          <div className="space-y-4">
            <div>
              <Label>Tipo de Conversão</Label>
              <Select
                value={converterType}
                onValueChange={(value: "length" | "velocity" | "flowRate") => setConverterType(value)}
              >
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="length">Comprimento</SelectItem>
                  <SelectItem value="velocity">Velocidade</SelectItem>
                  <SelectItem value="flowRate">Vazão</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <UnitConverter
              unitType={converterType}
              value={converterValue}
              onValueChange={setConverterValue}
              fromUnit={converterFromUnit}
              onFromUnitChange={setConverterFromUnit}
              toUnit={converterToUnit}
              onToUnitChange={setConverterToUnit}
              label={`Conversão de ${
                converterType === "length" ? "Comprimento" : converterType === "velocity" ? "Velocidade" : "Vazão"
              }`}
            />
          </div>
        </TabsContent>

        <TabsContent value="steps">
          {steps.length > 0 ? (
            <CalculationSteps steps={steps} title="Progressão do Cálculo de Vazão em Tubulações" />
          ) : (
            <div className="text-center py-12 text-gray-500">
              <p>Realize um cálculo para ver os passos detalhados</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
