import React, { useState, useCallback } from 'react';
import { TouchableOpacity, Platform, Alert } from 'react-native';
import { Stack, useFocusEffect } from 'expo-router';
import { CalculationHistory } from '@/types/calculation';
import { Trash2 } from 'lucide-react-native';
import HistoryView from '@/components/HistoryView';
import { loadHistory, clearHistoryStorage } from '@/services/asyncStorage'; // Funções de AsyncStorage atualizadas

// Cores para o botão de limpar, podem ser movidas para um arquivo de tema
const AccentColors = {
  accentRed: '#FF3B30',
  // headerButtonColor: Platform.OS === 'ios' ? '#007AFF' : '#FFFFFF', // Não mais necessário aqui
};

export default function HistoryScreen() {
  const [calculationHistory, setCalculationHistory] = useState<CalculationHistory[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchHistoryData = useCallback(async () => {
    setIsLoading(true);
    try {
      const history = await loadHistory();
      setCalculationHistory(history);
    } catch (e) {
      console.error("Failed to load calculation history in HistoryScreen:", e);
      Alert.alert("Erro", "Não foi possível carregar o histórico.");
      setCalculationHistory([]); // Garante estado consistente em caso de erro
    } finally {
      setIsLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchHistoryData();
      return () => {}; // Função de limpeza, se necessário
    }, [fetchHistoryData])
  );

  const handleClearHistory = async () => {
    Alert.alert(
      "Limpar Histórico",
      "Tem certeza que deseja apagar todo o histórico de cálculos? Esta ação não pode ser desfeita.",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Apagar",
          style: "destructive",
          onPress: async () => {
            const success = await clearHistoryStorage();
            if (success) {
              setCalculationHistory([]);
              Alert.alert("Sucesso", "Histórico de cálculos apagado.");
            } else {
              Alert.alert("Erro", "Não foi possível limpar o histórico.");
            }
          },
        },
      ]
    );
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Histórico de Cálculos',
          headerRight: () => (
            calculationHistory.length > 0 ? (
              <TouchableOpacity onPress={handleClearHistory} style={{ marginRight: Platform.OS === 'ios' ? 10 : 15, padding: 5 }}>
                <Trash2 color={AccentColors.accentRed} size={24} />
              </TouchableOpacity>
            ) : null
          ),
        }}
      />
      <HistoryView
        calculationHistory={calculationHistory}
        isLoading={isLoading}
      />
    </>
  );
}