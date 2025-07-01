"use client"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { unitConversions } from "@/types/calculation"

interface UnitConverterProps {
  unitType: keyof typeof unitConversions
  value: string
  onValueChange: (value: string) => void
  fromUnit: string
  onFromUnitChange: (unit: string) => void
  toUnit: string
  onToUnitChange: (unit: string) => void
  label: string
}

export default function UnitConverter({
  unitType,
  value,
  onValueChange,
  fromUnit,
  onFromUnitChange,
  toUnit,
  onToUnitChange,
  label,
}: UnitConverterProps) {
  const availableUnits = unitConversions[unitType] || []
  const allUnits = [...new Set([...availableUnits.map((u) => u.from), ...availableUnits.map((u) => u.to)])]

  const convertValue = (inputValue: string, from: string, to: string): string => {
    if (!inputValue || from === to) return inputValue

    const numValue = Number.parseFloat(inputValue)
    if (isNaN(numValue)) return inputValue

    const conversion = availableUnits.find((u) => u.from === from && u.to === to)
    if (conversion) {
      const result = numValue * conversion.factor + (conversion.offset || 0)
      return result.toFixed(4).replace(/\.?0+$/, "")
    }

    // Try reverse conversion
    const reverseConversion = availableUnits.find((u) => u.from === to && u.to === from)
    if (reverseConversion) {
      const result = (numValue - (reverseConversion.offset || 0)) / reverseConversion.factor
      return result.toFixed(4).replace(/\.?0+$/, "")
    }

    return inputValue
  }

  const convertedValue = convertValue(value, fromUnit, toUnit)

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium">{label}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-xs">De:</Label>
            <div className="flex space-x-2">
              <Input
                type="number"
                value={value}
                onChange={(e) => onValueChange(e.target.value)}
                placeholder="Valor"
                className="flex-1"
              />
              <Select value={fromUnit} onValueChange={onFromUnitChange}>
                <SelectTrigger className="w-20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {allUnits.map((unit) => (
                    <SelectItem key={unit} value={unit}>
                      {unit}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-xs">Para:</Label>
            <div className="flex space-x-2">
              <Input type="text" value={convertedValue} readOnly className="flex-1 bg-gray-50" />
              <Select value={toUnit} onValueChange={onToUnitChange}>
                <SelectTrigger className="w-20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {allUnits.map((unit) => (
                    <SelectItem key={unit} value={unit}>
                      {unit}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
