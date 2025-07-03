import React, { useState, useEffect, useCallback } from 'react';
import { Platform } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { SplashScreen as ExpoSplashScreen, Stack } from 'expo-router';

// Ocultar o splash screen nativo do sistema assim que o JavaScript carregar
ExpoSplashScreen.preventAutoHideAsync();

const AppColors = {
  primary: '#007AFF',
  background: Platform.OS === 'ios' ? '#F2F2F7' : '#FFFFFF', // iOS usa um cinza mais claro para fundo de tela
  headerBackground: Platform.OS === 'ios' ? '#F9F9F9' : '#007AFF', // iOS tem header quase branco, Android pode usar cor primária
  headerText: Platform.OS === 'ios' ? '#007AFF' : '#FFFFFF',
  headerTintColor: Platform.OS === 'ios' ? '#007AFF' : '#FFFFFF',
};

export default function RootLayout() {
  const [appIsReady, setAppIsReady] = useState(false);

  useEffect(() => {
    async function prepareApp() {
      try {
        // Aqui podem entrar tarefas como carregamento de fontes, etc.
        // await Font.loadAsync({ ... });
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
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: AppColors.headerBackground,
          },
          headerTintColor: AppColors.headerTintColor,
          headerTitleStyle: {
            fontWeight: 'bold',
            color: AppColors.headerText,
          },
          headerBackTitleVisible: false,
        }}
      >
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen
          name="dashboard"
          options={{
            title: 'Hydro Calculator',
            headerShown: false, // O Dashboard já tem um header customizado
          }}
        />
        <Stack.Screen
          name="calculation/[id]"
          options={{
            // O título será definido dinamicamente na própria tela
            // e o botão de voltar é adicionado automaticamente.
            headerShown: true,
          }}
        />
        <Stack.Screen
          name="learning/[id]"
          options={{
            // O título será definido dinamicamente na própria tela
            // e o botão de voltar é adicionado automaticamente.
            headerShown: true,
          }}
        />
      </Stack>
    </SafeAreaProvider>
  );
}
