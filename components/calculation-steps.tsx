"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import MathRenderer from "@/components/math-renderer"
import type { CalculationStep } from "@/types/calculation"

interface CalculationStepsProps {
  steps: CalculationStep[]
}

export default function CalculationSteps({ steps }: CalculationStepsProps) {
  return (
    <div className="space-y-4">
      {steps.map((step, index) => (
        <Card key={step.step} className="relative">
          {/* Connector line */}
          {index < steps.length - 1 && <div className="absolute left-6 top-16 w-0.5 h-8 bg-novaes-teal/30 z-0" />}

          <CardContent className="p-6 relative z-10">
            <div className="flex items-start space-x-4">
              {/* Step number */}
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-novaes-teal rounded-full flex items-center justify-center">
                  <span className="text-white font-bold">{step.step}</span>
                </div>
              </div>

              {/* Step content */}
              <div className="flex-1 space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{step.description}</h3>
                </div>

                {/* Formula */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="text-sm font-medium text-blue-800 mb-2">Fórmula:</div>
                  <div className="text-center">
                    <MathRenderer formula={step.formula} />
                  </div>
                </div>

                {/* Calculation */}
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <div className="text-sm font-medium text-gray-800 mb-2">Substituição:</div>
                  <div className="text-center">
                    <MathRenderer formula={step.calculation} />
                  </div>
                </div>

                {/* Result */}
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="text-sm font-medium text-green-800 mb-2">Resultado:</div>
                  <div className="text-center">
                    <Badge className="bg-green-600 text-white text-lg px-4 py-2">{step.result}</Badge>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
