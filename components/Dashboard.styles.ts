import { StyleSheet } from 'react-native';
import { AppColors } from '@/constants/colors'; // Importando de constants

export const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: AppColors.cardBackground, // Usando cor global
  },
  container: {
    flex: 1,
    backgroundColor: AppColors.background, // Usando cor global
  },
  scrollContentContainer: {
    paddingBottom: 20,
  },
  headerContainer: { // Estilo para o DashboardHeader
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: AppColors.cardBackground,
    borderBottomWidth: 1,
    borderBottomColor: AppColors.borderColor,
    marginBottom: 8,
  },
  headerTitle: { // Estilo para o título no DashboardHeader
    fontSize: 20,
    fontWeight: '600',
    marginLeft: 12,
    color: AppColors.text,
  },
  categorySection: {
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  categoryTitle: {
    fontSize: 17,
    fontWeight: '600',
    marginBottom: 8,
    color: AppColors.textSecondary,
  },
  // Os estilos específicos de CalculationCard e HistorySummary
  // foram movidos para seus respectivos arquivos .styles.ts
});
