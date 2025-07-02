import React, { useState, useEffect, useCallback } from 'react';
import DashboardComponent from '@/components/Dashboard';
import { CalculationType, CalculationHistory, calculationsData } from '@/types/calculation';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter, useFocusEffect } from 'expo-router';

const HISTORY_KEY = "hydraulic-calc-history";
const MODULES_KEY = "hydraulic-learning-modules";
const STREAK_KEY = "hydraulic-streak";
const LAST_CALC_DATE_KEY = "hydraulic-last-calculation";

export default function DashboardScreen() {
  const router = useRouter();
  const [calculationHistory, setCalculationHistory] = useState<CalculationHistory[]>([]);
  const [completedLearningModules, setCompletedLearningModules] = useState<Set<string>>(new Set());
  // Streak e lastCalculationDate são gerenciados principalmente na tela de cálculo,
  // mas podem ser lidos aqui se o Dashboard precisar exibi-los.

  const loadData = useCallback(async () => {
    try {
      const savedHistory = await AsyncStorage.getItem(HISTORY_KEY);
      if (savedHistory) {
        setCalculationHistory(JSON.parse(savedHistory));
      } else {
        setCalculationHistory([]);
      }

      const savedModules = await AsyncStorage.getItem(MODULES_KEY);
      if (savedModules) {
        setCompletedLearningModules(new Set(JSON.parse(savedModules)));
      } else {
        setCompletedLearningModules(new Set());
      }
    } catch (e) {
      console.error("Failed to load data in Dashboard:", e);
      // Definir estados para arrays vazios em caso de erro para evitar quebrar a UI
      setCalculationHistory([]);
      setCompletedLearningModules(new Set());
    }
  }, []);

  // useFocusEffect para recarregar os dados quando a tela ganha foco
  useFocusEffect(
    useCallback(() => {
      loadData();
      return () => {
        // Opcional: limpeza ao sair da tela, se necessário
      };
    }, [loadData])
  );

  const handleCalculationSelect = (calculation: CalculationType) => {
    router.push({
      pathname: `/calculation/${calculation.id}`,
      params: {
        id: calculation.id,
        title: calculation.title,
        description: calculation.description,
        icon: calculation.icon,
        category: calculation.category
      }
    });
  };

  const handleLearningSelect = (calculation: CalculationType) => {
    router.push({
      pathname: `/learning/${calculation.id}`,
      params: {
        id: calculation.id,
        title: calculation.title,
        description: calculation.description,
        icon: calculation.icon,
        category: calculation.category
      }
    });
  };

  const clearHistory = async () => {
    try {
      await AsyncStorage.removeItem(HISTORY_KEY);
      setCalculationHistory([]);
      // Opcionalmente, resetar streak e last calculation date também
      await AsyncStorage.removeItem(STREAK_KEY);
      await AsyncStorage.removeItem(LAST_CALC_DATE_KEY);
      console.log("Histórico e dados de streak limpos.");
    } catch (e) {
      console.error("Failed to clear history:", e);
    }
  };

  return (
    <DashboardComponent
      calculations={calculationsData}
      onCalculationSelect={handleCalculationSelect}
      onLearningSelect={handleLearningSelect}
      calculationHistory={calculationHistory}
      onClearHistory={clearHistory}
      completedLearningModules={completedLearningModules}
    />
  );
}
