export interface CalculationHistory {
  id: string
  calculationType: string
  calculationTitle: string
  inputs: Record<string, any>
  results: Record<string, any>
  timestamp: Date
  steps?: CalculationStep[]
}

export interface CalculationStep {
  step: number
  description: string
  formula: string
  calculation: string
  result: string
}

export interface UnitConversion {
  from: string
  to: string
  factor: number
  offset?: number
}

export const unitConversions: Record<string, UnitConversion[]> = {
  length: [
    { from: "m", to: "mm", factor: 1000 },
    { from: "mm", to: "m", factor: 0.001 },
    { from: "m", to: "ft", factor: 3.28084 },
    { from: "ft", to: "m", factor: 0.3048 },
    { from: "mm", to: "in", factor: 0.0393701 },
    { from: "in", to: "mm", factor: 25.4 },
    { from: "cm", to: "mm", factor: 10 },
    { from: "mm", to: "cm", factor: 0.1 },
    { from: "m", to: "cm", factor: 100 },
    { from: "cm", to: "m", factor: 0.01 },
  ],
  velocity: [
    { from: "m/s", to: "ft/s", factor: 3.28084 },
    { from: "ft/s", to: "m/s", factor: 0.3048 },
    { from: "m/s", to: "km/h", factor: 3.6 },
    { from: "km/h", to: "m/s", factor: 0.277778 },
    { from: "m/s", to: "mph", factor: 2.23694 },
    { from: "mph", to: "m/s", factor: 0.44704 },
    { from: "ft/s", to: "mph", factor: 0.681818 },
    { from: "mph", to: "ft/s", factor: 1.46667 },
  ],
  flowRate: [
    { from: "L/s", to: "m³/h", factor: 3.6 },
    { from: "m³/h", to: "L/s", factor: 0.277778 },
    { from: "L/s", to: "gpm", factor: 15.8503 },
    { from: "gpm", to: "L/s", factor: 0.0630902 },
    { from: "L/s", to: "cfm", factor: 2.11888 },
    { from: "cfm", to: "L/s", factor: 0.471947 },
    { from: "m³/s", to: "L/s", factor: 1000 },
    { from: "L/s", to: "m³/s", factor: 0.001 },
    { from: "m³/s", to: "m³/h", factor: 3600 },
    { from: "m³/h", to: "m³/s", factor: 0.000277778 },
    { from: "L/min", to: "L/s", factor: 0.0166667 },
    { from: "L/s", to: "L/min", factor: 60 },
    { from: "m³/s", to: "gpm", factor: 15850.3 },
    { from: "gpm", to: "m³/s", factor: 0.0000630902 },
  ],
  pressure: [
    { from: "kPa", to: "psi", factor: 0.145038 },
    { from: "psi", to: "kPa", factor: 6.89476 },
    { from: "kPa", to: "bar", factor: 0.01 },
    { from: "bar", to: "kPa", factor: 100 },
    { from: "kPa", to: "mH2O", factor: 0.101972 },
    { from: "mH2O", to: "kPa", factor: 9.80665 },
    { from: "Pa", to: "kPa", factor: 0.001 },
    { from: "kPa", to: "Pa", factor: 1000 },
    { from: "bar", to: "psi", factor: 14.5038 },
    { from: "psi", to: "bar", factor: 0.0689476 },
    { from: "mmHg", to: "kPa", factor: 0.133322 },
    { from: "kPa", to: "mmHg", factor: 7.50062 },
  ],
  power: [
    { from: "kW", to: "HP", factor: 1.34102 },
    { from: "HP", to: "kW", factor: 0.745699 },
    { from: "kW", to: "BTU/h", factor: 3412.14 },
    { from: "BTU/h", to: "kW", factor: 0.000293071 },
    { from: "W", to: "kW", factor: 0.001 },
    { from: "kW", to: "W", factor: 1000 },
    { from: "HP", to: "W", factor: 745.699 },
    { from: "W", to: "HP", factor: 0.00134102 },
  ],
  area: [
    { from: "m²", to: "cm²", factor: 10000 },
    { from: "cm²", to: "m²", factor: 0.0001 },
    { from: "m²", to: "mm²", factor: 1000000 },
    { from: "mm²", to: "m²", factor: 0.000001 },
    { from: "m²", to: "ft²", factor: 10.7639 },
    { from: "ft²", to: "m²", factor: 0.092903 },
    { from: "in²", to: "cm²", factor: 6.4516 },
    { from: "cm²", to: "in²", factor: 0.155 },
  ],
}

// Helper function to convert between units
export function convertUnit(
  value: number,
  fromUnit: string,
  toUnit: string,
  unitType: keyof typeof unitConversions,
): number {
  if (fromUnit === toUnit) return value

  const conversions = unitConversions[unitType] || []

  // Direct conversion
  const directConversion = conversions.find((c) => c.from === fromUnit && c.to === toUnit)
  if (directConversion) {
    return value * directConversion.factor + (directConversion.offset || 0)
  }

  // Reverse conversion
  const reverseConversion = conversions.find((c) => c.from === toUnit && c.to === fromUnit)
  if (reverseConversion) {
    return (value - (reverseConversion.offset || 0)) / reverseConversion.factor
  }

  return value // Return original if no conversion found
}
