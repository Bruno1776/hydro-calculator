import { StyleSheet, Platform } from 'react-native';
import { AppColors } from '@/constants/colors'; // Importando de constants

export const historyViewStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColors.background,
  },
  centered: { // Para mensagens de loading ou lista vazia
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  listContentContainer: {
    padding: 16,
  },
  loadingText: { // Texto "Carregando histórico..."
    marginTop: 10,
    color: AppColors.textSecondary,
    fontSize: 14,
  },
  emptyHistoryText: { // "Nenhum cálculo no histórico."
    fontSize: 16,
    color: AppColors.textSecondary,
    marginTop: 16,
    textAlign: 'center',
  },
  // Estilos do Header Button não são mais necessários aqui, pois são tratados na tela (app/history.tsx)
  // Estilos do HistoryListItem foram movidos para HistoryListItem.styles.ts
});
