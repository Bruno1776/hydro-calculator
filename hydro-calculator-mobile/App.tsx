import React, { useState, useEffect, useCallback } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Slot, SplashScreen as ExpoSplashScreen, useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Font from 'expo-font';
import { CalculationHistory, CalculationType, calculationsData, ViewMode } from './types/calculation'; // Ajustado para o local correto

// Ocultar o splash screen nativo assim que o JavaScript carregar
ExpoSplashScreen.preventAutoHideAsync();

export default function App() {
  const [currentView, setCurrentView] = useState<ViewMode>("splash");
  const [selectedCalculation, setSelectedCalculation] = useState<CalculationType | null>(null);
  const [isLearningMode, setIsLearningMode] = useState(false);
  const [calculationHistory, setCalculationHistory] = useState<CalculationHistory[]>([]);
  const [completedLearningModules, setCompletedLearningModules] = useState<Set<string>>(new Set());
  const [calculationStreak, setCalculationStreak] = useState(0);
  const [lastCalculationDate, setLastCalculationDate] = useState<Date | null>(null);
  const [appIsReady, setAppIsReady] = useState(false);

  const router = useRouter();

  useEffect(() => {
    async function prepare() {
      try {
        // Carregar fontes (se houver)
        // await Font.loadAsync({
        //   'YourFont-Regular': require('./assets/fonts/YourFont-Regular.ttf'),
        // });

        // Carregar dados do AsyncStorage
        const savedHistory = await AsyncStorage.getItem("hydraulic-calc-history");
        if (savedHistory) setCalculationHistory(JSON.parse(savedHistory));

        const savedModules = await AsyncStorage.getItem("hydraulic-learning-modules");
        if (savedModules) setCompletedLearningModules(new Set(JSON.parse(savedModules)));

        const savedStreak = await AsyncStorage.getItem("hydraulic-streak");
        if (savedStreak) setCalculationStreak(Number.parseInt(savedStreak));

        const savedLastDate = await AsyncStorage.getItem("hydraulic-last-calculation");
        if (savedLastDate) setLastCalculationDate(new Date(savedLastDate));

      } catch (e) {
        console.warn(e);
      } finally {
        setAppIsReady(true);
      }
    }
    prepare();
  }, []);

  const onLayoutRootView = useCallback(async () => {
    if (appIsReady) {
      await ExpoSplashScreen.hideAsync();
      // Simula o timer da splash screen do app original
      const timer = setTimeout(() => {
        router.replace('/dashboard');
      }, 3000);
      // Não precisamos limpar o timer aqui pois App.tsx não será desmontado
    }
  }, [appIsReady, router]);

  if (!appIsReady) {
    return null; // Ou um componente de carregamento muito básico se ExpoSplashScreen.preventAutoHideAsync() não for usado
  }

  // As funções de manipulação como addToHistory, handleCalculationSelect, etc.
  // serão passadas para as telas através de props ou context se necessário,
  // ou gerenciadas dentro das próprias telas se fizer mais sentido com expo-router.
  // Por enquanto, a navegação principal é gerenciada pelo expo-router.

  return (
    <SafeAreaProvider onLayout={onLayoutRootView}>
      <Slot />
    </SafeAreaProvider>
  );
}
