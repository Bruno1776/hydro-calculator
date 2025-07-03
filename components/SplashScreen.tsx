import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { Droplet } from 'lucide-react-native'; // Ícone de gota

const SplashScreen = () => {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace('/dashboard');
    }, 3000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <View style={styles.container}>
      <Droplet size={Dimensions.get('window').width * 0.2} color="#FFFFFF" />
      <Text style={styles.title}>Hydro Calculator</Text>
      <ActivityIndicator size="large" color="#FFFFFF" style={styles.activityIndicator} />
      <Text style={styles.subtitle}>Calculando o futuro da água...</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#007AFF', // Azul primário (sugestão, pode ser ajustado)
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: 20, // Espaçamento após o ícone
    marginBottom: 30, // Espaçamento antes do ActivityIndicator
    textAlign: 'center',
  },
  activityIndicator: {
    marginBottom: 15,
  },
  subtitle: {
    fontSize: 16,
    color: '#EFEFEF', // Um cinza claro para contraste suave
    fontStyle: 'italic',
  },
});

export default SplashScreen;
