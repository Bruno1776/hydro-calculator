"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import UnitConverter from "@/components/unit-converter"
import CalculationSteps from "@/components/calculation-steps"
import type { CalculationHistory, CalculationStep } from "@/types/calculation"

interface FlowVelocityCalculatorProps {
  onAddToHistory: (calculation: CalculationHistory) => void
}

export default function FlowVelocityCalculator({ onAddToHistory }: FlowVelocityCalculatorProps) {
  const [flowRate, setFlowRate] = useState("")
  const [flowFromUnit, setFlowFromUnit] = useState("L/s")
  const [flowToUnit, setFlowToUnit] = useState("gpm")
  const [diameter, setDiameter] = useState("")
  const [diameterFromUnit, setDiameterFromUnit] = useState("mm")
  const [diameterToUnit, setDiameterToUnit] = useState("in")
  const [result, setResult] = useState<number | null>(null)
  const [velocityFromUnit, setVelocityFromUnit] = useState("m/s")
  const [velocityToUnit, setVelocityToUnit] = useState("ft/s")
  const [steps, setSteps] = useState<CalculationStep[]>([])

  const calculateVelocity = () => {
    const Q = Number.parseFloat(flowRate) / 1000 // Convert L/s to m³/s
    const D = Number.parseFloat(diameter) / 1000 // Convert mm to m

    if (Q > 0 && D > 0) {
      const area = (Math.PI * (D * D)) / 4
      const velocity = Q / area
      setResult(velocity)

      // Generate calculation steps
      const calculationSteps: CalculationStep[] = [
        {
          step: 1,
          description: "Identificar os valores conhecidos",
          formula: "V = \\frac{Q}{A}",
          calculation: `Q = ${flowRate}\\text{ L/s} = ${Q.toFixed(6)}\\text{ m}^3\\text{/s}, \\quad D = ${diameter}\\text{ mm} = ${D.toFixed(4)}\\text{ m}`,
          result: "Valores identificados",
        },
        {
          step: 2,
          description: "Calcular a área da seção transversal",
          formula: "A = \\frac{\\pi D^2}{4}",
          calculation: `A = \\frac{\\pi \\times (${D.toFixed(4)})^2}{4} = \\frac{\\pi \\times ${(D * D).toFixed(6)}}{4} = ${area.toFixed(6)}\\text{ m}^2`,
          result: `${area.toFixed(6)} m²`,
        },
        {
          step: 3,
          description: "Calcular a velocidade do fluxo",
          formula: "V = \\frac{Q}{A}",
          calculation: `V = \\frac{${Q.toFixed(6)}}{${area.toFixed(6)}} = ${velocity.toFixed(3)}\\text{ m/s}`,
          result: `${velocity.toFixed(3)} m/s`,
        },
      ]

      setSteps(calculationSteps)

      // Add to history
      const historyEntry: CalculationHistory = {
        id: Date.now().toString(),
        calculationType: "flow-velocity",
        calculationTitle: "Velocidade do Fluxo",
        inputs: {
          Vazão: `${flowRate} ${flowFromUnit}`,
          Diâmetro: `${diameter} ${diameterFromUnit}`,
        },
        results: {
          Velocidade: `${velocity.toFixed(3)} m/s`,
        },
        timestamp: new Date(),
        steps: calculationSteps,
      }

      onAddToHistory(historyEntry)
    }
  }

  const reset = () => {
    setFlowRate("")
    setDiameter("")
    setResult(null)
    setSteps([])
  }

  const getVelocityClassification = (velocity: number) => {
    if (velocity < 0.5) return { text: "Velocidade baixa - Boa para sistemas por gravidade", color: "text-green-600" }
    if (velocity < 1.5) return { text: "Velocidade moderada - Típica para sistemas de água", color: "text-blue-600" }
    if (velocity < 3.0) return { text: "Velocidade alta - Verificar ruído/erosão", color: "text-orange-600" }
    return { text: "Velocidade muito alta - Pode causar problemas", color: "text-red-600" }
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
              <div>
                <Label htmlFor="flow-rate">Vazão (L/s)</Label>
                <Input
                  id="flow-rate"
                  type="number"
                  step="0.1"
                  value={flowRate}
                  onChange={(e) => setFlowRate(e.target.value)}
                  placeholder="Digite a vazão"
                />
              </div>

              <div>
                <Label htmlFor="diameter">Diâmetro da Tubulação (mm)</Label>
                <Input
                  id="diameter"
                  type="number"
                  value={diameter}
                  onChange={(e) => setDiameter(e.target.value)}
                  placeholder="Digite o diâmetro"
                />
              </div>

              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                <Button onClick={calculateVelocity} className="flex-1">
                  Calcular
                </Button>
                <Button variant="outline" onClick={reset} className="flex-1 bg-transparent">
                  Limpar
                </Button>
              </div>
            </div>

            <div className="space-y-4">
              {result !== null && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Resultado do Cálculo</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-blue-600">{result.toFixed(3)} m/s</div>
                    <p className="text-gray-600">Velocidade do Fluxo</p>

                    <div className="mt-4 space-y-2">
                      <div className="text-sm">
                        <span className="font-medium">Classificação da Velocidade:</span>
                        <div className="mt-1">
                          <span className={getVelocityClassification(result).color}>
                            {getVelocityClassification(result).text}
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              <Alert>
                <AlertDescription>
                  <strong>Fórmula:</strong> V = Q / A
                  <br />
                  Onde A = π × D²/4
                  <br />
                  Velocidades recomendadas: 0,5-2,0 m/s para sistemas de água
                </AlertDescription>
              </Alert>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="units" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
            <UnitConverter
              unitType="flowRate"
              value={flowRate}
              onValueChange={setFlowRate}
              fromUnit={flowFromUnit}
              onFromUnitChange={setFlowFromUnit}
              toUnit={flowToUnit}
              onToUnitChange={setFlowToUnit}
              label="Conversão de Vazão"
            />

            <UnitConverter
              unitType="length"
              value={diameter}
              onValueChange={setDiameter}
              fromUnit={diameterFromUnit}
              onFromUnitChange={setDiameterFromUnit}
              toUnit={diameterToUnit}
              onToUnitChange={setDiameterToUnit}
              label="Conversão de Diâmetro"
            />

            {result !== null && (
              <UnitConverter
                unitType="velocity"
                value={result.toString()}
                onValueChange={() => {}}
                fromUnit={velocityFromUnit}
                onFromUnitChange={setVelocityFromUnit}
                toUnit={velocityToUnit}
                onToUnitChange={setVelocityToUnit}
                label="Conversão de Velocidade"
              />
            )}
          </div>
        </TabsContent>

        <TabsContent value="steps">
          {steps.length > 0 ? (
            <CalculationSteps steps={steps} title="Progressão do Cálculo de Velocidade do Fluxo" />
          ) : (
            <Card>
              <CardContent className="flex items-center justify-center py-12">
                <p className="text-gray-500">Realize um cálculo para ver os passos detalhados</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
