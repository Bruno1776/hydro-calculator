import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView, TouchableOpacity, Platform, KeyboardAvoidingView, Alert } from 'react-native';
import { CalculationType, CalculationHistory } from '@/types/calculation';
import { CheckSquare } from 'lucide-react-native';
import { Picker } from '@react-native-picker/picker'; // Adicionado para seleção de unidades

// Removido ArrowLeft e BookOpen, pois a navegação de voltar é pelo header do router
// e o toggle de modo será feito pelo headerRight na tela.

interface CalculationViewProps {
  calculation: CalculationType;
  // onBack e onToggleMode não são mais necessários aqui, pois serão gerenciados pela tela que usa este componente.
  onAddToHistory: (item: CalculationHistory) => void;
}

const AppColors = {
  primary: '#007AFF',
  secondary: '#5856D6',
  background: '#F2F2F7',
  cardBackground: '#FFFFFF',
  text: '#000000',
  textSecondary: '#3C3C4399',
  inputBorder: '#C7C7CC',
  inputBackground: '#FFFFFF',
  buttonText: '#FFFFFF',
  resultBackground: '#EBF5FF',
  resultText: '#003366',
};

// Definições de Unidades e Conversões
interface UnitOption {
  label: string; // Ex: "m³/s"
  value: string; // Ex: "m3/s" (chave para CONVERSION_FACTORS)
}

interface CalculationField {
  name: string;
  label: string;
  baseUnit: string; // Unidade base para cálculo (ex: 'm3/s')
  defaultInputUnit: string; // Unidade padrão para exibição no input (ex: 'L/s')
  placeholder?: string;
  unitOptions?: UnitOption[];
  type?: 'numeric' | 'percentage' | 'coefficient'; // Ajuda a determinar se a conversão de unidade se aplica
}

const FLOW_RATE_UNITS: UnitOption[] = [
  { label: 'm³/s', value: 'm3/s' },
  { label: 'L/s', value: 'L/s' },
  { label: 'GPM (US)', value: 'GPM_US' },
  { label: 'm³/h', value: 'm3/h'}
];

const DIAMETER_UNITS: UnitOption[] = [ // Também para comprimentos característicos, rugosidade
  { label: 'm', value: 'm' },
  { label: 'cm', value: 'cm' },
  { label: 'mm', value: 'mm' },
  { label: 'in', value: 'in' },
];

const LENGTH_UNITS: UnitOption[] = [ // Para comprimentos de tubulação, altura manométrica
  { label: 'm', value: 'm' },
  { label: 'km', value: 'km' },
  { label: 'ft', value: 'ft' },
];

const PRESSURE_UNITS: UnitOption[] = [
    { label: 'Pa', value: 'Pa' },
    { label: 'kPa', value: 'kPa' },
    { label: 'bar', value: 'bar' },
    { label: 'psi', value: 'psi' },
];

const VELOCITY_UNITS: UnitOption[] = [
    { label: 'm/s', value: 'm/s' },
    { label: 'km/h', value: 'km/h' },
    { label: 'ft/s', value: 'ft/s' },
];

const DYNAMIC_VISCOSITY_UNITS: UnitOption[] = [
    { label: 'Pa·s', value: 'Pa·s' },
    { label: 'cP (centiPoise)', value: 'cP' },
];

const KINEMATIC_VISCOSITY_UNITS: UnitOption[] = [
    { label: 'm²/s', value: 'm2/s' },
    { label: 'cSt (centiStokes)', value: 'cSt' },
];

const AREA_UNITS: UnitOption[] = [
    { label: 'm²', value: 'm2' },
    { label: 'cm²', value: 'cm2' },
    { label: 'mm²', value: 'mm2' },
];

const DENSITY_UNITS: UnitOption[] = [
    { label: 'kg/m³', value: 'kg/m3' },
    { label: 'g/cm³', value: 'g/cm3' },
];


const CONVERSION_FACTORS_TO_BASE = { // Fatores para converter PARA a unidade base SI
  flowRate: { 'm3/s': 1, 'L/s': 0.001, 'GPM_US': 0.0000630902, 'm3/h': 1/3600 },
  diameter: { 'm': 1, 'cm': 0.01, 'mm': 0.001, 'in': 0.0254 }, // Usado para diameter, characteristicLength, roughness
  length: { 'm': 1, 'km': 1000, 'ft': 0.3048 }, // Usado para pipeLength, head
  pressure: { 'Pa': 1, 'kPa': 1000, 'bar': 100000, 'psi': 6894.76 },
  velocity: { 'm/s': 1, 'km/h': 1/3.6, 'ft/s': 0.3048},
  kinematicViscosity: { 'm2/s': 1, 'cSt': 1e-6 }, // ν
  dynamicViscosity: { 'Pa·s': 1, 'cP': 0.001 }, // μ
  area: { 'm2': 1, 'cm2': 1e-4, 'mm2': 1e-6 },
  density: { 'kg/m3': 1, 'g/cm3': 1000 },
  // Adicionar mais conforme necessário
};

const CONVERSION_FACTORS_FROM_BASE = {
  pressure_mH2O: { // Para converter 'Perda de Carga (m)' que está em metros de coluna de fluido
    'mH2O': 1,
    'psi': 1.42233, // 1 mH2O ~ 1.42233 psi (usando g=9.80665, rho=1000 kg/m3)
    'kPa': 9.80665,
    'bar': 0.0980665,
    'ftH2O': 3.28084,
  },
  power_W: {
    'W': 1,
    'kW': 0.001,
    'hp (mecânico)': 1 / 745.7,
  },
  flowRate_m3s: {
    'm3/s': 1,
    'L/s': 1000,
    'GPM_US': 15850.32, // 1 m³/s = 15850.32 GPM (US)
    'm3/h': 3600,
  },
  velocity_ms: {
    'm/s': 1,
    'km/h': 3.6,
    'ft/s': 3.28084,
  },
  pressure_Pa: {
      'Pa': 1,
      'kPa': 0.001,
      'bar': 1e-5,
      'psi': 1 / 6894.76,
      'mH2O': 1 / 9806.65,
  }
};

const RESULT_UNIT_OPTIONS: Record<string, UnitOption[]> = {
  'Perda de Carga (m)': [
    { label: 'm', value: 'mH2O' }, { label: 'psi', value: 'psi' }, { label: 'kPa', value: 'kPa' },
    { label: 'bar', value: 'bar' }, { label: 'ft', value: 'ftH2O' },
  ],
  'Potência de Eixo (W)': [
    { label: 'W', value: 'W' }, { label: 'kW', value: 'kW' }, { label: 'hp (mec)', value: 'hp (mecânico)' },
  ],
  'Potência de Eixo (kW)': [ // Adicionado para permitir conversão se o resultado primário for kW
    { label: 'kW', value: 'kW'}, { label: 'W', value: 'W'}, {label: 'hp (mec)', value: 'hp (mecânico)'}
  ],
  'Vazão (m³/s)': FLOW_RATE_UNITS.map(u => ({label: u.label, value: u.value})),
  'Velocidade (m/s)': VELOCITY_UNITS.map(u => ({label: u.label, value: u.value})),
  'Perda de Pressão (Pa)': PRESSURE_UNITS.map(u => ({label: u.label, value: u.value})),
};


// Mapeia o nome do campo para a categoria de unidade em CONVERSION_FACTORS_TO_BASE
const fieldToUnitCategory = (fieldName: string): keyof typeof CONVERSION_FACTORS_TO_BASE | null => {
    if (fieldName.toLowerCase().includes('flowrate')) return 'flowRate';
    if (fieldName.toLowerCase().includes('diameter') || fieldName.toLowerCase().includes('characteristiclength') || fieldName.toLowerCase().includes('roughness')) return 'diameter';
    if (fieldName.toLowerCase().includes('pipelength') || fieldName.toLowerCase().includes('head') && !fieldName.toLowerCase().includes('loss')) return 'length'; // head loss é resultado
    if (fieldName.toLowerCase().includes('pressure')) return 'pressure';
    if (fieldName.toLowerCase().includes('velocity')) return 'velocity';
    if (fieldName.toLowerCase().includes('kinematicviscosity')) return 'kinematicViscosity';
    if (fieldName.toLowerCase().includes('fluidviscosity') || fieldName.toLowerCase().includes('dynamicviscosity')) return 'dynamicViscosity';
    if (fieldName.toLowerCase().includes('area')) return 'area';
    if (fieldName.toLowerCase().includes('density')) return 'density';
    return null;
}


const getCalculationFields = (calculationId: string): CalculationField[] => {
  switch (calculationId) {
    case 'head-loss': // Perda de Carga Localizada
      return [
        { name: 'flowRate', label: 'Vazão', baseUnit: 'm3/s', defaultInputUnit: 'L/s', unitOptions: FLOW_RATE_UNITS, placeholder: 'Ex: 10', type: 'numeric' },
        { name: 'pipeDiameter', label: 'Diâmetro da Tubulação', baseUnit: 'm', defaultInputUnit: 'mm', unitOptions: DIAMETER_UNITS, placeholder: 'Ex: 50', type: 'numeric' },
        { name: 'lossCoefficient', label: 'Coeficiente de Perda (K)', baseUnit: '', defaultInputUnit: '', placeholder: 'Ex: 0.75', type: 'coefficient' },
      ];
    case 'pipe-flow': // Vazão em Tubulações (Hagen-Poiseuille para fluxo laminar)
      return [
        { name: 'pressureDifference', label: 'Diferença de Pressão', baseUnit: 'Pa', defaultInputUnit: 'kPa', unitOptions: PRESSURE_UNITS, placeholder: 'Ex: 10', type: 'numeric' },
        { name: 'pipeLength', label: 'Comprimento da Tubulação', baseUnit: 'm', defaultInputUnit: 'm', unitOptions: LENGTH_UNITS, placeholder: 'Ex: 100', type: 'numeric' },
        { name: 'pipeDiameter', label: 'Diâmetro da Tubulação', baseUnit: 'm', defaultInputUnit: 'mm', unitOptions: DIAMETER_UNITS, placeholder: 'Ex: 50', type: 'numeric' },
        { name: 'fluidViscosity', label: 'Viscosidade Dinâmica (µ)', baseUnit: 'Pa·s', defaultInputUnit: 'cP', unitOptions: DYNAMIC_VISCOSITY_UNITS, placeholder: 'Ex: 1', type: 'numeric' },
      ];
    case 'pressure-drop': // Perda de Pressão Contínua (Darcy-Weisbach)
       return [
        { name: 'flowRate', label: 'Vazão', baseUnit: 'm3/s', defaultInputUnit: 'L/s', unitOptions: FLOW_RATE_UNITS, placeholder: 'Ex: 10', type: 'numeric' },
        { name: 'pipeLength', label: 'Comprimento', baseUnit: 'm', defaultInputUnit: 'm', unitOptions: LENGTH_UNITS, placeholder: 'Ex: 50', type: 'numeric' },
        { name: 'pipeDiameter', label: 'Diâmetro Interno', baseUnit: 'm', defaultInputUnit: 'mm', unitOptions: DIAMETER_UNITS, placeholder: 'Ex: 50', type: 'numeric' },
        { name: 'roughness', label: 'Rugosidade (ε)', baseUnit: 'm', defaultInputUnit: 'mm', unitOptions: DIAMETER_UNITS, placeholder: 'Ex: 0.05', type: 'numeric' },
        // Nota: Fator de atrito 'f' não é input direto aqui, é calculado ou assumido. Densidade do fluido também.
      ];
    case 'pump-power': // Potência da Bomba
      return [
        { name: 'flowRate', label: 'Vazão (Q)', baseUnit: 'm3/s', defaultInputUnit: 'm3/h', unitOptions: FLOW_RATE_UNITS, placeholder: 'Ex: 36', type: 'numeric' },
        { name: 'head', label: 'Altura Manométrica (H)', baseUnit: 'm', defaultInputUnit: 'm', unitOptions: LENGTH_UNITS, placeholder: 'Ex: 20', type: 'numeric' },
        { name: 'fluidDensity', label: 'Densidade do Fluido (ρ)', baseUnit: 'kg/m3', defaultInputUnit: 'kg/m3', unitOptions: DENSITY_UNITS, placeholder: 'Ex: 1000', type: 'numeric' },
        { name: 'pumpEfficiency', label: 'Eficiência da Bomba (η)', baseUnit: '%', defaultInputUnit: '%', placeholder: 'Ex: 75', type: 'percentage' },
      ];
    case 'flow-velocity': // Velocidade do Fluxo
      return [
        { name: 'flowRate', label: 'Vazão (Q)', baseUnit: 'm3/s', defaultInputUnit: 'L/s', unitOptions: FLOW_RATE_UNITS, placeholder: 'Ex: 20', type: 'numeric' },
        { name: 'pipeArea', label: 'Área da Seção (A)', baseUnit: 'm2', defaultInputUnit: 'cm2', unitOptions: AREA_UNITS, placeholder: 'Ex: 78.5', type: 'numeric' },
      ];
    case 'reynolds-number': // Número de Reynolds
      return [
        { name: 'fluidVelocity', label: 'Velocidade (V)', baseUnit: 'm/s', defaultInputUnit: 'm/s', unitOptions: VELOCITY_UNITS, placeholder: 'Ex: 1.5', type: 'numeric' },
        { name: 'characteristicLength', label: 'Diâmetro Hidráulico (D)', baseUnit: 'm', defaultInputUnit: 'mm', unitOptions: DIAMETER_UNITS, placeholder: 'Ex: 100', type: 'numeric' },
        { name: 'kinematicViscosity', label: 'Viscosidade Cinemática (ν)', baseUnit: 'm2/s', defaultInputUnit: 'cSt', unitOptions: KINEMATIC_VISCOSITY_UNITS, placeholder: 'Ex: 1', type: 'numeric' },
        // Poderia adicionar opção para calcular com densidade (ρ) e viscosidade dinâmica (μ)
      ];
    default:
      return [{ name: 'param1', label: 'Parâmetro 1', baseUnit: '', defaultInputUnit: '', placeholder: 'Valor', type: 'numeric' }];
  }
};

// Placeholder para a lógica de cálculo - AGORA PRECISA USAR VALORES CONVERTIDOS
const performCalculation = (
  calculationId: string,
  inputs: Record<string, number>, // Valores numéricos dos TextInputs
  selectedUnits: Record<string, string>, // Unidades selecionadas para cada input
  allFieldsConfig: CalculationField[] // Configuração de todos os campos para este cálculo
): Record<string, any> => {

  const convertToBaseUnit = (fieldName: string, value: number): number => {
    const fieldConfig = allFieldsConfig.find(f => f.name === fieldName);
    if (!fieldConfig || fieldConfig.type === 'coefficient') { // Coeficientes não são convertidos
        return value;
    }
    if (fieldConfig.type === 'percentage' && fieldName === 'pumpEfficiency') { // Eficiência é tratada separadamente
        return value / 100;
    }


    const category = fieldToUnitCategory(fieldName);
    const unit = selectedUnits[fieldName] || fieldConfig.defaultInputUnit;

    if (category && unit && fieldConfig.type !== 'percentage') { // Não converte % aqui, só se for pumpEfficiency
      // @ts-ignore Acessando dinamicamente CONVERSION_FACTORS_TO_BASE
      const factor = CONVERSION_FACTORS_TO_BASE[category]?.[unit];
      if (typeof factor === 'number') {
        return value * factor;
      }
    }
    return value; // Retorna valor original se não houver fator/categoria/unidade
  };

  const baseInputs: Record<string, number> = {};
  for (const key in inputs) {
    const fieldConfig = allFieldsConfig.find(f => f.name === key);
    if (fieldConfig?.type === 'percentage' && key === 'pumpEfficiency') {
        baseInputs[key] = (inputs[key] || 0) / 100; // Converte % para decimal
    } else if (fieldConfig?.type !== 'percentage' && fieldConfig?.type !== 'coefficient'){
        baseInputs[key] = convertToBaseUnit(key, inputs[key] || 0);
    } else {
        baseInputs[key] = inputs[key] || 0; // Mantém como está para outros percentages e coefficients
    }
  }
  console.log(`Calculando ${calculationId} com entradas originais:`, inputs, "unidades:", selectedUnits);
  console.log(`Calculando ${calculationId} com entradas base:`, baseInputs);

  switch (calculationId) {
    case 'head-loss': // h_L = K * (V² / 2g) onde V = Q / A
      const Q_hl = baseInputs.flowRate;
      const D_hl = baseInputs.pipeDiameter;
      const A_hl = Math.PI * Math.pow(D_hl / 2, 2);
      const V_hl = A_hl > 0 ? Q_hl / A_hl : 0;
      const K_hl = inputs.lossCoefficient; // Coeficiente K é usado como está (não convertido)
      return { 'Perda de Carga (m)': K_hl * Math.pow(V_hl, 2) / (2 * 9.81) };

    case 'pipe-flow': // Q = (π * ΔP * D⁴) / (128 * μ * L) -- Hagen-Poiseuille
      const dP_pf = baseInputs.pressureDifference;
      const D_pf = baseInputs.pipeDiameter;
      const mu_pf = baseInputs.fluidViscosity; // Viscosidade Dinâmica
      const L_pf = baseInputs.pipeLength;
      return { 'Vazão (m³/s)': (dP_pf * Math.PI * Math.pow(D_pf, 4)) / (128 * mu_pf * L_pf) };

    case 'pressure-drop': // ΔP = f * (L/D) * (ρ * V² / 2) -- Darcy-Weisbach
      const Q_pd = baseInputs.flowRate;
      const L_pd = baseInputs.pipeLength;
      const D_pd = baseInputs.pipeDiameter;
      // const roughness_pd = baseInputs.roughness; // m (não usado na simplificação de 'f')
      const f_pd = 0.02; // Fator de atrito ASSUMIDO. Simplificação!
      const rho_pd_val = allFieldsConfig.find(f=>f.name === 'fluidDensity') ? baseInputs.fluidDensity : 1000; // Usa input se disponível, senão default
      const A_pd = Math.PI * Math.pow(D_pd / 2, 2);
      const V_pd = A_pd > 0 ? Q_pd / A_pd : 0;
      const deltaP_Pa = f_pd * (L_pd/D_pd) * (rho_pd_val * Math.pow(V_pd, 2) / 2);
      return { 'Perda de Pressão (Pa)': deltaP_Pa, 'Fator de Atrito (f)': `${f_pd} (assumido)` };

    case 'pump-power': // P_eixo = (ρ * g * Q * H_t) / η_bomba
      const Q_pp = baseInputs.flowRate;
      const H_pp = baseInputs.head;
      const rho_pp = baseInputs.fluidDensity;
      const eff_pp = baseInputs.pumpEfficiency; // Já em decimal (0-1)
      const g = 9.81;
      const P_watts = eff_pp > 0 ? (rho_pp * g * Q_pp * H_pp) / eff_pp : 0;
      return { 'Potência de Eixo (W)': P_watts, 'Potência de Eixo (kW)': P_watts / 1000 };

    case 'flow-velocity': // V = Q / A
      const Q_fv = baseInputs.flowRate;
      const A_fv_base = baseInputs.pipeArea; // Área já convertida para m²
      return { 'Velocidade (m/s)': A_fv_base > 0 ? Q_fv / A_fv_base : 0 };

    case 'reynolds-number': // Re = (V * D) / ν
      const V_re = baseInputs.fluidVelocity;
      const D_re = baseInputs.characteristicLength; // Diâmetro hidráulico
      const nu_re = baseInputs.kinematicViscosity; // Viscosidade Cinemática
      const Re = nu_re > 0 ? (V_re * D_re) / nu_re : 0;
      let flowRegime = 'Laminar (Re < 2300)';
      if (Re > 4000) flowRegime = 'Turbulento (Re > 4000)';
      else if (Re >= 2300) flowRegime = 'Transição (2300 <= Re <= 4000)';
      return { 'Número de Reynolds': Re, 'Regime de Fluxo': flowRegime }; // Simplificado
    default:
      return { resultado: 'Cálculo não implementado' };
  }
};

const CalculationViewComponent: React.FC<CalculationViewProps> = ({
  calculation,
  onAddToHistory,
}) => {
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
    // Permite números, ponto decimal, e "e" ou "E" para notação científica, opcionalmente um "-" no início.
    if (/^-?\d*\.?\d*(e-?\d+)?$/i.test(value) || value === '' || value === '-') {
        setInputValues((prev) => ({ ...prev, [name]: value }));
    }
    setResult(null);
  };

  const handleCalculate = () => {
    const numericInputs = Object.fromEntries(
      Object.entries(inputValues).map(([key, value]) => {
        const val = parseFloat(value);
        return [key, isNaN(val) ? 0 : val]; // Default to 0 if parsing fails
      })
    );

    // Ajuste da validação para permitir zero em campos que não são estritamente positivos (ex: coeficientes)
    const allRequiredFieldsValid = fields.every(field => {
        const valueStr = inputValues[field.name]?.trim();
        if (!valueStr) { // If valueStr is empty or undefined
             // If the field is numeric, percentage or coefficient, and the parsed value is 0, it's valid.
             // Otherwise, an empty string is not valid.
             const numVal = parseFloat(valueStr || ''); // Parse empty string as NaN
             if (field.type === 'coefficient') { // Only coefficient can be 0 or positive
                return !isNaN(numVal) && numVal >= 0;
             }
             // For numeric and percentage fields, it must be > 0
             if (field.type === 'numeric' || field.type === 'percentage') {
                return !isNaN(numVal) && numVal > 0;
             }
             return false; // For other types, empty is not valid
        }
        const numValue = parseFloat(valueStr);
        if (isNaN(numValue)) return false; // Not a number

        // For fields that cannot be zero or negative
        if (field.type === 'numeric' && numValue <= 0 && field.name !== 'lossCoefficient') {
           return false;
        }
        return true;
    });


    if (!allRequiredFieldsValid) {
        Alert.alert('Entrada Inválida', 'Por favor, preencha todos os campos com valores numéricos válidos. Alguns campos não podem ser zero ou negativos.');
        return;
    }

    const calcResult = performCalculation(calculation.id, numericInputs, selectedInputUnits, fields);
    setResult(calcResult);

    // Salvar inputs com suas unidades selecionadas
    const inputsWithUnits: Record<string, string> = {};
    for (const key in numericInputs) {
        inputsWithUnits[key] = `${numericInputs[key]} ${selectedInputUnits[key] || ''}`;
    }

    onAddToHistory({
      id: `${calculation.id}-${Date.now()}`,
      type: calculation.title,
      timestamp: new Date().toISOString(),
      inputs: inputsWithUnits, // Salva os inputs com suas unidades
      result: calcResult,
    });
  };

  // Função para lidar com a mudança de unidade
  const handleUnitChange = (fieldName: string, unitValue: string) => {
    console.log(`Unidade de entrada para ${fieldName} alterada para: ${unitValue}`); // Log de depuração
    setSelectedInputUnits(prev => ({ ...prev, [fieldName]: unitValue }));
    setResult(null); // Limpa o resultado anterior, pois a unidade de entrada mudou
  };

  const handleResultUnitChange = (resultKey: string, unitValue: string) => {
    console.log(`Unidade de resultado para ${resultKey} alterada para: ${unitValue}`); // Log de depuração
    setSelectedResultUnits(prev => ({ ...prev, [resultKey]: unitValue }));
  };

  const getConvertedResultValue = (resultKey: string, baseValue: number): string => {
    const targetUnit = selectedResultUnits[resultKey];
    if (!targetUnit || typeof baseValue !== 'number') return baseValue.toString();

    let conversionCategoryKey: keyof typeof CONVERSION_FACTORS_FROM_BASE | null = null;
    let actualBaseUnitForConversion = targetUnit; // Se a unidade de resultado for a base, não precisa de categoria

    if (resultKey === 'Perda de Carga (m)') {
        conversionCategoryKey = 'pressure_mH2O';
        if (targetUnit === 'mH2O') actualBaseUnitForConversion = 'mH2O'; // A base é mH2O
    } else if (resultKey === 'Potência de Eixo (W)') {
        conversionCategoryKey = 'power_W';
        if (targetUnit === 'W') actualBaseUnitForConversion = 'W';
    } else if (resultKey === 'Potência de Eixo (kW)') {
        // Se o resultado original é kW, converte para W para usar power_W, depois converte para a unidade alvo
        baseValue = baseValue * 1000; // kW para W
        conversionCategoryKey = 'power_W';
        if (targetUnit === 'kW') return (baseValue / 1000).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 4});
    } else if (resultKey === 'Vazão (m³/s)') {
        conversionCategoryKey = 'flowRate_m3s';
        if (targetUnit === 'm3/s') actualBaseUnitForConversion = 'm3/s';
    } else if (resultKey === 'Velocidade (m/s)') {
        conversionCategoryKey = 'velocity_ms';
        if (targetUnit === 'm/s') actualBaseUnitForConversion = 'm/s';
    } else if (resultKey === 'Perda de Pressão (Pa)') {
        conversionCategoryKey = 'pressure_Pa';
        if (targetUnit === 'Pa') actualBaseUnitForConversion = 'Pa';
    }
    // Adicionar mais mapeamentos de resultKey para conversionCategoryKey aqui

    if (conversionCategoryKey) {
        // @ts-ignore
        const factor = CONVERSION_FACTORS_FROM_BASE[conversionCategoryKey]?.[targetUnit];
        if (typeof factor === 'number') {
            const convertedValue = baseValue * factor;
            return convertedValue.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 4});
        }
    }
    // Se não houver fator ou categoria, ou se a unidade alvo for a base, retorna o valor base formatado
    return baseValue.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 4});
  };


  return (
    <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
    >
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContentContainer}>
      {/* O Header com título e botões de ação (voltar, alternar modo) foi movido para a tela (app/calculation/[id].tsx) */}
      <Text style={styles.description}>{calculation.description}</Text>

      <View style={styles.form}>
        {fields.map((field) => (
          <View key={field.name} style={styles.inputGroup}>
            <Text style={styles.label}>{field.label}:</Text>
            <View style={styles.inputRow}>
              <TextInput
                style={styles.input}
                keyboardType="numeric"
                value={inputValues[field.name]}
                onChangeText={(text) => handleInputChange(field.name, text)}
                placeholder={field.placeholder || `Valor para ${field.label.toLowerCase()}`}
                placeholderTextColor={AppColors.textSecondary}
              />
              {field.unitOptions && field.unitOptions.length > 0 ? (
                <View style={styles.pickerContainer}>
                  {/* Usando um Picker simples para demonstração. Em um app real, react-native-picker-select seria melhor. */}
                  {/* Este Picker básico pode não funcionar bem em todas as plataformas ou pode precisar de mais estilo. */}
                  <Picker
                    selectedValue={selectedInputUnits[field.name] || field.defaultInputUnit}
                    style={styles.picker}
                    onValueChange={(itemValue) => handleUnitChange(field.name, itemValue)}
                    itemStyle={Platform.OS === 'ios' ? styles.pickerItem : undefined} // Aplicar itemStyle condicionalmente para iOS
                  >
                    {field.unitOptions.map(opt => (
                      <Picker.Item key={opt.value} label={opt.label} value={opt.value} />
                    ))}
                  </Picker>
                </View>
              ) : ( // Exibe a unidade base se não houver opções
                 <Text style={styles.unitStaticDisplay}>{selectedInputUnits[field.name] || field.baseUnit}</Text>
              )}
            </View>
          </View>
        ))}
        <TouchableOpacity style={styles.calculateButton} onPress={handleCalculate}>
            <CheckSquare size={20} color={AppColors.buttonText} />
            <Text style={styles.calculateButtonText}>Calcular</Text>
        </TouchableOpacity>
      </View>

      {result && (
        <View style={styles.resultContainer}>
          <Text style={styles.resultTitle}>Resultado:</Text>
          {Object.entries(result).map(([key, value]) => {
            const unitOptions = RESULT_UNIT_OPTIONS[key];
            const originalValueIsNumber = typeof value === 'number';

            if (key === 'Regime de Fluxo' || key.toLowerCase().includes('fator de atrito')) { // Campos não numéricos ou não conversíveis
              return (
                <View key={key} style={styles.resultItem}>
                  <Text style={styles.resultKey}>{key.charAt(0).toUpperCase() + key.slice(1)}:</Text>
                  <Text style={styles.resultValue}>{value.toString()}</Text>
                </View>
              );
            }

            return (
              <View key={key} style={styles.resultItem}>
                {/* O label do resultado sempre acima do valor e do picker */}
                <Text style={styles.resultKey}>{key.charAt(0).toUpperCase() + key.slice(1)}:</Text>
                <View style={styles.resultValueContainer}>
                  <Text style={styles.resultValue}>
                    {originalValueIsNumber ? getConvertedResultValue(key, value) : value.toString()}
                  </Text>
                  {unitOptions && originalValueIsNumber && (
                    <View style={styles.resultPickerContainer}>
                      <Picker
                        selectedValue={selectedResultUnits[key] || unitOptions[0].value}
                        style={styles.picker} // Reutilizando estilo do picker de input
                        onValueChange={(itemValue) => handleResultUnitChange(key, itemValue)}
                        itemStyle={Platform.OS === 'ios' ? styles.pickerItem : undefined} // Aplicar itemStyle condicionalmente
                      >
                        {unitOptions.map(opt => (
                          <Picker.Item key={opt.value} label={opt.label} value={opt.value} />
                        ))}
                      </Picker>
                    </View>
                  )}
                </View>
              </View>
            );
          })}
        </View>
      )}
    </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColors.background,
  },
  scrollContentContainer: {
    padding: 16,
    paddingBottom: 30,
  },
  // Header styles foram removidos daqui pois o header é gerenciado pelo Stack Navigator na tela
  description: {
    fontSize: 15,
    color: AppColors.textSecondary,
    marginBottom: 24,
    textAlign: 'center',
    paddingHorizontal: 10,
  },
  form: {
    backgroundColor: AppColors.cardBackground,
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    marginBottom: 6,
    color: AppColors.text,
    fontWeight: '500',
  },
  inputRow: { // Novo estilo para agrupar TextInput e Picker
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1, // TextInput ocupa o espaço restante
    borderWidth: 1,
    borderColor: AppColors.inputBorder,
    backgroundColor: AppColors.inputBackground,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: Platform.OS === 'ios' ? 12 : 10,
    fontSize: 16,
    color: AppColors.text,
    marginRight: 8, // Espaço entre input e picker
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: AppColors.inputBorder,
    borderRadius: 8,
    backgroundColor: AppColors.inputBackground,
    minWidth: 140, // Aumentado para garantir que o texto não seja cortado
    height: Platform.OS === 'ios' ? undefined : 50, // Altura para Android para alinhar com TextInput
    justifyContent: 'center', // Para Android
  },
  picker: {
    height: Platform.OS === 'ios' ? undefined : 50, // Altura para Android
    width: Platform.OS === 'ios' ? undefined : '100%', // Largura para Android
    color: AppColors.text,
  },
  pickerItem: { // Apenas iOS
    fontSize: 16,
    color: AppColors.text,
  },
  unitStaticDisplay: {
    fontSize: 16,
    color: AppColors.textSecondary,
    paddingHorizontal: 10,
    alignSelf: 'center',
  },
  calculateButton: {
    backgroundColor: AppColors.primary,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 8,
  },
  calculateButtonText: {
    color: AppColors.buttonText,
    fontSize: 17,
    fontWeight: '600',
    marginLeft: 8,
  },
  resultContainer: {
    marginTop: 12,
    padding: 16,
    backgroundColor: AppColors.resultBackground,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: AppColors.primary,
  },
  resultTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
    color: AppColors.resultText,
  },
  resultItem: {
    flexDirection: 'column', // Alterado para empilhar label e valor
    marginBottom: 12, // Espaçamento maior entre os itens de resultado
    paddingVertical: 4,
  },
  resultKey: {
    fontSize: 16,
    color: AppColors.resultText,
    fontWeight: '500',
    marginBottom: 4, // Espaçamento entre o label e o valor
  },
  resultValue: {
    fontSize: 16,
    color: AppColors.resultText,
    fontWeight: 'bold',
    // Não mais `textAlign: 'right'` aqui, pois o contêiner gerencia o alinhamento
    flexShrink: 1,
  },
  resultValueContainer: { // Para agrupar valor e picker de resultado
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end', // Alinha o valor e o picker à direita
    flexShrink: 1, // Garante que não empurre o resultKey para fora
  },
  resultPickerContainer: { // Container para o Picker de unidade de resultado
    marginLeft: 8,
    minWidth: 120, // **Aumentado para garantir que o texto não seja cortado**
    borderWidth: 1,
    borderColor: AppColors.inputBorder, // Reutilizando cor da borda do input
    borderRadius: 6,
    height: Platform.OS === 'ios' ? undefined : 40, // Altura menor para resultado
    justifyContent: 'center',
  },
});

export default CalculationViewComponent;