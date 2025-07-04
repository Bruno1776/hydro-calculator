import React, { useEffect, useRef } from 'react';
import { View, Text, ActivityIndicator, Image, Animated, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import LottieView from 'lottie-react-native';
import { AppColors } from '@/constants/colors';
import { styles } from './SplashScreen.styles'; // Seus estilos existentes

const { height } = Dimensions.get('window'); // Pega a altura da tela

const SplashScreenComponent = () => {
  const router = useRouter();
  const waveAnimation = useRef(new Animated.Value(height)).current; // Inicia a animação fora da tela (embaixo)

  useEffect(() => {
    // Animação para a onda subir
    Animated.timing(waveAnimation, {
      toValue: 0, // Posição final: topo da tela (ou onde você quer que a onda comece)
      duration: 2000, // Duração da animação em milissegundos
      useNativeDriver: true, // Use o driver nativo para melhor performance
    }).start();

    // Redireciona após um tempo, ou depois que a animação terminar
    const timer = setTimeout(() => {
      //router.replace('/dashboard');
    }, 3000); // 3 segundos, ajuste conforme a duração total desejada

    return () => clearTimeout(timer);
  }, [router, waveAnimation]);

  return (
    <View style={styles.container}>
      {/* Animação Lottie de Ondas */}
      <Animated.View
        style={[
          styles.lottieAnimationContainer,
          {
            transform: [{ translateY: waveAnimation }], // Aplica a animação de subida
          },
        ]}
      >
        <LottieView
          source={require('../assets/animation/Animation-Wave.json')} // Certifique-se de que este é o caminho correto para sua animação Lottie
          autoPlay
          loop
          style={styles.lottieAnimation} // Estilos para o LottieView em si
          resizeMode="cover"
          
        />
      </Animated.View>

      {/* Conteúdo da SplashScreen */}
      <Image
        source={require('../assets/LogosGrupoNovaes_10.png')}
        style={styles.headerImage}
      />
      <Text style={styles.title}>Hydro Calculator</Text>
      
      <ActivityIndicator
        size="large"
        color={AppColors.white}
        style={styles.activityIndicator}
      />
      <Text style={styles.subtitle}>Calculando o futuro da água...</Text>
    </View>
  );
};

export default SplashScreenComponent;