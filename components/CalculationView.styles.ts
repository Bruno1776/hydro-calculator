import { StyleSheet } from 'react-native';
import { AppColors } from '@/constants/colors'; // Importando de constants

export const styles = StyleSheet.create({
  fullScreenContainer: { // Novo container que ocupa a tela inteira
    flex: 1,
    backgroundColor: AppColors.background,
  },
  keyboardAvoidingView: {
    flex: 1, // Permite que o KeyboardAvoidingView ocupe o espaço restante
  },
  scrollViewContent: { // Estilo para o ScrollView principal
    flex: 1, // Permite que o ScrollView ocupe o espaço restante dentro do KeyboardAvoidingView
  },
  scrollContentContainer: {
    padding: 16,
    paddingBottom: 30, // Garante espaço no final da rolagem antes do footer
  },
  description: { // Estilo para a descrição do cálculo em CalculationView.tsx
    fontSize: 15,
    color: AppColors.textSecondary,
    marginBottom: 24,
    textAlign: 'center',
    paddingHorizontal: 10,
  },
  footerContainer: {
    backgroundColor: AppColors.cardBackground, // Cor de fundo do footer
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: AppColors.borderColor,
    paddingVertical: 10, // Adicione um padding vertical para espaçamento interno
  },
  footerLogoText: { // Estilo para o texto placeholder da logo
    fontSize: 18,
    fontWeight: 'bold',
    color: AppColors.textSecondary,
  },
  // Se você tiver uma imagem de logo, use:
  // footerLogo: {
  //   width: 100, // Ajuste conforme o tamanho da sua logo
  //   height: 50, // Ajuste conforme o tamanho da sua logo
  //   resizeMode: 'contain',
  // },
});