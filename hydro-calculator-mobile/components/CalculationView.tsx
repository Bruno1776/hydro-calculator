import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView, TouchableOpacity, Platform, KeyboardAvoidingView } from 'react-native';
import { CalculationType, CalculationHistory } from '@/types/calculation';
import { CheckSquare } from 'lucide-react-native';

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

// Placeholder para os campos de cada tipo de cálculo
const getCalculationFields = (calculationId: string): { name: string; label: string; unit: string; placeholder?: string }[] => {
  switch (calculationId) {
    case 'head-loss':
      return [
        { name: 'flowRate', label: 'Vazão', unit: 'm³/s', placeholder: 'Ex: 0.5' },
        { name: 'pipeDiameter', label: 'Diâmetro da Tubulação', unit: 'm', placeholder: 'Ex: 0.1' },
        { name: 'lossCoefficient', label: 'Coeficiente de Perda (K)', unit: '', placeholder: 'Ex: 0.75' },
      ];
    case 'pipe-flow':
      return [
        { name: 'pressureDifference', label: 'Diferença de Pressão', unit: 'Pa', placeholder: 'Ex: 10000' },
        { name: 'pipeLength', label: 'Comprimento da Tubulação', unit: 'm', placeholder: 'Ex: 100' },
        { name: 'pipeDiameter', label: 'Diâmetro da Tubulação', unit: 'm', placeholder: 'Ex: 0.05' },
        { name: 'fluidViscosity', label: 'Viscosidade Dinâmica (µ)', unit: 'Pa·s', placeholder: 'Ex: 0.001' },
      ];
    case 'pressure-drop':
       return [
        { name: 'flowRate', label: 'Vazão', unit: 'L/s', placeholder: 'Ex: 10' },
        { name: 'pipeLength', label: 'Comprimento', unit: 'm', placeholder: 'Ex: 50' },
        { name: 'pipeDiameter', label: 'Diâmetro Interno', unit: 'mm', placeholder: 'Ex: 50' },
        { name: 'roughness', label: 'Rugosidade (ε)', unit: 'mm', placeholder: 'Ex: 0.05' },
      ];
    case 'pump-power':
      return [
        { name: 'flowRate', label: 'Vazão (Q)', unit: 'm³/s', placeholder: 'Ex: 0.1' },
        { name: 'head', label: 'Altura Manométrica (H)', unit: 'm', placeholder: 'Ex: 20' },
        { name: 'fluidDensity', label: 'Densidade do Fluido (ρ)', unit: 'kg/m³', placeholder: 'Ex: 1000' },
        { name: 'pumpEfficiency', label: 'Eficiência da Bomba (η)', unit: '%', placeholder: 'Ex: 75' },
      ];
    case 'flow-velocity':
      return [
        { name: 'flowRate', label: 'Vazão (Q)', unit: 'm³/s', placeholder: 'Ex: 0.2' },
        { name: 'pipeArea', label: 'Área da Seção (A)', unit: 'm²', placeholder: 'Ex: 0.00785' },
      ];
    case 'reynolds-number':
      return [
        { name: 'fluidVelocity', label: 'Velocidade (V)', unit: 'm/s', placeholder: 'Ex: 1.5' },
        { name: 'characteristicLength', label: 'Diâmetro (D)', unit: 'm', placeholder: 'Ex: 0.1' },
        { name: 'kinematicViscosity', label: 'Viscosidade Cinemática (ν)', unit: 'm²/s', placeholder: 'Ex: 1e-6' },
      ];
    default:
      return [{ name: 'param1', label: 'Parâmetro 1', unit: '', placeholder: 'Valor' }];
  }
};

// Placeholder para a lógica de cálculo
const performCalculation = (calculationId: string, inputs: Record<string, number>): Record<string, any> => {
  console.log(`Calculando ${calculationId} com entradas:`, inputs);
  switch (calculationId) {
    case 'head-loss':
      const Q_hl = inputs.flowRate || 0;
      const D_hl = inputs.pipeDiameter || 1;
      const A_hl = Math.PI * Math.pow(D_hl / 2, 2);
      const V_hl = A_hl > 0 ? Q_hl / A_hl : 0;
      const K_hl = inputs.lossCoefficient || 0;
      return { 'Perda de Carga (m)': K_hl * Math.pow(V_hl, 2) / (2 * 9.81) };
    case 'pipe-flow':
      const dP_pf = inputs.pressureDifference || 0;
      const D_pf = inputs.pipeDiameter || 1;
      const mu_pf = inputs.fluidViscosity || 1;
      const L_pf = inputs.pipeLength || 1;
      return { 'Vazão (m³/s)': (dP_pf * Math.PI * Math.pow(D_pf, 4)) / (128 * mu_pf * L_pf) };
    case 'pressure-drop':
      const Q_pd = (inputs.flowRate || 0) / 1000;
      const L_pd = inputs.pipeLength || 0;
      const D_pd = (inputs.pipeDiameter || 1) / 1000;
      const f_pd = 0.02;
      const rho_pd = 1000;
      const A_pd = Math.PI * Math.pow(D_pd / 2, 2);
      const V_pd = A_pd > 0 ? Q_pd / A_pd : 0;
      return { 'Perda de Pressão (Pa)': f_pd * (L_pd/D_pd) * (rho_pd * Math.pow(V_pd, 2) / 2) };
    case 'pump-power':
      const Q_pp = inputs.flowRate || 0;
      const H_pp = inputs.head || 0;
      const rho_pp = inputs.fluidDensity || 1000;
      const eff_pp = (inputs.pumpEfficiency || 75) / 100;
      return { 'Potência (W)': eff_pp > 0 ? (rho_pp * 9.81 * Q_pp * H_pp) / eff_pp : 'Eficiência inválida' };
    case 'flow-velocity':
      const Q_fv = inputs.flowRate || 0;
      const A_fv = inputs.pipeArea || 1;
      return { 'Velocidade (m/s)': A_fv > 0 ? Q_fv / A_fv : 0 };
    case 'reynolds-number':
      const V_re = inputs.fluidVelocity || 0;
      const D_re = inputs.characteristicLength || 0;
      const nu_re = inputs.kinematicViscosity || 1e-6;
      const Re = nu_re > 0 ? (V_re * D_re) / nu_re : 0;
      let flowRegime = 'Laminar';
      if (Re > 4000) flowRegime = 'Turbulento';
      else if (Re >= 2300) flowRegime = 'Transiente';
      return { 'Número de Reynolds': Re, 'Regime de Fluxo': flowRegime };
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

  const handleInputChange = (name: string, value: string) => {
    if (/^\d*\.?\d*$/.test(value) || value === '') {
        setInputValues((prev) => ({ ...prev, [name]: value }));
    }
    setResult(null);
  };

  const handleCalculate = () => {
    const numericInputs = Object.fromEntries(
      Object.entries(inputValues).map(([key, value]) => [key, parseFloat(value) || 0])
    );
    const allFieldsFilled = fields.every(field => inputValues[field.name].trim() !== '');
    if (!allFieldsFilled) {
        alert('Por favor, preencha todos os campos.');
        return;
    }

    const calcResult = performCalculation(calculation.id, numericInputs);
    setResult(calcResult);
    onAddToHistory({
      id: `${calculation.id}-${Date.now()}`,
      type: calculation.title,
      timestamp: new Date().toISOString(),
      inputs: numericInputs,
      result: calcResult,
    });
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
            <Text style={styles.label}>{field.label} <Text style={styles.unitText}>({field.unit || '-'})</Text>:</Text>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              value={inputValues[field.name]}
              onChangeText={(text) => handleInputChange(field.name, text)}
              placeholder={field.placeholder || `Valor para ${field.label.toLowerCase()}`}
              placeholderTextColor={AppColors.textSecondary}
            />
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
          {Object.entries(result).map(([key, value]) => (
             <View key={key} style={styles.resultItem}>
                <Text style={styles.resultKey}>{key.charAt(0).toUpperCase() + key.slice(1)}:</Text>
                <Text style={styles.resultValue}>
                    {typeof value === 'number' ? value.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 4}) : value.toString()}
                </Text>
             </View>
          ))}
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
  unitText: {
    fontSize: 13,
    color: AppColors.textSecondary,
    fontWeight: 'normal',
  },
  input: {
    borderWidth: 1,
    borderColor: AppColors.inputBorder,
    backgroundColor: AppColors.inputBackground,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: Platform.OS === 'ios' ? 12 : 10,
    fontSize: 16,
    color: AppColors.text,
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
    paddingVertical: 4,
  },
  resultKey: {
    fontSize: 16,
    color: AppColors.resultText,
    fontWeight: '500',
  },
  resultValue: {
    fontSize: 16,
    color: AppColors.resultText,
    fontWeight: 'bold',
    textAlign: 'right',
    flexShrink: 1,
  },
});

export default CalculationViewComponent; // Renomeado para evitar conflito com nome de diretório/tela
