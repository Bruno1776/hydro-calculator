import React, { useState, useEffect, useCallback } from 'react';
import { Platform, StatusBar } from 'react-native'; // Importe StatusBar
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { SplashScreen as ExpoSplashScreen, Stack } from 'expo-router';
import { AppColors } from '@/constants/colors';

ExpoSplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [appIsReady, setAppIsReady] = useState(false);

  useEffect(() => {
    async function prepareApp() {
      try {
        // ... (seu código de preparação do app)
      } catch (e) {
        console.warn("Erro na preparação do RootLayout:", e);
      } finally {
        setAppIsReady(true);
      }
    }
    prepareApp();
  }, []);

  const onLayoutRootView = useCallback(async () => {
    if (appIsReady) {
      await ExpoSplashScreen.hideAsync();
    }
  }, [appIsReady]);

  if (!appIsReady) {
    return null;
  }

  return (
    <SafeAreaProvider onLayout={onLayoutRootView}>
      {/* Opção 1: Desabilitar completamente a barra de status */}
      <StatusBar hidden={true} />
      {/* --- */}

      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: AppColors.primary,
          },
          headerTintColor: AppColors.white,
          headerTitleStyle: {
            fontWeight: 'bold',
            color: AppColors.headerText,
          },
          headerBackVisible: false
        }}
      >
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen
          name="dashboard"
          options={{
            title: 'Hydro Calculator',
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="calculation/[id]"
          options={{
            headerShown: true,
          }}
        />
        <Stack.Screen
          name="learning/[id]"
          options={{
            headerShown: true,
          }}
        />
        <Stack.Screen
          name="history"
          options={{
            title: 'Histórico de Cálculos',
            headerShown: true,
          }}
        />
      </Stack>
    </SafeAreaProvider>
  );
}