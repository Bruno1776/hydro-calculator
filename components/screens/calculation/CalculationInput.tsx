import React from 'react';
import { View, Text, TextInput } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { calculationInputStyles as styles } from './CalculationInput.styles';
import { AppColors } from '@/constants/colors'; // Importando de constants

export interface UnitOption {
  label: string;
  value: string;
}

export interface CalculationField {
  name: string;
  label: string;
  baseUnit: string;
  defaultInputUnit: string;
  placeholder?: string;
  unitOptions?: UnitOption[];
  type?: 'numeric' | 'percentage' | 'coefficient';
}

interface CalculationInputProps {
  field: CalculationField;
  value: string;
  selectedValue: string;
  onValueChange: (name: string, value: string) => void;
  onUnitChange: (name: string, unitValue: string) => void;
}

const CalculationInput: React.FC<CalculationInputProps> = ({
  field,
  value,
  selectedValue,
  onValueChange,
  onUnitChange,
}) => {
  return (
    <View style={styles.inputGroup}>
      <Text style={styles.label}>{field.label}:</Text>
      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          value={value}
          onChangeText={(text) => onValueChange(field.name, text)}
          placeholder={field.placeholder || `Valor para ${field.label.toLowerCase()}`}
          placeholderTextColor={AppColors.textSecondary} // Usando cor global
        />
        {field.unitOptions && field.unitOptions.length > 0 ? (
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={selectedValue || field.defaultInputUnit}
              style={styles.picker}
              onValueChange={(itemValue) => onUnitChange(field.name, itemValue as string)}
              itemStyle={styles.pickerItem} // Estilo para itens do Picker no iOS
            >
              {field.unitOptions.map(opt => (
                <Picker.Item key={opt.value} label={opt.label} value={opt.value} />
              ))}
            </Picker>
          </View>
        ) : (
          <Text style={styles.unitStaticDisplay}>{selectedValue || field.baseUnit}</Text>
        )}
      </View>
    </View>
  );
};

export default CalculationInput;
