import { StyleSheet } from 'react-native';
import { AppColors } from '@/constants/colors'; // Importando de constants

export const styles = StyleSheet.create({
  headerImage:{
    
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: AppColors.primary,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: AppColors.white,
    marginTop: 20,
    marginBottom: 30,
    textAlign: 'center',
  },
  activityIndicator: {
    marginBottom: 15,
  },
  subtitle: {
    fontSize: 16,
    color: AppColors.lightGrey,
    fontStyle: 'italic',
  },
  icon: {
    // Estilos para o ícone podem ser adicionados aqui se necessário
  }
});
