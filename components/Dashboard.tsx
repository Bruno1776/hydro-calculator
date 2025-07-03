import React from 'react';
import { View, Text, ScrollView, SafeAreaView } from 'react-native';
import { CalculationType, CalculationHistory } from '@/types/calculation';
import { styles } from './Dashboard.styles'; // Importando estilos principais
import DashboardHeader from './screens/dashboard/DashboardHeader';
import CalculationCard from './screens/dashboard/CalculationCard';
import HistorySummary from './screens/dashboard/HistorySummary';

interface DashboardProps {
  calculations: CalculationType[];
  onCalculationSelect: (calculation: CalculationType) => void;
  onLearningSelect: (calculation: CalculationType) => void;
  calculationHistory: CalculationHistory[];
  onViewHistory: () => void;
}

const DashboardComponent: React.FC<DashboardProps> = ({
  calculations,
  onCalculationSelect,
  onLearningSelect,
  calculationHistory,
  onViewHistory,
}) => {
  const groupedCalculations = calculations.reduce((acc, calc) => {
    const category = calc.category;
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(calc);
    return acc;
  }, {} as Record<string, CalculationType[]>);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} contentContainerStyle={styles.scrollContentContainer}>
        <DashboardHeader title="Calculadora Hidráulica" />

        {Object.entries(groupedCalculations).map(([category, calcs]) => (
          <View key={category} style={styles.categorySection}>
            <Text style={styles.categoryTitle}>{category}</Text>
            {calcs.map(calc => (
              <CalculationCard
                key={calc.id}
                item={calc}
                onSelect={onCalculationSelect}
                onLearn={onLearningSelect}
              />
            ))}
          </View>
        ))}

        <HistorySummary
          calculationHistory={calculationHistory}
          onViewHistory={onViewHistory}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

export default DashboardComponent;