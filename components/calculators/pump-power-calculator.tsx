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

interface PumpPowerCalculatorProps {
  onAddToHistory: (calculation: CalculationHistory) => void
}

export default function PumpPowerCalculator({ onAddToHistory }: PumpPowerCalculatorProps) {
  const [flowRate, setFlowRate] = useState("")
  const [flowFromUnit, setFlowFromUnit] = useState("L/s")
  const [flowToUnit, setFlowToUnit] = useState("gpm")
  const [head, setHead] = useState("")
  const [headFromUnit, setHeadFromUnit] = useState("m")
  const [headToUnit, setHeadToUnit] = useState("ft")
  const [efficiency, setEfficiency] = useState("75")
  const [result, setResult] = useState<{ hydraulic: number; shaft: number } | null>(null)
  const [powerFromUnit, setPowerFromUnit] = useState("kW")
  const [powerToUnit, setPowerToUnit] = useState("HP")
  const [steps, setSteps] = useState<CalculationStep[]>([])

  const calculatePower = () => {
    const Q = Number.parseFloat(flowRate) / 1000 // Convert L/s to m³/s
    const H = Number.parseFloat(head)
    const eta = Number.parseFloat(efficiency) / 100

    if (Q > 0 && H > 0 && eta > 0) {
      const rho = 1000 // Water density kg/m³
      const g = 9.81 // Gravity m/s²

      const hydraulicPower = (rho * g * Q * H) / 1000 // kW
      const shaftPower = hydraulicPower / eta // kW

      setResult({ hydraulic: hydraulicPower, shaft: shaftPower })

      // Generate calculation steps
      const calculationSteps: CalculationStep[] = [
        {
          step: 1,
          description: "Identificar os valores conhecidos",
          formula:
            "P_{hidr} = \\frac{\\rho \\times g \\times Q \\times H}{1000}, \\quad P_{eixo} = \\frac{P_{hidr}}{\\eta}",
          calculation: `Q = ${flowRate}\\text{ L/s} = ${Q.toFixed(6)}\\text{ m}^3\\text{/s}, \\quad H = ${H}\\text{ m}, \\quad \\eta = ${efficiency}\\% = ${eta.toFixed(2)}, \\quad \\rho = 1000\\text{ kg/m}^3, \\quad g = 9.81\\text{ m/s}^2`,
          result: "Valores identificados",
        },
        {
          step: 2,
          description: "Calcular a potência hidráulica",
          formula: "P_{hidr} = \\frac{\\rho \\times g \\times Q \\times H}{1000}",
          calculation: `P_{hidr} = \\frac{1000 \\times 9.81 \\times ${Q.toFixed(6)} \\times ${H}}{1000} = \\frac{${(rho * g * Q * H).toFixed(2)}}{1000} = ${hydraulicPower.toFixed(3)}\\text{ kW}`,
          result: `${hydraulicPower.toFixed(3)} kW`,
        },
        {
          step: 3,
          description: "Calcular a potência no eixo",
          formula: "P_{eixo} = \\frac{P_{hidr}}{\\eta}",
          calculation: `P_{eixo} = \\frac{${hydraulicPower.toFixed(3)}}{${eta.toFixed(2)}} = ${shaftPower.toFixed(3)}\\text{ kW}`,
          result: `${shaftPower.toFixed(3)} kW`,
        },
        {
          step: 4,
          description: "Converter para HP (opcional)",
          formula: "P_{HP} = P_{kW} \\times 1.341",
          calculation: `P_{HP} = ${shaftPower.toFixed(3)} \\times 1.341 = ${(shaftPower * 1.341).toFixed(3)}\\text{ HP}`,
          result: `${(shaftPower * 1.341).toFixed(3)} HP`,
        },
      ]

      setSteps(calculationSteps)

      // Add to history
      const historyEntry: CalculationHistory = {
        id: Date.now().toString(),
        calculationType: "pump-power",
        calculationTitle: "Potência da Bomba",
        inputs: {
          Vazão: `${flowRate} ${flowFromUnit}`,
          "Altura Manométrica": `${H} ${headFromUnit}`,
          Eficiência: `${efficiency}%`,
        },
        results: {
          "Potência Hidráulica": `${hydraulicPower.toFixed(3)} kW`,
          "Potência no Eixo": `${shaftPower.toFixed(3)} kW`,
          "Potência no Eixo (HP)": `${(shaftPower * 1.341).toFixed(3)} HP`,
        },
        timestamp: new Date(),
        steps: calculationSteps,
      }

      onAddToHistory(historyEntry)
    }
  }

  const reset = () => {
    setFlowRate("")
    setHead("")
    setEfficiency("75")
    setResult(null)
    setSteps([])
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
                <Label htmlFor="head">Altura Manométrica Total (m)</Label>
                <Input
                  id="head"
                  type="number"
                  step="0.1"
                  value={head}
                  onChange={(e) => setHead(e.target.value)}
                  placeholder="Digite a altura manométrica"
                />
              </div>

              <div>
                <Label htmlFor="efficiency">Eficiência da Bomba (%)</Label>
                <Input
                  id="efficiency"
                  type="number"
                  step="1"
                  value={efficiency}
                  onChange={(e) => setEfficiency(e.target.value)}
                  placeholder="Digite a eficiência"
                />
              </div>

              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                <Button onClick={calculatePower} className="flex-1">
                  Calcular
                </Button>
                <Button variant="outline" onClick={reset} className="flex-1 bg-transparent">
                  Limpar
                </Button>
              </div>
            </div>

            <div className="space-y-4">
              {result !== null && (
                <div className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Potência Hidráulica</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-blue-600">{result.hydraulic.toFixed(3)} kW</div>
                      <p className="text-gray-600">Potência entregue ao fluido</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Potência no Eixo</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-red-600">{result.shaft.toFixed(3)} kW</div>
                      <p className="text-gray-600">Potência necessária do motor</p>
                      <div className="mt-2 text-sm text-gray-500">{(result.shaft * 1.341).toFixed(3)} HP</div>
                    </CardContent>
                  </Card>
                </div>
              )}

              <Alert>
                <AlertDescription>
                  <strong>Fórmula:</strong> P = ρ × g × Q × H / η
                  <br />
                  Eficiência típica de bombas: 60-85%
                </AlertDescription>
              </Alert>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="units" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-4">
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
              value={head}
              onValueChange={setHead}
              fromUnit={headFromUnit}
              onFromUnitChange={setHeadFromUnit}
              toUnit={headToUnit}
              onToUnitChange={setHeadToUnit}
              label="Conversão de Altura"
            />

            {result !== null && (
              <>
                <UnitConverter
                  unitType="power"
                  value={result.hydraulic.toString()}
                  onValueChange={() => {}}
                  fromUnit={powerFromUnit}
                  onFromUnitChange={setPowerFromUnit}
                  toUnit={powerToUnit}
                  onToUnitChange={setPowerToUnit}
                  label="Potência Hidráulica"
                />

                <UnitConverter
                  unitType="power"
                  value={result.shaft.toString()}
                  onValueChange={() => {}}
                  fromUnit={powerFromUnit}
                  onFromUnitChange={setPowerFromUnit}
                  toUnit={powerToUnit}
                  onToUnitChange={setPowerToUnit}
                  label="Potência no Eixo"
                />
              </>
            )}
          </div>
        </TabsContent>

        <TabsContent value="steps">
          {steps.length > 0 ? (
            <CalculationSteps steps={steps} title="Progressão do Cálculo de Potência da Bomba" />
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
