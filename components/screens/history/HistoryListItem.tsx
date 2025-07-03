import React from 'react';
import { View, Text } from 'react-native';
import { CalculationHistory } from '@/types/calculation';
import { historyListItemStyles as styles } from './HistoryListItem.styles';

interface HistoryListItemProps {
  item: CalculationHistory;
}

const HistoryListItem: React.FC<HistoryListItemProps> = ({ item }) => {
  return (
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
            <Text style={styles.historyDetailKey}>{key.charAt(0).toUpperCase() + key.slice(1)}:</Text> {typeof value === 'number' ? value.toLocaleString(undefined, { maximumFractionDigits: 4 }) : String(value)}
          </Text>
        ))}
      </View>
    </View>
  );
};

export default HistoryListItem;
