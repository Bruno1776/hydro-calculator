"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import { unitConversions } from "@/types/calculation"

interface UnitInputProps {
  label: string
  value: string
  onValueChange: (value: string) => void
  unit: string
  onUnitChange: (unit: string) => void
  unitType: keyof typeof unitConversions
  placeholder?: string
  step?: string
  onTransferToConverter?: () => void
  showTransferButton?: boolean
}

export default function UnitInput({
  label,
  value,
  onValueChange,
  unit,
  onUnitChange,
  unitType,
  placeholder,
  step = "0.1",
  onTransferToConverter,
  showTransferButton = false,
}: UnitInputProps) {
  const availableUnits = unitConversions[unitType] || []
  const allUnits = [...new Set([...availableUnits.map((u) => u.from), ...availableUnits.map((u) => u.to)])]

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <div className="flex space-x-2">
        <Input
          type="number"
          step={step}
          value={value}
          onChange={(e) => onValueChange(e.target.value)}
          placeholder={placeholder}
          className="flex-1"
        />
        <Select value={unit} onValueChange={onUnitChange}>
          <SelectTrigger className="w-24">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {allUnits.map((unitOption) => (
              <SelectItem key={unitOption} value={unitOption}>
                {unitOption}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {showTransferButton && onTransferToConverter && (
          <Button
            variant="outline"
            size="sm"
            onClick={onTransferToConverter}
            className="px-2 bg-transparent"
            title="Transferir para conversor"
          >
            <ArrowRight className="w-4 h-4" />
          </Button>
        )}
      </div>
    </div>
  )
}
