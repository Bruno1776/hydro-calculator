import { StyleSheet, Dimensions } from 'react-native';
import { AppColors } from '@/constants/colors';

const { width, height } = Dimensions.get('window');

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColors.white, // Ou a cor de fundo da sua splash
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden', // Importante para cortar a animação quando estiver fora da tela
  },
  lottieAnimationContainer: {
    position: 'absolute',
    
    width: '100%',
    height: '150%', // Pode ser maior que 100% se a onda for grande
    bottom: 0, // Posiciona o container na parte inferior
    // Isso é importante: o LottieView dentro dele vai ter 100% da altura desse container
    // e o `translateY` vai mover todo o container para cima.
  },
  lottieAnimation: {
    width: '100%',
    height: '100%',
    // Se sua animação Lottie for uma onda que preenche a parte inferior,
    // talvez você queira que ela seja maior que a tela para "transbordar" e simular profundidade.
    // Exemplo: height: height * 1.5, para que a onda comece mais "fundo"
  },
  headerImage: {
    width: 150,
    height: 150,
    resizeMode: 'contain',
    marginBottom: 20,
    zIndex: 1, // Garante que a imagem fique acima da animação
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: AppColors.white,
    marginBottom: 10,
    zIndex: 1, // Garante que o texto fique acima da animação
  },
  activityIndicator: {
    marginTop: 20,
    zIndex: 1, // Garante que o indicador fique acima da animação
  },
  subtitle: {
    fontSize: 18,
    color: AppColors.white,
    marginTop: 10,
    zIndex: 1, // Garante que o texto fique acima da animação
  },
});