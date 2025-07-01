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
import { Input } from "@/components/ui/input"
import type { CalculationHistory, CalculationStep } from "@/types/calculation"
import { convertUnit } from "@/types/calculation"

const fittingTypes = {
  "elbow-90": { name: "Cotovelo 90°", k: 0.9 },
  "elbow-45": { name: "Cotovelo 45°", k: 0.4 },
  "gate-valve": { name: "Válvula Gaveta (Aberta)", k: 0.2 },
  "ball-valve": { name: "Válvula Esfera (Aberta)", k: 0.05 },
  "tee-through": { name: "Tê (Passagem)", k: 0.6 },
  "tee-branch": { name: "Tê (Derivação)", k: 1.8 },
  "sudden-expansion": { name: "Expansão Súbita", k: 1.0 },
  "sudden-contraction": { name: "Contração Súbita", k: 0.5 },
}

interface HeadLossCalculatorProps {
  onAddToHistory: (calculation: CalculationHistory) => void
}

export default function HeadLossCalculator({ onAddToHistory }: HeadLossCalculatorProps) {
  const [velocity, setVelocity] = useState("")
  const [velocityUnit, setVelocityUnit] = useState("m/s")
  const [fittingType, setFittingType] = useState("")
  const [customK, setCustomK] = useState("")
  const [result, setResult] = useState<number | null>(null)
  const [resultUnit, setResultUnit] = useState("m")
  const [steps, setSteps] = useState<CalculationStep[]>([])

  // Converter states
  const [converterValue, setConverterValue] = useState("")
  const [converterFromUnit, setConverterFromUnit] = useState("m")
  const [converterToUnit, setConverterToUnit] = useState("ft")
  const [converterType, setConverterType] = useState<"velocity" | "length">("length")

  const calculateHeadLoss = () => {
    const inputVelocity = Number.parseFloat(velocity)
    let k = 0

    if (fittingType && fittingTypes[fittingType as keyof typeof fittingTypes]) {
      k = fittingTypes[fittingType as keyof typeof fittingTypes].k
    } else if (customK) {
      k = Number.parseFloat(customK)
    }

    if (inputVelocity > 0 && k >= 0) {
      // Convert velocity to m/s for calculation
      const velocityInMS = convertUnit(inputVelocity, velocityUnit, "m/s", "velocity")

      const headLoss = (k * (velocityInMS * velocityInMS)) / (2 * 9.81)

      // Convert result to desired unit
      const resultInDesiredUnit = convertUnit(headLoss, "m", resultUnit, "length")
      setResult(resultInDesiredUnit)

      // Generate calculation steps
      const calculationSteps: CalculationStep[] = [
        {
          step: 1,
          description: "Identificar os valores conhecidos",
          formula: "h_L = K \\times \\frac{V^2}{2g}",
          calculation: `V = ${inputVelocity} \\text{ ${velocityUnit}} = ${velocityInMS.toFixed(3)} \\text{ m/s}, K = ${k}, g = 9.81 \\text{ m/s}^2`,
          result: "Valores identificados e convertidos",
        },
        {
          step: 2,
          description: "Calcular V² em m²/s²",
          formula: "V^2 = V \\times V",
          calculation: `${velocityInMS.toFixed(3)}^2 = ${velocityInMS.toFixed(3)} \\times ${velocityInMS.toFixed(3)} = ${(velocityInMS * velocityInMS).toFixed(4)} \\text{ m}^2\\text{/s}^2`,
          result: `${(velocityInMS * velocityInMS).toFixed(4)} m²/s²`,
        },
        {
          step: 3,
          description: "Calcular V²/(2g)",
          formula: "\\frac{V^2}{2g} = \\frac{V^2}{2 \\times 9.81}",
          calculation: `\\frac{${(velocityInMS * velocityInMS).toFixed(4)}}{2 \\times 9.81} = \\frac{${(velocityInMS * velocityInMS).toFixed(4)}}{19.62} = ${((velocityInMS * velocityInMS) / 19.62).toFixed(4)} \\text{ m}`,
          result: `${((velocityInMS * velocityInMS) / 19.62).toFixed(4)} m`,
        },
        {
          step: 4,
          description: "Calcular a perda de carga localizada",
          formula: "h_L = K \\times \\frac{V^2}{2g}",
          calculation: `h_L = ${k} \\times ${((velocityInMS * velocityInMS) / 19.62).toFixed(4)} = ${headLoss.toFixed(4)} \\text{ m} = ${resultInDesiredUnit.toFixed(4)} \\text{ ${resultUnit}}`,
          result: `${resultInDesiredUnit.toFixed(4)} ${resultUnit}`,
        },
      ]

      setSteps(calculationSteps)

      // Add to history
      const historyEntry: CalculationHistory = {
        id: Date.now().toString(),
        calculationType: "head-loss",
        calculationTitle: "Perda de Carga Localizada",
        inputs: {
          Velocidade: `${inputVelocity} ${velocityUnit}`,
          "Coeficiente K": k,
          "Tipo de Conexão": fittingType
            ? fittingTypes[fittingType as keyof typeof fittingTypes].name
            : "Personalizado",
        },
        results: {
          "Perda de Carga": `${resultInDesiredUnit.toFixed(4)} ${resultUnit}`,
        },
        timestamp: new Date(),
        steps: calculationSteps,
      }

      onAddToHistory(historyEntry)
    }
  }

  const reset = () => {
    setVelocity("")
    setFittingType("")
    setCustomK("")
    setResult(null)
    setSteps([])
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
      setConverterType("length")
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
                <Label htmlFor="fitting">Tipo de Conexão</Label>
                <Select value={fittingType} onValueChange={setFittingType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo de conexão" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(fittingTypes).map(([key, fitting]) => (
                      <SelectItem key={key} value={key}>
                        {fitting.name} (K = {fitting.k})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="custom-k">Valor K Personalizado (opcional)</Label>
                <Input
                  id="custom-k"
                  type="number"
                  step="0.01"
                  value={customK}
                  onChange={(e) => setCustomK(e.target.value)}
                  placeholder="Digite o valor K personalizado"
                />
              </div>

              <div>
                <Label>Unidade do Resultado</Label>
                <Select value={resultUnit} onValueChange={setResultUnit}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="m">metros (m)</SelectItem>
                    <SelectItem value="ft">pés (ft)</SelectItem>
                    <SelectItem value="mm">milímetros (mm)</SelectItem>
                    <SelectItem value="cm">centímetros (cm)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                <Button onClick={calculateHeadLoss} className="flex-1">
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
                  description="Perda de Carga Localizada"
                  onTransferToConverter={transferResultToConverter}
                />
              )}

              <Alert>
                <AlertDescription>
                  <strong>Fórmula:</strong> h_L = K × (V²/2g)
                  <br />
                  Onde g = 9,81 m/s²
                </AlertDescription>
              </Alert>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="units" className="space-y-4">
          <div className="space-y-4">
            <div>
              <Label>Tipo de Conversão</Label>
              <Select value={converterType} onValueChange={(value: "velocity" | "length") => setConverterType(value)}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="velocity">Velocidade</SelectItem>
                  <SelectItem value="length">Comprimento</SelectItem>
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
              label={`Conversão de ${converterType === "velocity" ? "Velocidade" : "Comprimento"}`}
            />
          </div>
        </TabsContent>

        <TabsContent value="steps">
          {steps.length > 0 ? (
            <CalculationSteps steps={steps} title="Progressão do Cálculo de Perda de Carga Localizada" />
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
