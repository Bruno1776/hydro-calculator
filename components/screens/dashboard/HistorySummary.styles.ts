import { StyleSheet, Platform } from 'react-native';
import { AppColors } from '@/constants/colors'; // Importando de constants

export const historySummaryStyles = StyleSheet.create({
  historySection: {
    marginTop: 16,
    marginHorizontal: 16,
    padding: 12,
    backgroundColor: AppColors.cardBackground,
    borderRadius: 10,
    ...Platform.select({
      ios: {
        shadowColor: AppColors.text, // Usando preto para sombra
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.08,
        shadowRadius: 2,
      },
      android: {
        elevation: 1,
      },
    }),
  },
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: AppColors.borderColor,
  },
  sectionTitle: { // Usado para "Histórico de Cálculos"
    fontSize: 17,
    fontWeight: '600',
    marginLeft: 8,
    color: AppColors.text,
  },
  historySummaryText: { // "Você tem X cálculo(s)..."
    fontSize: 14,
    color: AppColors.textSecondary,
    textAlign: 'center',
    marginBottom: 8,
  },
  viewHistoryButton: { // Botão "Ver Histórico Completo"
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: AppColors.buttonBlueBackground,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginTop: 8,
  },
  viewHistoryButtonText: {
    fontSize: 16,
    color: AppColors.primary,
    fontWeight: '500',
  },
  emptyHistoryText: { // "Nenhum cálculo realizado ainda."
    textAlign: 'center',
    color: AppColors.textSecondary,
    marginTop: 15,
    marginBottom: 10,
    fontSize: 14,
  },
});
