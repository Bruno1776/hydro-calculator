import { StyleSheet, Platform } from 'react-native';
import { AppColors } from '@/constants/colors'; // Importando de constants

export const calculationResultStyles = StyleSheet.create({
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
    flexDirection: 'column',
    marginBottom: 12,
    paddingVertical: 4,
  },
  resultKey: {
    fontSize: 16,
    color: AppColors.resultText,
    fontWeight: '500',
    marginBottom: 4,
  },
  resultValue: {
    fontSize: 16,
    color: AppColors.resultText,
    fontWeight: 'bold',
    flexShrink: 1,
  },
  resultValueContainer: {
    flexDirection: 'row',
    alignItems: 'center', // Garante que os itens na linha estejam centralizados verticalmente
    justifyContent: 'space-between',
  },
  resultPickerContainer: {
    marginLeft: 8,
    minWidth: 120,
    borderWidth: 1,
    borderColor: AppColors.inputBorder,
    borderRadius: 6,
    backgroundColor: AppColors.inputBackground,
    height: 40, // Definir uma altura fixa e consistente para ambas as plataformas
    justifyContent: 'center', // Centraliza o Picker verticalmente dentro do container
  },
  picker: {
    height: 100, // Definir uma altura fixa e consistente para o Picker em ambas as plataformas
    width: '100%', // Usar largura total do container
    color: AppColors.text,
  },
  pickerItem: { // Apenas iOS
    fontSize: 16,
    color: AppColors.text,
  },
});