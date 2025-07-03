import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { CalculationHistory } from '@/types/calculation';
import { BarChart3, ChevronRight } from 'lucide-react-native';
import { historySummaryStyles as styles } from './HistorySummary.styles';
import { AppColors } from '@/constants/colors'; // Importando de constants

interface HistorySummaryProps {
  calculationHistory: CalculationHistory[];
  onViewHistory: () => void;
}

const HistorySummary: React.FC<HistorySummaryProps> = ({ calculationHistory, onViewHistory }) => {
  return (
    <View style={styles.historySection}>
      <View style={styles.historyHeader}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <BarChart3 color={AppColors.text} size={24} />
          <Text style={styles.sectionTitle}>Histórico de Cálculos</Text>
        </View>
      </View>
      {calculationHistory.length > 0 ? (
        <>
          <Text style={styles.historySummaryText}>
            {`Você tem ${calculationHistory.length} cálculo(s) no histórico.`}
          </Text>
          <TouchableOpacity style={styles.viewHistoryButton} onPress={onViewHistory}>
            <Text style={styles.viewHistoryButtonText}>Ver Histórico Completo</Text>
            <ChevronRight color={AppColors.primary} size={20} />
          </TouchableOpacity>
        </>
      ) : (
        <Text style={styles.emptyHistoryText}>Nenhum cálculo realizado ainda.</Text>
      )}
    </View>
  );
};

export default HistorySummary;
