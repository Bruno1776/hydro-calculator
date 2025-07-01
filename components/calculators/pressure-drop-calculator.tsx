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

interface PressureDropCalculatorProps {
  onAddToHistory: (calculation: CalculationHistory) => void
}

export default function PressureDropCalculator({ onAddToHistory }: PressureDropCalculatorProps) {
  const [length, setLength] = useState("")
  const [lengthFromUnit, setLengthFromUnit] = useState("m")
  const [lengthToUnit, setLengthToUnit] = useState("ft")
  const [diameter, setDiameter] = useState("")
  const [diameterFromUnit, setDiameterFromUnit] = useState("mm")
  const [diameterToUnit, setDiameterToUnit] = useState("in")
  const [velocity, setVelocity] = useState("")
  const [velocityFromUnit, setVelocityFromUnit] = useState("m/s")
  const [velocityToUnit, setVelocityToUnit] = useState("ft/s")
  const [frictionFactor, setFrictionFactor] = useState("0.02")
  const [result, setResult] = useState<number | null>(null)
  const [resultFromUnit, setResultFromUnit] = useState("kPa")
  const [resultToUnit, setResultToUnit] = useState("psi")
  const [steps, setSteps] = useState<CalculationStep[]>([])

  const calculatePressureDrop = () => {
    const L = Number.parseFloat(length)
    const D = Number.parseFloat(diameter) / 1000 // Convert mm to m
    const V = Number.parseFloat(velocity)
    const f = Number.parseFloat(frictionFactor)

    if (L > 0 && D > 0 && V > 0 && f > 0) {
      // Darcy-Weisbach equation: ΔP = f × (L/D) × (ρV²/2)
      // Assuming water density = 1000 kg/m³
      const rho = 1000
      const pressureDrop = (f * (L / D) * ((rho * V * V) / 2)) / 1000 // Convert to kPa
      setResult(pressureDrop)

      // Generate calculation steps
      const calculationSteps: CalculationStep[] = [
        {
          step: 1,
          description: "Identificar os valores conhecidos",
          formula: "\\Delta P = f \\times \\frac{L}{D} \\times \\frac{\\rho V^2}{2}",
          calculation: `L = ${L}\\text{ m}, \\quad D = ${diameter}\\text{ mm} = ${D.toFixed(4)}\\text{ m}, \\quad V = ${V}\\text{ m/s}, \\quad f = ${f}, \\quad \\rho = 1000\\text{ kg/m}^3`,
          result: "Valores identificados",
        },
        {
          step: 2,
          description: "Calcular L/D",
          formula: "\\frac{L}{D} = \\frac{L}{D}",
          calculation: `\\frac{L}{D} = \\frac{${L}}{${D.toFixed(4)}} = ${(L / D).toFixed(2)}`,
          result: `${(L / D).toFixed(2)}`,
        },
        {
          step: 3,
          description: "Calcular ρV²/2",
          formula: "\\frac{\\rho V^2}{2} = \\frac{\\rho \\times V^2}{2}",
          calculation: `\\frac{\\rho V^2}{2} = \\frac{1000 \\times ${V}^2}{2} = \\frac{1000 \\times ${(V * V).toFixed(2)}}{2} = ${((rho * V * V) / 2).toFixed(2)}\\text{ Pa}`,
          result: `${((rho * V * V) / 2).toFixed(2)} Pa`,
        },
        {
          step: 4,
          description: "Calcular a perda de pressão",
          formula: "\\Delta P = f \\times \\frac{L}{D} \\times \\frac{\\rho V^2}{2}",
          calculation: `\\Delta P = ${f} \\times ${(L / D).toFixed(2)} \\times ${((rho * V * V) / 2).toFixed(2)} = ${(pressureDrop * 1000).toFixed(2)}\\text{ Pa} = ${pressureDrop.toFixed(2)}\\text{ kPa}`,
          result: `${pressureDrop.toFixed(2)} kPa`,
        },
      ]

      setSteps(calculationSteps)

      // Add to history
      const historyEntry: CalculationHistory = {
        id: Date.now().toString(),
        calculationType: "pressure-drop",
        calculationTitle: "Perda de Pressão",
        inputs: {
          Comprimento: `${L} ${lengthFromUnit}`,
          Diâmetro: `${diameter} ${diameterFromUnit}`,
          Velocidade: `${V} ${velocityFromUnit}`,
          "Fator de Atrito": f,
        },
        results: {
          "Perda de Pressão": `${pressureDrop.toFixed(2)} kPa`,
          "Perda de Pressão (mH₂O)": `${(pressureDrop * 0.102).toFixed(2)} mH₂O`,
        },
        timestamp: new Date(),
        steps: calculationSteps,
      }

      onAddToHistory(historyEntry)
    }
  }

  const reset = () => {
    setLength("")
    setDiameter("")
    setVelocity("")
    setFrictionFactor("0.02")
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
                <Label htmlFor="length">Comprimento da Tubulação (m)</Label>
                <Input
                  id="length"
                  type="number"
                  value={length}
                  onChange={(e) => setLength(e.target.value)}
                  placeholder="Digite o comprimento da tubulação"
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

              <div>
                <Label htmlFor="velocity">Velocidade do Fluxo (m/s)</Label>
                <Input
                  id="velocity"
                  type="number"
                  step="0.1"
                  value={velocity}
                  onChange={(e) => setVelocity(e.target.value)}
                  placeholder="Digite a velocidade"
                />
              </div>

              <div>
                <Label htmlFor="friction">Fator de Atrito</Label>
                <Input
                  id="friction"
                  type="number"
                  step="0.001"
                  value={frictionFactor}
                  onChange={(e) => setFrictionFactor(e.target.value)}
                  placeholder="Digite o fator de atrito"
                />
              </div>

              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                <Button onClick={calculatePressureDrop} className="flex-1">
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
                    <div className="text-2xl font-bold text-blue-600">{result.toFixed(2)} kPa</div>
                    <p className="text-gray-600">Perda de Pressão</p>
                    <div className="mt-2 text-sm text-gray-500">{(result * 0.102).toFixed(2)} mH₂O</div>
                  </CardContent>
                </Card>
              )}

              <Alert>
                <AlertDescription>
                  <strong>Fórmula:</strong> ΔP = f × (L/D) × (ρV²/2)
                  <br />
                  Fator de atrito típico: 0,015-0,025 para tubos lisos
                </AlertDescription>
              </Alert>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="units" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-4">
            <UnitConverter
              unitType="length"
              value={length}
              onValueChange={setLength}
              fromUnit={lengthFromUnit}
              onFromUnitChange={setLengthFromUnit}
              toUnit={lengthToUnit}
              onToUnitChange={setLengthToUnit}
              label="Conversão de Comprimento"
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

            <UnitConverter
              unitType="velocity"
              value={velocity}
              onValueChange={setVelocity}
              fromUnit={velocityFromUnit}
              onFromUnitChange={setVelocityFromUnit}
              toUnit={velocityToUnit}
              onToUnitChange={setVelocityToUnit}
              label="Conversão de Velocidade"
            />

            {result !== null && (
              <UnitConverter
                unitType="pressure"
                value={result.toString()}
                onValueChange={() => {}}
                fromUnit={resultFromUnit}
                onFromUnitChange={setResultFromUnit}
                toUnit={resultToUnit}
                onToUnitChange={setResultToUnit}
                label="Conversão de Pressão"
              />
            )}
          </div>
        </TabsContent>

        <TabsContent value="steps">
          {steps.length > 0 ? (
            <CalculationSteps steps={steps} title="Progressão do Cálculo de Perda de Pressão" />
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
