import { StyleSheet, Platform } from 'react-native';
import { AppColors } from '@/constants/colors'; // Importando de constants

export const historyListItemStyles = StyleSheet.create({
  historyCard: {
    backgroundColor: AppColors.cardBackground,
    borderRadius: 10,
    padding: 16,
    marginBottom: 12,
    ...Platform.select({
      ios: {
        shadowColor: AppColors.text, // Usando preto para sombra
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  historyCardTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: AppColors.primary, // Usando cor primária
    marginBottom: 4,
  },
  historyCardDate: {
    fontSize: 12,
    color: AppColors.textSecondary,
    marginBottom: 12,
  },
  historyDetailsSection: {
    marginBottom: 8,
  },
  historySectionTitle: { // "Entradas:", "Resultados:"
    fontSize: 15,
    fontWeight: '500',
    color: AppColors.text,
    marginBottom: 6,
    borderBottomWidth: 1,
    borderBottomColor: AppColors.borderColor,
    paddingBottom: 4,
  },
  historyDetailText: { // Texto de cada detalhe (chave: valor)
    fontSize: 14,
    color: AppColors.textSecondary,
    marginBottom: 3,
    lineHeight: 20,
  },
  historyDetailKey: { // Chave do detalhe (ex: "Vazão:")
    fontWeight: '500',
    color: AppColors.text, // Chave com cor de texto principal
  },
});
