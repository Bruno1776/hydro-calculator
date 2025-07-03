import { StyleSheet, Platform } from 'react-native';
import { AppColors } from '@/constants/colors'; // Importando de constants

export const calculationCardStyles = StyleSheet.create({
  card: {
    backgroundColor: AppColors.cardBackground,
    borderRadius: 10,
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
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
  },
  cardIcon: {
    fontSize: 24, // Emoji ou ícone textual
    marginRight: 12,
    color: AppColors.primary, // Ícone com cor primária para destaque
  },
  cardTextContainer: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '500', // Semibold
    color: AppColors.text,
    marginBottom: 2,
  },
  cardDescription: {
    fontSize: 13,
    color: AppColors.textSecondary,
    marginBottom: 4,
  },
  cardCategory: {
    fontSize: 12,
    color: AppColors.secondary, // Usando cor secundária para categoria
    fontStyle: 'italic',
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end', // Alinhar botão de aprender à direita
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: AppColors.borderColor,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  actionButton: { // Botão "Aprender"
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 6,
    backgroundColor: AppColors.buttonBlueBackground, // Fundo azul claro
  },
  actionText: { // Texto do botão "Aprender"
    marginLeft: 6,
    fontSize: 14,
    fontWeight: '500',
    color: AppColors.primary, // Texto do botão na cor primária
  },
  chevron: {
    marginLeft: 'auto', // Empurra o chevron para a direita
    color: AppColors.borderColor,
  }
});
