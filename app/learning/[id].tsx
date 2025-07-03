import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, Alert, TouchableOpacity, Platform } from 'react-native';
import { useLocalSearchParams, useRouter, Stack, useFocusEffect } from 'expo-router';
import LearningViewComponent from '@/components/LearningView'; // Renomeado no arquivo do componente
import { CalculationType, calculationsData } from '@/types/calculation';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CheckSquare } from 'lucide-react-native';

const MODULES_KEY = "hydraulic-learning-modules";

const AppColors = { // Consistência de cores
  primary: '#007AFF',
  headerText: Platform.OS === 'ios' ? '#007AFF' : '#FFFFFF',
  calcButtonBackground: '#EBF5FF',
  calcButtonText: '#007AFF',
};

export default function LearningScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ id: string; title?: string; description?: string; icon?: string; category?: string }>();
  const { id, title, description, icon, category } = params;

  const [selectedCalculation, setSelectedCalculation] = useState<CalculationType | null>(null);
  const [isModuleCompleted, setIsModuleCompleted] = useState(false);
  const [completedModules, setCompletedModules] = useState<Set<string>>(new Set());

  const loadData = useCallback(async () => {
    if (id) {
      const foundCalc = calculationsData.find(calc => calc.id === id);
      if (foundCalc) {
        setSelectedCalculation(foundCalc);
      } else if (title && description && icon && category) {
         setSelectedCalculation({ id, title, description, icon, category });
      } else {
        Alert.alert("Erro", "Módulo de aprendizado não encontrado.", [{ text: "OK", onPress: () => router.canGoBack() ? router.back() : router.replace('/dashboard') }]);
        return;
      }
    }

    try {
      const savedModules = await AsyncStorage.getItem(MODULES_KEY);
      if (savedModules) {
        const modulesSet = new Set<string>(JSON.parse(savedModules));
        setCompletedModules(modulesSet);
        if (id) {
          setIsModuleCompleted(modulesSet.has(id));
        }
      } else {
        setCompletedModules(new Set());
        setIsModuleCompleted(false); // Garante que não seja true se não houver dados salvos
      }
    } catch (e) {
      console.error("Failed to load completed modules:", e);
      setCompletedModules(new Set());
      setIsModuleCompleted(false);
    }
  }, [id, title, description, icon, category, router]);

  useFocusEffect(loadData); // Recarrega os dados quando a tela ganha foco

  const navigateToCalculationMode = () => {
    if (selectedCalculation) {
      router.replace({
        pathname: `/calculation/${selectedCalculation.id}`,
        params: { ...selectedCalculation }
      });
    }
  };

  const markModuleComplete = async (calculationId: string) => {
    const newCompletedModules = new Set(completedModules);
    newCompletedModules.add(calculationId);
    setCompletedModules(newCompletedModules); // Atualiza estado local primeiro para UI responsiva
    setIsModuleCompleted(true);
    try {
      await AsyncStorage.setItem(MODULES_KEY, JSON.stringify(Array.from(newCompletedModules)));
      console.log("Módulo de aprendizado salvo:", calculationId);
    } catch (e) {
      console.error("Falha ao salvar módulos completados:", e);
      Alert.alert("Erro", "Não foi possível salvar o progresso do módulo.");
      // Reverter o estado se o salvamento falhar (opcional, mas bom para consistência)
      const revertedModules = new Set(completedModules);
      revertedModules.delete(calculationId);
      setCompletedModules(revertedModules);
      setIsModuleCompleted(false);
    }
  };

  if (!selectedCalculation) {
    return (
      <View style={styles.loadingContainer}>
        <Stack.Screen options={{ title: "Carregando..." }} />
        <Text>Carregando conteúdo de aprendizado...</Text>
      </View>
    );
  }

  return (
    <>
      <Stack.Screen
        options={{
          title: selectedCalculation.title ? `Aprender: ${selectedCalculation.title}` : "Módulo de Aprendizado",
          headerRight: () => (
            <TouchableOpacity onPress={navigateToCalculationMode} style={styles.headerButton}>
              <CheckSquare color={AppColors.headerText} size={24} />
            </TouchableOpacity>
          ),
        }}
      />
      <LearningViewComponent
        calculation={selectedCalculation}
        onMarkModuleComplete={markModuleComplete}
        isModuleCompleted={isModuleCompleted}
      />
    </>
  );
}

const styles = StyleSheet.create({
  loadingContainer: { // Renomeado de container para evitar conflito
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f0f0f0',
  },
  headerButton: {
    marginRight: Platform.OS === 'ios' ? 10 : 15,
    padding: 5,
    backgroundColor: Platform.OS === 'android' ? AppColors.calcButtonBackground : 'transparent',
    borderRadius: Platform.OS === 'android' ? 20 : 0,
  },
});
