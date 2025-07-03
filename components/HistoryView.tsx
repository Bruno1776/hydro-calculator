import React from 'react';
import { View, Text, FlatList, ActivityIndicator } from 'react-native';
import { CalculationHistory } from '@/types/calculation';
import HistoryListItem from './screens/history/HistoryListItem';
import { historyViewStyles as styles } from './HistoryView.styles';
import { AppColors } from '@/constants/colors'; // Importando de constants
import { Info } from 'lucide-react-native';

interface HistoryViewProps {
  calculationHistory: CalculationHistory[];
  isLoading: boolean;
}

const HistoryView: React.FC<HistoryViewProps> = ({ calculationHistory, isLoading }) => {
  if (isLoading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color={AppColors.primary} />
        <Text style={styles.loadingText}>Carregando histórico...</Text>
      </View>
    );
  }

  if (calculationHistory.length === 0) {
    return (
      <View style={[styles.container, styles.centered]}>
        <Info size={48} color={AppColors.textSecondary} />
        <Text style={styles.emptyHistoryText}>Nenhum cálculo no histórico.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={calculationHistory}
        renderItem={({ item }) => <HistoryListItem item={item} />}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContentContainer}
      />
    </View>
  );
};

export default HistoryView;
