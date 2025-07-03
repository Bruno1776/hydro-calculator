import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { CheckSquare } from 'lucide-react-native';
import CalculationInput, { CalculationField } from './CalculationInput'; // UnitOption não é diretamente usado aqui
import { calculationFormStyles as styles } from './CalculationForm.styles';
import { AppColors } from '@/constants/colors'; // Importando de constants

interface CalculationFormProps {
  fields: CalculationField[];
  inputValues: Record<string, string>;
  selectedInputUnits: Record<string, string>;
  onInputChange: (name: string, value: string) => void;
  onUnitChange: (name: string, unitValue: string) => void;
  onCalculate: () => void;
}

const CalculationForm: React.FC<CalculationFormProps> = ({
  fields,
  inputValues,
  selectedInputUnits,
  onInputChange,
  onUnitChange,
  onCalculate,
}) => {
  return (
    <View style={styles.form}>
      {fields.map((field) => (
        <CalculationInput
          key={field.name}
          field={field}
          value={inputValues[field.name]}
          selectedValue={selectedInputUnits[field.name]}
          onValueChange={onInputChange}
          onUnitChange={onUnitChange}
        />
      ))}
      <TouchableOpacity style={styles.calculateButton} onPress={onCalculate}>
        <CheckSquare size={20} color={AppColors.buttonText} />
        <Text style={styles.calculateButtonText}>Calcular</Text>
      </TouchableOpacity>
    </View>
  );
};

export default CalculationForm;
