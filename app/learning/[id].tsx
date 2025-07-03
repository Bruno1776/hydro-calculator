import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, Alert, TouchableOpacity, Platform } from 'react-native';
import { useLocalSearchParams, useRouter, Stack, useFocusEffect } from 'expo-router';
import LearningViewComponent from '@/components/LearningView'; // Renomeado no arquivo do componente
import { CalculationType, calculationsData } from '@/types/calculation';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CheckSquare } from 'lucide-react-native';

// const MODULES_KEY = "hydraulic-learning-modules"; // Removido

const AppColors = { // Consistência de cores
  primary: '#007AFF',
  headerText: Platform.OS === 'ios' ? '#007AFF' : '#FFFFFF',
  // calcButtonBackground: '#EBF5FF', // Antigo
  // calcButtonText: '#007AFF', // Antigo
  headerButtonIconColor: '#28a745', // Verde para o ícone (Bootstrap success green)
  headerButtonBackground: Platform.OS === 'android' ? '#E9F5EC' : 'transparent', // Fundo verde claro para Android
};

export default function LearningScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ id: string; title?: string; description?: string; icon?: string; category?: string }>();
  const { id, title, description, icon, category } = params;

  const [selectedCalculation, setSelectedCalculation] = useState<CalculationType | null>(null);
  // Removido isModuleCompleted e completedModules

  useFocusEffect(
    useCallback(() => {
      const loadData = async () => {
        if (id) {
          const foundCalc = calculationsData.find(calc => calc.id === id);
          if (foundCalc) {
            setSelectedCalculation(foundCalc);
          } else if (title && description && icon && category) {
            setSelectedCalculation({ id, title, description, icon, category });
          } else {
            Alert.alert(
              "Erro",
              "Módulo de aprendizado não encontrado.",
              [{ text: "OK", onPress: () => router.canGoBack() ? router.back() : router.replace('/dashboard') }]
            );
            return;
          }
        }
        // Lógica de carregamento de módulos concluídos removida
      };

      loadData();
    }, [id, title, description, icon, category, router])
  ); // Recarrega os dados quando a tela ganha foco

  const navigateToCalculationMode = () => {
    if (selectedCalculation) {
      router.replace({
        pathname: `/calculation/${selectedCalculation.id}`,
        params: { ...selectedCalculation }
      });
    }
  };

  // Função markModuleComplete removida

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
            <TouchableOpacity onPress={navigateToCalculationMode} style={[styles.headerButton, { backgroundColor: AppColors.headerButtonBackground }]}>
              <CheckSquare color={AppColors.headerButtonIconColor} size={24} />
            </TouchableOpacity>
          ),
        }}
      />
      <LearningViewComponent
        calculation={selectedCalculation}
        // Props onMarkModuleComplete e isModuleCompleted removidas
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
    // backgroundColor removido daqui, pois será aplicado inline via AppColors.headerButtonBackground
    borderRadius: Platform.OS === 'android' ? 20 : 0,
  },
});
