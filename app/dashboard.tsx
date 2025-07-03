import React, { useState, useCallback } from 'react';
import DashboardComponent from '@/components/Dashboard';
import { CalculationType, CalculationHistory, calculationsData } from '@/types/calculation';
import { useRouter, useFocusEffect } from 'expo-router';
import { loadHistory } from '@/services/asyncStorage'; // Importando a função de carregamento de histórico

export default function DashboardScreen() {
  const router = useRouter();
  const [calculationHistory, setCalculationHistory] = useState<CalculationHistory[]>([]);

  const fetchDashboardData = useCallback(async () => {
    try {
      const history = await loadHistory();
      setCalculationHistory(history);
    } catch (e) {
      console.error("Failed to load data in Dashboard:", e);
      setCalculationHistory([]); // Garante que o estado seja um array vazio em caso de erro
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchDashboardData();
      return () => {
        // Opcional: limpeza ao sair da tela, se necessário
      };
    }, [fetchDashboardData])
  );

  const handleCalculationSelect = (calculation: CalculationType) => {
    router.push({
      pathname: `/calculation/${calculation.id}`,
      params: { ...calculation } // Passando todos os dados do cálculo
    });
  };

  const handleLearningSelect = (calculation: CalculationType) => {
    router.push({
      pathname: `/learning/${calculation.id}`,
      params: { ...calculation } // Passando todos os dados do cálculo
    });
  };

  const handleViewHistory = () => {
    router.push('/history');
  };

  return (
    <DashboardComponent
      calculations={calculationsData}
      onCalculationSelect={handleCalculationSelect}
      onLearningSelect={handleLearningSelect}
      calculationHistory={calculationHistory}
      onViewHistory={handleViewHistory}
    />
  );
}
