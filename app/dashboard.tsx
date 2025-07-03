import React, { useState, useEffect, useCallback } from 'react';
import DashboardComponent from '@/components/Dashboard';
import { CalculationType, CalculationHistory, calculationsData } from '@/types/calculation';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter, useFocusEffect } from 'expo-router';

const HISTORY_KEY = "hydraulic-calc-history";
// const MODULES_KEY = "hydraulic-learning-modules"; // Removido
const STREAK_KEY = "hydraulic-streak";
const LAST_CALC_DATE_KEY = "hydraulic-last-calculation";

export default function DashboardScreen() {
  const router = useRouter();
  const [calculationHistory, setCalculationHistory] = useState<CalculationHistory[]>([]);
  // const [completedLearningModules, setCompletedLearningModules] = useState<Set<string>>(new Set()); // Removido
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

      // Lógica de carregamento de módulos concluídos removida
      // const savedModules = await AsyncStorage.getItem(MODULES_KEY);
      // if (savedModules) {
      //   setCompletedLearningModules(new Set(JSON.parse(savedModules)));
      // } else {
      //   setCompletedLearningModules(new Set());
      // }
    } catch (e) {
      console.error("Failed to load data in Dashboard:", e);
      // Definir estados para arrays vazios em caso de erro para evitar quebrar a UI
      setCalculationHistory([]);
      // setCompletedLearningModules(new Set()); // Removido
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

  // clearHistory removido daqui

  const handleViewHistory = () => {
    router.push('/history');
  };

  return (
    <DashboardComponent
      calculations={calculationsData}
      onCalculationSelect={handleCalculationSelect}
      onLearningSelect={handleLearningSelect}
      calculationHistory={calculationHistory}
      onViewHistory={handleViewHistory} // Nova prop
      // completedLearningModules prop removida
    />
  );
}
