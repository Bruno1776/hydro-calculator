import { Platform } from 'react-native';

export const AppColors = {
  primary: '#007AFF', // Azul primário
  secondary: '#5856D6', // Roxo secundário
  background: '#F2F2F7', // Cinza claro (iOS system background)
  cardBackground: '#FFFFFF', // Branco para cards
  text: '#000000', // Preto para texto principal
  textSecondary: '#3C3C4399', // Cinza para texto secundário/descrições (iOS secondary label)
  inputBorder: '#C7C7CC', // Cinza para bordas de input (iOS separator)
  inputBackground: '#FFFFFF', // Branco para fundo de input
  buttonText: '#FFFFFF', // Branco para texto de botão primário
  buttonBlueBackground: '#EBF5FF', // Fundo azul claro para botões de ação secundária
  resultBackground: '#EBF5FF', // Azul claro para container de resultado
  resultText: '#003366', // Azul escuro para texto de resultado
  accentGreen: '#34C759', // Verde para sucesso/concluído
  accentRed: '#FF3B30', // Vermelho para erro/limpar
  white: '#FFFFFF',
  lightGrey: '#EFEFEF', // Cinza muito claro
  borderColor: '#C7C7CC', // Cor de borda genérica (igual a inputBorder)

  // Cores específicas de plataforma (exemplo)
  headerText: Platform.OS === 'ios' ? '#007AFF' : '#FFFFFF',
  learnButtonBackground: Platform.OS === 'android' ? '#FFF3E0' : 'transparent', // Usado em CalculationScreen
};

// Pode-se adicionar um objeto de tema mais completo se necessário,
// incluindo fontes, espaçamentos, etc.
// export const theme = {
//   colors: AppColors,
//   spacing: {
//     small: 8,
//     medium: 16,
//     large: 24,
//   },
//   typography: {
//     // ...
//   }
// }
