import { StyleSheet } from 'react-native';
import { AppColors } from '@/constants/colors'; // Importando de constants

// Os estilos de Form, Input e Result foram movidos para seus respectivos componentes.
// AppColors foi removido daqui.

export const styles = StyleSheet.create({
  container: { // Estilo para o ScrollView principal em CalculationView.tsx
    flex: 1,
    backgroundColor: AppColors.background,
  },
  scrollContentContainer: {
    padding: 16,
    paddingBottom: 30, // Garante espaço no final da rolagem
  },
  description: { // Estilo para a descrição do cálculo em CalculationView.tsx
    fontSize: 15,
    color: AppColors.textSecondary,
    marginBottom: 24,
    textAlign: 'center',
    paddingHorizontal: 10,
  },
  // Os demais estilos (form, inputGroup, resultContainer, etc.)
  // foram movidos para os arquivos .styles.ts dos subcomponentes.
});
