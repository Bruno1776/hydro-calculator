import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ScrollView, Platform } from 'react-native';
import { CalculationType, CalculationHistory } from '@/types/calculation';
import { LayoutDashboard, BookOpen, BarChart3, Trash2, CheckCircle, ChevronRight } from 'lucide-react-native';

interface DashboardProps {
  calculations: CalculationType[];
  onCalculationSelect: (calculation: CalculationType) => void;
  onLearningSelect: (calculation: CalculationType) => void;
  calculationHistory: CalculationHistory[];
  onClearHistory: () => void;
  completedLearningModules: Set<string>;
}

const AppColors = {
  primary: '#007AFF', // Azul
  secondary: '#5856D6', // Roxo
  background: '#F2F2F7', // Cinza claro (iOS system background)
  cardBackground: '#FFFFFF',
  text: '#000000',
  textSecondary: '#3C3C4399', // Cinza para descrições (iOS secondary label)
  accentGreen: '#34C759', // Verde para "concluído"
  accentRed: '#FF3B30',   // Vermelho para "limpar"
  borderColor: '#C7C7CC', // Cinza para bordas (iOS separator)
  buttonBlueBackground: '#EBF5FF', // Fundo azul claro para botão de aprender
};

const Dashboard: React.FC<DashboardProps> = ({
  calculations,
  onCalculationSelect,
  onLearningSelect,
  calculationHistory,
  onClearHistory,
  completedLearningModules,
}) => {
  const renderCalculationItem = ({ item }: { item: CalculationType }) => (
    <TouchableOpacity style={styles.card} onPress={() => onCalculationSelect(item)}>
      <View style={styles.cardContent}>
        <Text style={styles.cardIcon}>{item.icon}</Text>
        <View style={styles.cardTextContainer}>
          <Text style={styles.cardTitle}>{item.title}</Text>
          <Text style={styles.cardDescription} numberOfLines={2}>{item.description}</Text>
          <Text style={styles.cardCategory}>Categoria: {item.category}</Text>
        </View>
        <ChevronRight color={AppColors.borderColor} size={24} />
      </View>
      <View style={styles.actionsContainer}>
        <TouchableOpacity
          style={[styles.actionButton, styles.learnButton]}
          onPress={(e) => {
            e.stopPropagation(); // Evita que o onPress do card seja acionado
            onLearningSelect(item);
          }}
        >
          <BookOpen color={AppColors.primary} size={18} />
          <Text style={[styles.actionText, styles.learnButtonText]}>Aprender</Text>
        </TouchableOpacity>
        {completedLearningModules.has(item.id) && (
          <View style={styles.completedBadge}>
            <CheckCircle color={AppColors.accentGreen} size={16} />
            <Text style={styles.completedText}>Concluído</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );

  const renderHistoryItem = ({ item }: { item: CalculationHistory }) => (
    <View style={styles.historyItem}>
      <Text style={styles.historyTitle}>{item.type}</Text>
      <Text style={styles.historyDate}>{new Date(item.timestamp).toLocaleDateString()} - {new Date(item.timestamp).toLocaleTimeString()}</Text>
      <View style={styles.historyDetails}>
        <Text style={styles.historyDetailLabel}>Entradas: </Text>
        <Text style={styles.historyDetailValue}>{JSON.stringify(item.inputs)}</Text>
      </View>
      <View style={styles.historyDetails}>
        <Text style={styles.historyDetailLabel}>Resultado: </Text>
        <Text style={styles.historyDetailValue}>{JSON.stringify(item.result)}</Text>
      </View>
    </View>
  );

  const groupedCalculations = calculations.reduce((acc, calc) => {
    const category = calc.category;
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(calc);
    return acc;
  }, {} as Record<string, CalculationType[]>);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContentContainer}>
      <View style={styles.header}>
        <LayoutDashboard color={AppColors.primary} size={28} />
        <Text style={styles.headerTitle}>Calculadora Hidráulica</Text>
      </View>

      {Object.entries(groupedCalculations).map(([category, calcs]) => (
        <View key={category} style={styles.categorySection}>
          <Text style={styles.categoryTitle}>{category}</Text>
          {/* Usando map em vez de FlatList para seções menores dentro de um ScrollView */}
          {calcs.map(calc => renderCalculationItem({ item: calc }))}
        </View>
      ))}

      <View style={styles.historySection}>
        <View style={styles.historyHeader}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <BarChart3 color={AppColors.text} size={24} />
            <Text style={styles.sectionTitle}>Histórico de Cálculos</Text>
          </View>
          {calculationHistory.length > 0 && (
            <TouchableOpacity onPress={onClearHistory} style={styles.clearButton}>
              <Trash2 color={AppColors.accentRed} size={20} />
              <Text style={styles.clearButtonText}>Limpar</Text>
            </TouchableOpacity>
          )}
        </View>
        {calculationHistory.length > 0 ? (
          <FlatList
            data={calculationHistory}
            renderItem={renderHistoryItem}
            keyExtractor={(item) => item.id}
            scrollEnabled={false} // A rolagem principal é do ScrollView
          />
        ) : (
          <Text style={styles.emptyHistoryText}>Nenhum cálculo realizado ainda.</Text>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColors.background,
  },
  scrollContentContainer: {
    paddingBottom: 20, // Espaço no final da rolagem
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: AppColors.cardBackground,
    borderBottomWidth: 1,
    borderBottomColor: AppColors.borderColor,
    marginBottom: 8, // Reduzido para dar mais espaço às categorias
  },
  headerTitle: {
    fontSize: 20, // Ligeiramente menor para um visual mais mobile
    fontWeight: '600', // Semibold, comum em iOS
    marginLeft: 12,
    color: AppColors.text,
  },
  categorySection: {
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  categoryTitle: {
    fontSize: 17, // Tamanho padrão de título de seção iOS
    fontWeight: '600',
    marginBottom: 8,
    color: AppColors.textSecondary, // Cor mais suave para títulos de seção
  },
  card: {
    backgroundColor: AppColors.cardBackground,
    borderRadius: 10,
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
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
  },
  cardIcon: {
    fontSize: 24, // Ícones um pouco maiores
    marginRight: 12,
  },
  cardTextContainer: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: AppColors.text,
    marginBottom: 2,
  },
  cardDescription: {
    fontSize: 13,
    color: AppColors.textSecondary,
    marginBottom: 4,
  },
  cardCategory: {
    fontSize: 12,
    color: AppColors.primary, // Usar cor primária para categoria
    fontStyle: 'italic',
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
    borderTopWidth: 1,
    borderTopColor: AppColors.borderColor,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 6,
  },
  learnButton: {
    backgroundColor: AppColors.buttonBlueBackground,
  },
  actionText: {
    marginLeft: 6,
    fontSize: 14,
    fontWeight: '500',
  },
  learnButtonText: {
    color: AppColors.primary,
  },
  completedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E5F9ED', // Verde mais suave
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  completedText: {
    marginLeft: 5,
    color: AppColors.accentGreen,
    fontSize: 12,
    fontWeight: '500',
  },
  historySection: {
    marginTop: 16,
    marginHorizontal: 16,
    padding: 12,
    backgroundColor: AppColors.cardBackground,
    borderRadius: 10,
    ...Platform.select({ // Sombra sutil também para a seção de histórico
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.08,
        shadowRadius: 2,
      },
      android: {
        elevation: 1,
      },
    }),
  },
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: AppColors.borderColor,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '600',
    marginLeft: 8,
    color: AppColors.text,
  },
  clearButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  clearButtonText: {
    marginLeft: 5,
    color: AppColors.accentRed,
    fontSize: 14,
    fontWeight: '500',
  },
  historyItem: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: AppColors.borderColor,
  },
  historyTitle: {
    fontSize: 15,
    fontWeight: '500',
    color: AppColors.text,
    marginBottom: 2,
  },
  historyDate: {
    fontSize: 12,
    color: AppColors.textSecondary,
    marginBottom: 4,
  },
  historyDetails: {
    flexDirection: 'row',
    marginTop: 2,
  },
  historyDetailLabel: {
    fontSize: 13,
    color: AppColors.textSecondary,
    fontWeight: '500',
  },
  historyDetailValue: {
    fontSize: 13,
    color: AppColors.text,
    flexShrink: 1, // Para quebrar linha se o JSON for longo
  },
  emptyHistoryText: {
    textAlign: 'center',
    color: AppColors.textSecondary,
    marginTop: 15,
    marginBottom: 10,
    fontSize: 14,
  },
});

export default Dashboard;
