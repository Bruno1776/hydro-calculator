import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Platform, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Stack, useFocusEffect, useRouter } from 'expo-router';
import { CalculationHistory } from '@/types/calculation';
import { Trash2, Info } from 'lucide-react-native'; // Ícones

const HISTORY_KEY = "hydraulic-calc-history";

const AppColors = {
  background: '#F2F2F7',
  cardBackground: '#FFFFFF',
  text: '#000000',
  textSecondary: '#3C3C4399',
  primary: '#007AFF',
  accentRed: '#FF3B30',
  borderColor: '#C7C7CC',
};

export default function HistoryScreen() {
  const router = useRouter();
  const [calculationHistory, setCalculationHistory] = useState<CalculationHistory[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadHistory = useCallback(async () => {
    setIsLoading(true);
    try {
      const savedHistory = await AsyncStorage.getItem(HISTORY_KEY);
      if (savedHistory) {
        setCalculationHistory(JSON.parse(savedHistory));
      } else {
        setCalculationHistory([]);
      }
    } catch (e) {
      console.error("Failed to load calculation history:", e);
      Alert.alert("Erro", "Não foi possível carregar o histórico.");
      setCalculationHistory([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useFocusEffect(loadHistory);

  const clearHistory = async () => {
    Alert.alert(
      "Limpar Histórico",
      "Tem certeza que deseja apagar todo o histórico de cálculos? Esta ação não pode ser desfeita.",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Apagar",
          style: "destructive",
          onPress: async () => {
            try {
              await AsyncStorage.removeItem(HISTORY_KEY);
              setCalculationHistory([]);
              // Poderia também limpar streak e last_calc_date se estivessem fortemente ligados apenas ao histórico
            } catch (e) {
              console.error("Failed to clear history:", e);
              Alert.alert("Erro", "Não foi possível limpar o histórico.");
            }
          },
        },
      ]
    );
  };

  const renderHistoryItem = ({ item }: { item: CalculationHistory }) => (
    <View style={styles.historyCard}>
      <Text style={styles.historyCardTitle}>{item.type}</Text>
      <Text style={styles.historyCardDate}>
        {new Date(item.timestamp).toLocaleDateString()} - {new Date(item.timestamp).toLocaleTimeString()}
      </Text>
      <View style={styles.historyDetailsSection}>
        <Text style={styles.historySectionTitle}>Entradas:</Text>
        {Object.entries(item.inputs).map(([key, value]) => (
          <Text key={key} style={styles.historyDetailText}>
            <Text style={styles.historyDetailKey}>{key.charAt(0).toUpperCase() + key.slice(1)}:</Text> {String(value)}
          </Text>
        ))}
      </View>
      <View style={styles.historyDetailsSection}>
        <Text style={styles.historySectionTitle}>Resultados:</Text>
        {Object.entries(item.result).map(([key, value]) => (
          <Text key={key} style={styles.historyDetailText}>
             <Text style={styles.historyDetailKey}>{key.charAt(0).toUpperCase() + key.slice(1)}:</Text> {typeof value === 'number' ? value.toLocaleString(undefined, {maximumFractionDigits: 4}) : String(value)}
          </Text>
        ))}
      </View>
    </View>
  );

  if (isLoading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <Stack.Screen options={{ title: 'Histórico de Cálculos' }} />
        <Text>Carregando histórico...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: 'Histórico de Cálculos',
          headerRight: () => (
            calculationHistory.length > 0 ? (
              <TouchableOpacity onPress={clearHistory} style={styles.headerButton}>
                <Trash2 color={AppColors.accentRed} size={24} />
              </TouchableOpacity>
            ) : null
          ),
        }}
      />
      {calculationHistory.length === 0 ? (
        <View style={styles.centered}>
          <Info size={48} color={AppColors.textSecondary} />
          <Text style={styles.emptyHistoryText}>Nenhum cálculo no histórico.</Text>
        </View>
      ) : (
        <FlatList
          data={calculationHistory}
          renderItem={renderHistoryItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContentContainer}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColors.background,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  listContentContainer: {
    padding: 16,
  },
  headerButton: {
    marginRight: Platform.OS === 'ios' ? 10 : 15,
    padding: 5,
  },
  historyCard: {
    backgroundColor: AppColors.cardBackground,
    borderRadius: 10,
    padding: 16,
    marginBottom: 12,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  historyCardTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: AppColors.primary,
    marginBottom: 4,
  },
  historyCardDate: {
    fontSize: 12,
    color: AppColors.textSecondary,
    marginBottom: 12,
  },
  historyDetailsSection: {
    marginBottom: 8,
  },
  historySectionTitle: {
    fontSize: 15,
    fontWeight: '500',
    color: AppColors.text,
    marginBottom: 6,
    borderBottomWidth: 1,
    borderBottomColor: AppColors.borderColor,
    paddingBottom: 4,
  },
  historyDetailText: {
    fontSize: 14,
    color: AppColors.textSecondary,
    marginBottom: 3,
  },
  historyDetailKey: {
      fontWeight: '500',
      color: AppColors.text,
  },
  emptyHistoryText: {
    fontSize: 16,
    color: AppColors.textSecondary,
    marginTop: 16,
    textAlign: 'center',
  },
});
