import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Alert, TouchableOpacity, Platform } from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import CalculationViewComponent from '@/components/CalculationView';
import { CalculationType, CalculationHistory, calculationsData } from '@/types/calculation';
import { saveHistoryEntry, updateStreakAndLastCalcDate } from '@/services/asyncStorage'; // Funções de AsyncStorage atualizadas
import { BookOpen } from 'lucide-react-native';

// Cores podem ser movidas para um arquivo de tema global
const AppColors = {
  primary: '#007AFF',
  headerText: Platform.OS === 'ios' ? '#007AFF' : '#FFFFFF',
  learnButtonBackground: Platform.OS === 'android' ? '#FFF3E0' : 'transparent', // Condicional para Android
  // learnButtonText: '#FF9500', // Não usado diretamente aqui
};

export default function CalculationScreen() {
  const router = useRouter();
  // Tipagem mais robusta para os parâmetros da rota
  const params = useLocalSearchParams<Partial<CalculationType> & { id: string }>();
  const { id, title, description, icon, category } = params;

  const [selectedCalculation, setSelectedCalculation] = useState<CalculationType | null>(null);

  useEffect(() => {
    if (id) {
      const foundCalc = calculationsData.find(calc => calc.id === id);
      if (foundCalc) {
        setSelectedCalculation(foundCalc);
      } else if (title && description && icon && category) {
        // Se não encontrar nos dados estáticos, mas todos os params estiverem presentes, monta o objeto
        setSelectedCalculation({ id, title, description, icon, category });
      } else {
        Alert.alert(
          "Erro",
          "Cálculo não encontrado ou dados incompletos.",
          [{ text: "OK", onPress: () => router.canGoBack() ? router.back() : router.replace('/dashboard') }]
        );
      }
    }
  }, [id, title, description, icon, category, router]);

  const navigateToLearningMode = () => {
    if (selectedCalculation) {
      router.replace({
        pathname: `/learning/${selectedCalculation.id}`,
        params: { ...selectedCalculation } // Passa todos os dados do cálculo
      });
    }
  };

  const handleAddToHistory = async (calculationEntry: CalculationHistory) => {
    try {
      await saveHistoryEntry(calculationEntry);
      await updateStreakAndLastCalcDate(); // Atualiza o streak e a data do último cálculo
      // Opcional: feedback ao usuário que foi salvo, mas console.log é bom para debug
      console.log("Histórico e streak salvos com sucesso.");
    } catch (e) {
      console.error("Falha ao salvar histórico ou streak na tela de cálculo:", e);
      Alert.alert("Erro", "Não foi possível salvar o histórico ou atualizar o progresso.");
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
        onAddToHistory={handleAddToHistory} // Nome da prop atualizado para refletir a ação
      />
    </>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f0f0f0', // Um cinza claro para o fundo do loading
  },
  headerButton: {
    marginRight: Platform.OS === 'ios' ? 10 : 15,
    padding: 5,
    backgroundColor: AppColors.learnButtonBackground,
    borderRadius: Platform.OS === 'android' ? 20 : 0, // Borda arredondada apenas no Android
  },
});
