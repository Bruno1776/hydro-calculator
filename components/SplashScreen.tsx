import React, { useEffect } from 'react';
import { View, Text, ActivityIndicator, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { Droplet } from 'lucide-react-native';
import { styles } from './SplashScreen.styles'; // AppColors não é mais exportado daqui
import { AppColors } from '@/constants/colors'; // Importando de constants

const SplashScreenComponent = () => {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace('/dashboard');
    }, 3000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <View style={styles.container}>
      <Droplet
        size={Dimensions.get('window').width * 0.2}
        color={AppColors.white}
        style={styles.icon}
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
