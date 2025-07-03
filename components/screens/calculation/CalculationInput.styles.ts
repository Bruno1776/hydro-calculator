import { StyleSheet, Platform } from 'react-native';
import { AppColors } from '@/constants/colors'; // Importando de constants

export const calculationInputStyles = StyleSheet.create({
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    marginBottom: 6,
    color: AppColors.text,
    fontWeight: '500',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: AppColors.inputBorder,
    backgroundColor: AppColors.inputBackground,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: Platform.OS === 'ios' ? 12 : 10,
    fontSize: 16,
    color: AppColors.text,
    marginRight: 8,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: AppColors.inputBorder,
    borderRadius: 8,
    backgroundColor: AppColors.inputBackground,
    minWidth: 140,
    height: Platform.OS === 'ios' ? undefined : 50,
    justifyContent: 'center',
  },
  picker: {
    height: Platform.OS === 'ios' ? undefined : 50,
    width: Platform.OS === 'ios' ? undefined : '100%',
    color: AppColors.text,
  },
  pickerItem: { // Apenas iOS
    fontSize: 16,
    color: AppColors.text, // Cor do texto dos itens do Picker no iOS
  },
  unitStaticDisplay: {
    fontSize: 16,
    color: AppColors.textSecondary,
    paddingHorizontal: 10,
    alignSelf: 'center',
  },
});
