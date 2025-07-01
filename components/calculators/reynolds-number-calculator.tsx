"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import UnitConverter from "@/components/unit-converter"
import CalculationSteps from "@/components/calculation-steps"
import type { CalculationHistory, CalculationStep } from "@/types/calculation"

const fluidProperties = {
  water: { name: "Água (20°C)", density: 1000, viscosity: 0.001 },
  oil: { name: "Óleo (típico)", density: 850, viscosity: 0.05 },
  air: { name: "Ar (20°C)", density: 1.2, viscosity: 0.000018 },
  glycerin: { name: "Glicerina", density: 1260, viscosity: 1.5 },
}

interface ReynoldsNumberCalculatorProps {
  onAddToHistory: (calculation: CalculationHistory) => void
}

export default function ReynoldsNumberCalculator({ onAddToHistory }: ReynoldsNumberCalculatorProps) {
  const [velocity, setVelocity] = useState("")
  const [velocityFromUnit, setVelocityFromUnit] = useState("m/s")
  const [velocityToUnit, setVelocityToUnit] = useState("ft/s")
  const [diameter, setDiameter] = useState("")
  const [diameterFromUnit, setDiameterFromUnit] = useState("mm")
  const [diameterToUnit, setDiameterToUnit] = useState("in")
  const [fluidType, setFluidType] = useState("")
  const [customDensity, setCustomDensity] = useState("")
  const [customViscosity, setCustomViscosity] = useState("")
  const [result, setResult] = useState<{ reynolds: number; flowType: string } | null>(null)
  const [steps, setSteps] = useState<CalculationStep[]>([])

  const calculateReynolds = () => {
    const V = Number.parseFloat(velocity)
    const D = Number.parseFloat(diameter) / 1000 // Convert mm to m

    let rho = 0
    let mu = 0
    let fluidName = ""

    if (fluidType && fluidProperties[fluidType as keyof typeof fluidProperties]) {
      const fluid = fluidProperties[fluidType as keyof typeof fluidProperties]
      rho = fluid.density
      mu = fluid.viscosity
      fluidName = fluid.name
    } else if (customDensity && customViscosity) {
      rho = Number.parseFloat(customDensity)
      mu = Number.parseFloat(customViscosity)
      fluidName = "Fluido personalizado"
    }

    if (V > 0 && D > 0 && rho > 0 && mu > 0) {
      const reynolds = (rho * V * D) / mu

      let flowType = ""
      if (reynolds < 2300) {
        flowType = "Fluxo Laminar"
      } else if (reynolds < 4000) {
        flowType = "Fluxo de Transição"
      } else {
        flowType = "Fluxo Turbulento"
      }

      setResult({ reynolds, flowType })

      // Generate calculation steps
      const calculationSteps: CalculationStep[] = [
        {
          step: 1,
          description: "Identificar os valores conhecidos",
          formula: "Re = \\frac{\\rho V D}{\\mu}",
          calculation: `V = ${V}\\text{ m/s}, \\quad D = ${diameter}\\text{ mm} = ${D.toFixed(4)}\\text{ m}, \\quad \\rho = ${rho}\\text{ kg/m}^3, \\quad \\mu = ${mu}\\text{ Pa·s}`,
          result: `Fluido: ${fluidName}`,
        },
        {
          step: 2,
          description: "Calcular ρVD",
          formula: "\\rho V D = \\rho \\times V \\times D",
          calculation: `\\rho V D = ${rho} \\times ${V} \\times ${D.toFixed(4)} = ${(rho * V * D).toFixed(6)}\\text{ kg·m/s·m}^2`,
          result: `${(rho * V * D).toFixed(6)} kg·m/s·m²`,
        },
        {
          step: 3,
          description: "Calcular o número de Reynolds",
          formula: "Re = \\frac{\\rho V D}{\\mu}",
          calculation: `Re = \\frac{${(rho * V * D).toFixed(6)}}{${mu}} = ${reynolds.toFixed(0)}`,
          result: `${reynolds.toFixed(0)} (adimensional)`,
        },
        {
          step: 4,
          description: "Determinar o regime de fluxo",
          formula:
            "\\text{Se } Re < 2300: \\text{ Laminar}, \\quad 2300 < Re < 4000: \\text{ Transição}, \\quad Re > 4000: \\text{ Turbulento}",
          calculation: `Re = ${reynolds.toFixed(0)} \\Rightarrow ${flowType}`,
          result: flowType,
        },
      ]

      setSteps(calculationSteps)

      // Add to history
      const historyEntry: CalculationHistory = {
        id: Date.now().toString(),
        calculationType: "reynolds-number",
        calculationTitle: "Número de Reynolds",
        inputs: {
          Velocidade: `${V} ${velocityFromUnit}`,
          Diâmetro: `${diameter} ${diameterFromUnit}`,
          Fluido: fluidName,
          Densidade: `${rho} kg/m³`,
          Viscosidade: `${mu} Pa·s`,
        },
        results: {
          "Número de Reynolds": reynolds.toFixed(0),
          "Regime de Fluxo": flowType,
        },
        timestamp: new Date(),
        steps: calculationSteps,
      }

      onAddToHistory(historyEntry)
    }
  }

  const reset = () => {
    setVelocity("")
    setDiameter("")
    setFluidType("")
    setCustomDensity("")
    setCustomViscosity("")
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
                <Label htmlFor="fluid">Tipo de Fluido</Label>
                <Select value={fluidType} onValueChange={setFluidType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo de fluido" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(fluidProperties).map(([key, fluid]) => (
                      <SelectItem key={key} value={key}>
                        {fluid.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div>
                  <Label htmlFor="density">Densidade Personalizada (kg/m³)</Label>
                  <Input
                    id="density"
                    type="number"
                    value={customDensity}
                    onChange={(e) => setCustomDensity(e.target.value)}
                    placeholder="Opcional"
                  />
                </div>
                <div>
                  <Label htmlFor="viscosity">Viscosidade Personalizada (Pa·s)</Label>
                  <Input
                    id="viscosity"
                    type="number"
                    step="0.001"
                    value={customViscosity}
                    onChange={(e) => setCustomViscosity(e.target.value)}
                    placeholder="Opcional"
                  />
                </div>
              </div>

              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                <Button onClick={calculateReynolds} className="flex-1">
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
                      <CardTitle className="text-lg">Número de Reynolds</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-blue-600">{result.reynolds.toFixed(0)}</div>
                      <p className="text-gray-600">Adimensional</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Regime de Fluxo</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div
                        className={`text-xl font-bold ${
                          result.flowType === "Fluxo Laminar"
                            ? "text-green-600"
                            : result.flowType === "Fluxo de Transição"
                              ? "text-orange-600"
                              : "text-red-600"
                        }`}
                      >
                        {result.flowType}
                      </div>
                      <div className="mt-2 text-sm text-gray-600">
                        {result.flowType === "Fluxo Laminar" && "Fluxo suave e previsível"}
                        {result.flowType === "Fluxo de Transição" && "Características mistas de fluxo"}
                        {result.flowType === "Fluxo Turbulento" && "Fluxo caótico com mistura"}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              <Alert>
                <AlertDescription>
                  <strong>Fórmula:</strong> Re = ρVD/μ
                  <br />
                  <strong>Regimes de Fluxo:</strong>
                  <br />• Re {"<"} 2300: Laminar
                  <br />• 2300 {"<"} Re {"<"} 4000: Transição
                  <br />• Re {">"} 4000: Turbulento
                </AlertDescription>
              </Alert>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="units" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
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
          </div>
        </TabsContent>

        <TabsContent value="steps">
          {steps.length > 0 ? (
            <CalculationSteps steps={steps} title="Progressão do Cálculo do Número de Reynolds" />
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
