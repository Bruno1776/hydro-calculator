import React from 'react';
import { View, Text } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { calculationResultStyles as styles } from './CalculationResult.styles';
import { UnitOption } from './CalculationInput'; // Reutilizando UnitOption

interface CalculationResultProps {
  result: Record<string, any> | null;
  selectedResultUnits: Record<string, string>;
  onResultUnitChange: (resultKey: string, unitValue: string) => void;
  getConvertedResultValue: (resultKey: string, baseValue: number) => string;
  resultUnitOptions: Record<string, UnitOption[]>; // Opções de unidade para cada chave de resultado
}

const CalculationResult: React.FC<CalculationResultProps> = ({
  result,
  selectedResultUnits,
  onResultUnitChange,
  getConvertedResultValue,
  resultUnitOptions,
}) => {
  if (!result) {
    return null;
  }

  return (
    <View style={styles.resultContainer}>
      <Text style={styles.resultTitle}>Resultado:</Text>
      {Object.entries(result).map(([key, value]) => {
        const unitOptions = resultUnitOptions[key];
        const originalValueIsNumber = typeof value === 'number';

        // Campos não numéricos ou não diretamente conversíveis (ex: Regime de Fluxo)
        if (!originalValueIsNumber || key === 'Regime de Fluxo' || key.toLowerCase().includes('fator de atrito')) {
          return (
            <View key={key} style={styles.resultItem}>
              <Text style={styles.resultKey}>{key.charAt(0).toUpperCase() + key.slice(1)}:</Text>
              <Text style={styles.resultValue}>{value.toString()}</Text>
            </View>
          );
        }

        return (
          <View key={key} style={styles.resultItem}>
            <Text style={styles.resultKey}>{key.charAt(0).toUpperCase() + key.slice(1)}:</Text>
            <View style={styles.resultValueContainer}>
              <Text style={styles.resultValue}>
                {getConvertedResultValue(key, value)}
              </Text>
              {unitOptions && (
                <View style={styles.resultPickerContainer}>
                  <Picker
                    selectedValue={selectedResultUnits[key] || (unitOptions.length > 0 ? unitOptions[0].value : '')}
                    style={styles.picker}
                    onValueChange={(itemValue) => onResultUnitChange(key, itemValue as string)}
                    itemStyle={styles.pickerItem}
                  >
                    {unitOptions.map(opt => (
                      <Picker.Item key={opt.value} label={opt.label} value={opt.value}/>
                    ))}
                  </Picker>
                </View>
              )}
            </View>
          </View>
        );
      })}
    </View>
  );
};

export default CalculationResult;
