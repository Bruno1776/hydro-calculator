import React, { useState } from 'react';
import { View, Text, ScrollView, KeyboardAvoidingView, Platform, Alert, Dimensions, Image } from 'react-native';
import { CalculationType, CalculationHistory } from '@/types/calculation';
import CalculationForm from './screens/calculation/CalculationForm';
import CalculationResult from './screens/calculation/CalculationResult';
import { CalculationField as CalculationFormField, UnitOption } from './screens/calculation/CalculationInput';
import { styles } from './CalculationView.styles';
import { AppColors } from '@/constants/colors';

// #region Unidades e Fatores de Conversão (Mantido do original)
const FLOW_RATE_UNITS: UnitOption[] = [
  { label: 'm³/s', value: 'm3/s' }, { label: 'L/s', value: 'L/s' },
  { label: 'GPM (US)', value: 'GPM_US' }, { label: 'm³/h', value: 'm3/h'}
];
const DIAMETER_UNITS: UnitOption[] = [
  { label: 'm', value: 'm' }, { label: 'cm', value: 'cm' },
  { label: 'mm', value: 'mm' }, { label: 'in', value: 'in' },
];
const LENGTH_UNITS: UnitOption[] = [
  { label: 'm', value: 'm' }, { label: 'km', value: 'km' }, { label: 'ft', value: 'ft' },
];
const PRESSURE_UNITS: UnitOption[] = [
  { label: 'Pa', value: 'Pa' }, { label: 'kPa', value: 'kPa' },
  { label: 'bar', value: 'bar' }, { label: 'psi', value: 'psi' },
];
const VELOCITY_UNITS: UnitOption[] = [
  { label: 'm/s', value: 'm/s' }, { label: 'km/h', value: 'km/h' }, { label: 'ft/s', value: 'ft/s' },
];
const DYNAMIC_VISCOSITY_UNITS: UnitOption[] = [
  { label: 'Pa·s', value: 'Pa·s' }, { label: 'cP (centiPoise)', value: 'cP' },
];
const KINEMATIC_VISCOSITY_UNITS: UnitOption[] = [
  { label: 'm²/s', value: 'm2/s' }, { label: 'cSt (centiStokes)', value: 'cSt' },
];
const AREA_UNITS: UnitOption[] = [
  { label: 'm²', value: 'm2' }, { label: 'cm²', value: 'cm2' }, { label: 'mm²', value: 'mm2' },
];
const DENSITY_UNITS: UnitOption[] = [
  { label: 'kg/m³', value: 'kg/m3' }, { label: 'g/cm³', value: 'g/cm3' },
];

const CONVERSION_FACTORS_TO_BASE = {
  flowRate: { 'm3/s': 1, 'L/s': 0.001, 'GPM_US': 0.0000630902, 'm3/h': 1/3600 },
  diameter: { 'm': 1, 'cm': 0.01, 'mm': 0.001, 'in': 0.0254 },
  length: { 'm': 1, 'km': 1000, 'ft': 0.3048 },
  pressure: { 'Pa': 1, 'kPa': 1000, 'bar': 100000, 'psi': 6894.76 },
  velocity: { 'm/s': 1, 'km/h': 1/3.6, 'ft/s': 0.3048},
  kinematicViscosity: { 'm2/s': 1, 'cSt': 1e-6 },
  dynamicViscosity: { 'Pa·s': 1, 'cP': 0.001 },
  area: { 'm2': 1, 'cm2': 1e-4, 'mm2': 1e-6 },
  density: { 'kg/m3': 1, 'g/cm3': 1000 },
};

const CONVERSION_FACTORS_FROM_BASE = {
  pressure_mH2O: { 'mH2O': 1, 'psi': 1.42233, 'kPa': 9.80665, 'bar': 0.0980665, 'ftH2O': 3.28084 },
  power_W: { 'W': 1, 'kW': 0.001, 'hp (mecânico)': 1 / 745.7 },
  power_kW: { 'kW': 1, 'W': 1000, 'hp (mecânico)': (1 / 745.7) * 1000 },
  flowRate_m3s: { 'm3/s': 1, 'L/s': 1000, 'GPM_US': 15850.32, 'm3/h': 3600 },
  velocity_ms: { 'm/s': 1, 'km/h': 3.6, 'ft/s': 3.28084 },
  pressure_Pa: { 'Pa': 1, 'kPa': 0.001, 'bar': 1e-5, 'psi': 1 / 6894.76, 'mH2O': 1 / 9806.65 },
};

const RESULT_UNIT_OPTIONS: Record<string, UnitOption[]> = {
  'Perda de Carga (m)': [ { label: 'm', value: 'mH2O' }, { label: 'psi', value: 'psi' }, { label: 'kPa', value: 'kPa' }, { label: 'bar', value: 'bar' }, { label: 'ft', value: 'ftH2O' }, ],
  'Potência de Eixo (W)': [ { label: 'W', value: 'W' }, { label: 'kW', value: 'kW' }, { label: 'hp (mec)', value: 'hp (mecânico)' }, ],
  'Potência de Eixo (kW)': [ { label: 'kW', value: 'kW'}, { label: 'W', value: 'W'}, {label: 'hp (mec)', value: 'hp (mecânico)'} ],
  'Vazão (m³/s)': FLOW_RATE_UNITS.map(u => ({label: u.label, value: u.value})),
  'Velocidade (m/s)': VELOCITY_UNITS.map(u => ({label: u.label, value: u.value})),
  'Perda de Pressão (Pa)': PRESSURE_UNITS.map(u => ({label: u.label, value: u.value})),
};

const fieldToUnitCategory = (fieldName: string): keyof typeof CONVERSION_FACTORS_TO_BASE | null => {
    if (fieldName.toLowerCase().includes('flowrate')) return 'flowRate';
    if (fieldName.toLowerCase().includes('diameter') || fieldName.toLowerCase().includes('characteristiclength') || fieldName.toLowerCase().includes('roughness')) return 'diameter';
    if (fieldName.toLowerCase().includes('pipelength') || fieldName.toLowerCase().includes('head') && !fieldName.toLowerCase().includes('loss')) return 'length';
    if (fieldName.toLowerCase().includes('pressure')) return 'pressure';
    if (fieldName.toLowerCase().includes('velocity')) return 'velocity';
    if (fieldName.toLowerCase().includes('kinematicviscosity')) return 'kinematicViscosity';
    if (fieldName.toLowerCase().includes('fluidviscosity') || fieldName.toLowerCase().includes('dynamicviscosity')) return 'dynamicViscosity';
    if (fieldName.toLowerCase().includes('area')) return 'area';
    if (fieldName.toLowerCase().includes('density')) return 'density';
    return null;
};

const getCalculationFields = (calculationId: string): CalculationFormField[] => {
  switch (calculationId) {
    case 'head-loss': return [ { name: 'flowRate', label: 'Vazão', baseUnit: 'm3/s', defaultInputUnit: 'L/s', unitOptions: FLOW_RATE_UNITS, placeholder: 'Ex: 10', type: 'numeric' }, { name: 'pipeDiameter', label: 'Diâmetro da Tubulação', baseUnit: 'm', defaultInputUnit: 'mm', unitOptions: DIAMETER_UNITS, placeholder: 'Ex: 50', type: 'numeric' }, { name: 'lossCoefficient', label: 'Coeficiente de Perda (K)', baseUnit: '', defaultInputUnit: '', placeholder: 'Ex: 0.75', type: 'coefficient' }, ];
    case 'pipe-flow': return [ { name: 'pressureDifference', label: 'Diferença de Pressão', baseUnit: 'Pa', defaultInputUnit: 'kPa', unitOptions: PRESSURE_UNITS, placeholder: 'Ex: 10', type: 'numeric' }, { name: 'pipeLength', label: 'Comprimento da Tubulação', baseUnit: 'm', defaultInputUnit: 'm', unitOptions: LENGTH_UNITS, placeholder: 'Ex: 100', type: 'numeric' }, { name: 'pipeDiameter', label: 'Diâmetro da Tubulação', baseUnit: 'm', defaultInputUnit: 'mm', unitOptions: DIAMETER_UNITS, placeholder: 'Ex: 50', type: 'numeric' }, { name: 'fluidViscosity', label: 'Viscosidade Dinâmica (µ)', baseUnit: 'Pa·s', defaultInputUnit: 'cP', unitOptions: DYNAMIC_VISCOSITY_UNITS, placeholder: 'Ex: 1', type: 'numeric' }, ];
    case 'pressure-drop': return [ { name: 'flowRate', label: 'Vazão', baseUnit: 'm3/s', defaultInputUnit: 'L/s', unitOptions: FLOW_RATE_UNITS, placeholder: 'Ex: 10', type: 'numeric' }, { name: 'pipeLength', label: 'Comprimento', baseUnit: 'm', defaultInputUnit: 'm', unitOptions: LENGTH_UNITS, placeholder: 'Ex: 50', type: 'numeric' }, { name: 'pipeDiameter', label: 'Diâmetro Interno', baseUnit: 'm', defaultInputUnit: 'mm', unitOptions: DIAMETER_UNITS, placeholder: 'Ex: 50', type: 'numeric' }, { name: 'roughness', label: 'Rugosidade (ε)', baseUnit: 'm', defaultInputUnit: 'mm', unitOptions: DIAMETER_UNITS, placeholder: 'Ex: 0.05', type: 'numeric' }, ];
    case 'pump-power': return [ { name: 'flowRate', label: 'Vazão (Q)', baseUnit: 'm3/s', defaultInputUnit: 'm3/h', unitOptions: FLOW_RATE_UNITS, placeholder: 'Ex: 36', type: 'numeric' }, { name: 'head', label: 'Altura Manométrica (H)', baseUnit: 'm', defaultInputUnit: 'm', unitOptions: LENGTH_UNITS, placeholder: 'Ex: 20', type: 'numeric' }, { name: 'fluidDensity', label: 'Densidade do Fluido (ρ)', baseUnit: 'kg/m3', defaultInputUnit: 'kg/m3', unitOptions: DENSITY_UNITS, placeholder: 'Ex: 1000', type: 'numeric' }, { name: 'pumpEfficiency', label: 'Eficiência da Bomba (η)', baseUnit: '%', defaultInputUnit: '%', placeholder: 'Ex: 75', type: 'percentage' }, ];
    case 'flow-velocity': return [ { name: 'flowRate', label: 'Vazão (Q)', baseUnit: 'm3/s', defaultInputUnit: 'L/s', unitOptions: FLOW_RATE_UNITS, placeholder: 'Ex: 20', type: 'numeric' }, { name: 'pipeArea', label: 'Área da Seção (A)', baseUnit: 'm2', defaultInputUnit: 'cm2', unitOptions: AREA_UNITS, placeholder: 'Ex: 78.5', type: 'numeric' }, ];
    case 'reynolds-number': return [ { name: 'fluidVelocity', label: 'Velocidade (V)', baseUnit: 'm/s', defaultInputUnit: 'm/s', unitOptions: VELOCITY_UNITS, placeholder: 'Ex: 1.5', type: 'numeric' }, { name: 'characteristicLength', label: 'Diâmetro Hidráulico (D)', baseUnit: 'm', defaultInputUnit: 'mm', unitOptions: DIAMETER_UNITS, placeholder: 'Ex: 100', type: 'numeric' }, { name: 'kinematicViscosity', label: 'Viscosidade Cinemática (ν)', baseUnit: 'm2/s', defaultInputUnit: 'cSt', unitOptions: KINEMATIC_VISCOSITY_UNITS, placeholder: 'Ex: 1', type: 'numeric' }, ];
    default: return [{ name: 'param1', label: 'Parâmetro 1', baseUnit: '', defaultInputUnit: '', placeholder: 'Valor', type: 'numeric' }];
  }
};

const performCalculation = ( calculationId: string, inputs: Record<string, number>, selectedUnits: Record<string, string>, allFieldsConfig: CalculationFormField[] ): Record<string, any> => {
  const convertToBaseUnit = (fieldName: string, value: number): number => {
    const fieldConfig = allFieldsConfig.find(f => f.name === fieldName);
    if (!fieldConfig || fieldConfig.type === 'coefficient') return value;
    if (fieldConfig.type === 'percentage' && fieldName === 'pumpEfficiency') return value / 100;

    const category = fieldToUnitCategory(fieldName);
    const unit = selectedUnits[fieldName] || fieldConfig.defaultInputUnit;
    if (category && unit && fieldConfig.type !== 'percentage') {
      // @ts-ignore
      const factor = CONVERSION_FACTORS_TO_BASE[category]?.[unit];
      if (typeof factor === 'number') return value * factor;
    }
    return value;
  };

  const baseInputs: Record<string, number> = {};
  for (const key in inputs) {
    const fieldConfig = allFieldsConfig.find(f => f.name === key);
    if (fieldConfig?.type === 'percentage' && key === 'pumpEfficiency') baseInputs[key] = (inputs[key] || 0) / 100;
    else if (fieldConfig?.type !== 'percentage' && fieldConfig?.type !== 'coefficient') baseInputs[key] = convertToBaseUnit(key, inputs[key] || 0);
    else baseInputs[key] = inputs[key] || 0;
  }

  switch (calculationId) {
    case 'head-loss': const Q_hl = baseInputs.flowRate, D_hl = baseInputs.pipeDiameter, A_hl = Math.PI * Math.pow(D_hl / 2, 2), V_hl = A_hl > 0 ? Q_hl / A_hl : 0, K_hl = inputs.lossCoefficient; return { 'Perda de Carga (m)': K_hl * Math.pow(V_hl, 2) / (2 * 9.81) };
    case 'pipe-flow': const dP_pf = baseInputs.pressureDifference, D_pf = baseInputs.pipeDiameter, mu_pf = baseInputs.fluidViscosity, L_pf = baseInputs.pipeLength; return { 'Vazão (m³/s)': (dP_pf * Math.PI * Math.pow(D_pf, 4)) / (128 * mu_pf * L_pf) };
    case 'pressure-drop': const Q_pd = baseInputs.flowRate, L_pd = baseInputs.pipeLength, D_pd = baseInputs.pipeDiameter, f_pd = 0.02, rho_pd_val = allFieldsConfig.find(f=>f.name === 'fluidDensity') ? baseInputs.fluidDensity : 1000, A_pd = Math.PI * Math.pow(D_pd / 2, 2), V_pd = A_pd > 0 ? Q_pd / A_pd : 0; return { 'Perda de Pressão (Pa)': f_pd * (L_pd/D_pd) * (rho_pd_val * Math.pow(V_pd, 2) / 2), 'Fator de Atrito (f)': `${f_pd} (assumido)` };
    case 'pump-power': const Q_pp = baseInputs.flowRate, H_pp = baseInputs.head, rho_pp = baseInputs.fluidDensity, eff_pp = baseInputs.pumpEfficiency, g = 9.81, P_watts = eff_pp > 0 ? (rho_pp * g * Q_pp * H_pp) / eff_pp : 0; return { 'Potência de Eixo (W)': P_watts, 'Potência de Eixo (kW)': P_watts / 1000 };
    case 'flow-velocity': const Q_fv = baseInputs.flowRate, A_fv_base = baseInputs.pipeArea; return { 'Velocidade (m/s)': A_fv_base > 0 ? Q_fv / A_fv_base : 0 };
    case 'reynolds-number': const V_re = baseInputs.fluidVelocity, D_re = baseInputs.characteristicLength, nu_re = baseInputs.kinematicViscosity, Re = nu_re > 0 ? (V_re * D_re) / nu_re : 0; let flowRegime = 'Laminar (Re < 2300)'; if (Re > 4000) flowRegime = 'Turbulento (Re > 4000)'; else if (Re >= 2300) flowRegime = 'Transição (2300 <= Re <= 4000)'; return { 'Número de Reynolds': Re, 'Regime de Fluxo': flowRegime };
    default: return { resultado: 'Cálculo não implementado' };
  }
};
// #endregion

interface CalculationViewProps {
  calculation: CalculationType;
  onAddToHistory: (item: CalculationHistory) => void;
}

const CalculationViewComponent: React.FC<CalculationViewProps> = ({
  calculation,
  onAddToHistory,
}) => {
  console.log(JSON.stringify(calculation))
  const fields = getCalculationFields(calculation.id);
  const [inputValues, setInputValues] = useState<Record<string, string>>(
    fields.reduce((acc, field) => ({ ...acc, [field.name]: '' }), {})
  );
  const [result, setResult] = useState<Record<string, any> | null>(null);
  const [selectedInputUnits, setSelectedInputUnits] = useState<Record<string, string>>(
    fields.reduce((acc, field) => ({ ...acc, [field.name]: field.defaultInputUnit || field.baseUnit }), {})
  );
  const [selectedResultUnits, setSelectedResultUnits] = useState<Record<string, string>>({});

  const handleInputChange = (name: string, value: string) => {
    // Permite digitar vírgula, mas também números, pontos e o sinal de menos.
    // O ponto será tratado como parte do número ou parte de um padrão científico (e.g., 1.2e-3).
    // A vírgula será substituída por ponto para o parseFloat posteriormente.
    if (/^-?\d*[,.]?\d*(e-?\d+)?$/i.test(value) || value === '' || value === '-') {
      setInputValues((prev) => ({ ...prev, [name]: value }));
    }
    setResult(null);
  };

  const handleUnitChange = (fieldName: string, unitValue: string) => {
    setSelectedInputUnits(prev => ({ ...prev, [fieldName]: unitValue }));
    setResult(null);
  };

  const handleResultUnitChange = (resultKey: string, unitValue: string) => {
    setSelectedResultUnits(prev => ({ ...prev, [resultKey]: unitValue }));
  };

  const handleCalculate = () => {
    const numericInputs = Object.fromEntries(
      Object.entries(inputValues).map(([key, value]) => {
        // Substitui a vírgula por ponto antes de converter para float
        const cleanValue = value.replace(',', '.');
        const val = parseFloat(cleanValue);
        return [key, isNaN(val) ? 0 : val];
      })
    );

    const allRequiredFieldsValid = fields.every(field => {
        const valueStr = inputValues[field.name]?.trim();
        // Substitui a vírgula por ponto para a validação
        const cleanValueStr = valueStr.replace(',', '.');

        if (!cleanValueStr) {
             const numVal = parseFloat(cleanValueStr || '');
             if (field.type === 'coefficient') return !isNaN(numVal) && numVal >= 0;
             if (field.type === 'numeric' || field.type === 'percentage') return !isNaN(numVal) && numVal > 0;
             return false;
        }
        const numValue = parseFloat(cleanValueStr);
        if (isNaN(numValue)) return false;
        if (field.type === 'numeric' && numValue <= 0 && field.name !== 'lossCoefficient') return false;
        return true;
    });

    if (!allRequiredFieldsValid) {
        Alert.alert('Entrada Inválida', 'Por favor, preencha todos os campos com valores numéricos válidos. Alguns campos não podem ser zero ou negativos.');
        return;
    }

    const calcResult = performCalculation(calculation.id, numericInputs, selectedInputUnits, fields);
    setResult(calcResult);

    const inputsWithUnits: Record<string, string> = {};
    for (const key in numericInputs) {
        const formattedInputValue = formatNumberForDisplay(numericInputs[key]);
        inputsWithUnits[key] = `${formattedInputValue} ${selectedInputUnits[key] || ''}`;
    }
    onAddToHistory({
      id: `${calculation.id}-${Date.now()}`, type: calculation.title,
      timestamp: new Date().toISOString(), inputs: inputsWithUnits, result: calcResult,
    });
  };

  // Nova função auxiliar para encapsular a lógica de formatação
  const formatNumberForDisplay = (value: number): string => {
    if (typeof value !== 'number' || isNaN(value)) {
        return String(value);
    }

    if (value === 0) {
        return '0,000';
    }

    const absValue = Math.abs(value);

    // Limiar para números "muito pequenos"
    const SMALL_NUMBER_THRESHOLD = 0.001; // Números menores que 0.001

    if (absValue > 0 && absValue < SMALL_NUMBER_THRESHOLD) {
        // Para números muito pequenos (ex: 0.000000758), usar dígitos significativos
        // e garantir que não haja agrupamento de milhar na parte decimal.
        return value.toLocaleString('pt-BR', {
            maximumSignificantDigits: 3, // Exibir 3 dígitos significativos
            useGrouping: false // Não usar separadores de milhar
        });
    } else {
        // Para números maiores ou iguais ao limiar, ou exatamente 0,
        // limitar a 3 casas decimais e usar agrupamento de milhar.
        return value.toLocaleString('pt-BR', {
            minimumFractionDigits: 3,
            maximumFractionDigits: 3,
            useGrouping: true // Usar separadores de milhar
        });
    }
  };


  const getConvertedResultValue = (resultKey: string, baseValue: number): string => {
    const targetUnit = selectedResultUnits[resultKey];
    let valueToFormat = baseValue;

    // Se houver uma unidade de destino selecionada e o valor for um número
    if (targetUnit && typeof baseValue === 'number') {
        let conversionCategoryKey: keyof typeof CONVERSION_FACTORS_FROM_BASE | null = null;

        if (resultKey === 'Perda de Carga (m)') conversionCategoryKey = 'pressure_mH2O';
        else if (resultKey === 'Potência de Eixo (W)') conversionCategoryKey = 'power_W';
        else if (resultKey === 'Potência de Eixo (kW)') conversionCategoryKey = 'power_kW';
        else if (resultKey === 'Vazão (m³/s)') conversionCategoryKey = 'flowRate_m3s';
        else if (resultKey === 'Velocidade (m/s)') conversionCategoryKey = 'velocity_ms';
        else if (resultKey === 'Perda de Pressão (Pa)') conversionCategoryKey = 'pressure_Pa';

        if (conversionCategoryKey) {
            // @ts-ignore
            const factor = CONVERSION_FACTORS_FROM_BASE[conversionCategoryKey]?.[targetUnit];
            if (typeof factor === 'number') {
                valueToFormat = baseValue * factor;
            }
        }
    }
    
    // Usa a nova função auxiliar para formatar o resultado
    return formatNumberForDisplay(valueToFormat);
  };

  const screenHeight = Dimensions.get('window').height;
  const footerHeight = screenHeight * 0.15;

  return (
    <View style={styles.fullScreenContainer}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardAvoidingView}
      >
        <ScrollView style={styles.scrollViewContent} contentContainerStyle={styles.scrollContentContainer}>
          <Text style={styles.description}>{calculation.description}</Text>

          <CalculationForm
            fields={fields}
            inputValues={inputValues}
            selectedInputUnits={selectedInputUnits}
            onInputChange={handleInputChange}
            onUnitChange={handleUnitChange}
            onCalculate={handleCalculate}
          />

          <CalculationResult
            result={result}
            selectedResultUnits={selectedResultUnits}
            onResultUnitChange={handleResultUnitChange}
            getConvertedResultValue={getConvertedResultValue}
            resultUnitOptions={RESULT_UNIT_OPTIONS}
          />
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Footer */}
      <View style={[styles.footerContainer, { height: footerHeight }]}>
        <Image
          source={require('../assets/LogosGrupoNovaes_5.png')} // Ajuste o caminho conforme sua estrutura de pastas
          style={styles.headerImage} // Adicione este estilo para controlar tamanho e outros
        />
      </View>
    </View>
  );
};

export default CalculationViewComponent;