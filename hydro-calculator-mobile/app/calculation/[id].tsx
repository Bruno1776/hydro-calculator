import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Alert, TouchableOpacity, Platform } from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import CalculationViewComponent from '@/components/CalculationView'; // Renomeado no arquivo do componente
import { CalculationType, CalculationHistory, calculationsData } from '@/types/calculation';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BookOpen } from 'lucide-react-native';

const HISTORY_KEY = "hydraulic-calc-history";
const STREAK_KEY = "hydraulic-streak";
const LAST_CALC_DATE_KEY = "hydraulic-last-calculation";

const AppColors = { // Consistência de cores
  primary: '#007AFF',
  headerText: Platform.OS === 'ios' ? '#007AFF' : '#FFFFFF',
  learnButtonBackground: '#FFF3E0',
  learnButtonText: '#FF9500',
};

export default function CalculationScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ id: string; title?: string; description?: string; icon?: string; category?: string }>();
  const { id, title, description, icon, category } = params;

  const [selectedCalculation, setSelectedCalculation] = useState<CalculationType | null>(null);

  const navigateToLearningMode = () => {
    if (selectedCalculation) {
      router.replace({
        pathname: `/learning/${selectedCalculation.id}`,
        params: { ...selectedCalculation }
      });
    }
  };

  useEffect(() => {
    if (id) {
      const foundCalc = calculationsData.find(calc => calc.id === id);
      if (foundCalc) {
        setSelectedCalculation(foundCalc);
      } else if (title && description && icon && category) {
         setSelectedCalculation({ id, title, description, icon, category });
      } else {
        Alert.alert("Erro", "Cálculo não encontrado.", [{ text: "OK", onPress: () => router.canGoBack() ? router.back() : router.replace('/dashboard') }]);
      }
    }
  }, [id, title, description, icon, category, router]);


  const addToHistory = async (calculationEntry: CalculationHistory) => {
    try {
      const savedHistory = await AsyncStorage.getItem(HISTORY_KEY);
      let newHistory: CalculationHistory[] = savedHistory ? JSON.parse(savedHistory) : [];
      newHistory = [calculationEntry, ...newHistory.slice(0, 49)];
      await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(newHistory));
      console.log("Histórico salvo:", newHistory);

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const lastCalcDateStr = await AsyncStorage.getItem(LAST_CALC_DATE_KEY);
      const currentStreakStr = await AsyncStorage.getItem(STREAK_KEY);
      let currentStreak = currentStreakStr ? parseInt(currentStreakStr, 10) : 0;

      if (lastCalcDateStr) {
        const lastCalcDate = new Date(lastCalcDateStr);
        lastCalcDate.setHours(0,0,0,0);

        const diffTime = today.getTime() - lastCalcDate.getTime();
        const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 1) {
          currentStreak += 1;
        } else if (diffDays > 1) {
          currentStreak = 1;
        }
      } else {
        currentStreak = 1;
      }

      await AsyncStorage.setItem(STREAK_KEY, currentStreak.toString());
      await AsyncStorage.setItem(LAST_CALC_DATE_KEY, today.toISOString());
      console.log("Streak atualizado:", currentStreak, "Última data:", today.toISOString());

    } catch (e) {
      console.error("Falha ao salvar histórico ou streak:", e);
      Alert.alert("Erro", "Não foi possível salvar o histórico do cálculo.");
    }
  };

  if (!selectedCalculation) {
    return (
      <View style={styles.loadingContainer}>
        <Stack.Screen options={{ title: "Carregando..." }} />
        <Text>Carregando detalhes do cálculo...</Text>
      </View>
    );
  }

  return (
    <>
      <Stack.Screen
        options={{
          title: selectedCalculation.title || "Cálculo",
          headerRight: () => (
            <TouchableOpacity onPress={navigateToLearningMode} style={styles.headerButton}>
              <BookOpen color={AppColors.headerText} size={24} />
            </TouchableOpacity>
          ),
        }}
      />
      <CalculationViewComponent
        calculation={selectedCalculation}
        onAddToHistory={addToHistory}
      />
    </>
  );
}

const styles = StyleSheet.create({
  loadingContainer: { // Renomeado de container para evitar conflito se CalculationViewComponent usar 'container'
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f0f0f0',
  },
  headerButton: {
    marginRight: Platform.OS === 'ios' ? 10 : 15,
    padding: 5,
    backgroundColor: Platform.OS === 'android' ? AppColors.learnButtonBackground : 'transparent', // Fundo apenas no Android para destacar
    borderRadius: Platform.OS === 'android' ? 20 : 0,
  },
});
