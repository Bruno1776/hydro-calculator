import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ScrollView, Platform, SafeAreaView } from 'react-native';
import { CalculationType, CalculationHistory } from '@/types/calculation';
import { LayoutDashboard, BookOpen, BarChart3, Trash2, CheckCircle, ChevronRight } from 'lucide-react-native';

interface DashboardProps {
  calculations: CalculationType[];
  onCalculationSelect: (calculation: CalculationType) => void;
  onLearningSelect: (calculation: CalculationType) => void;
  calculationHistory: CalculationHistory[]; // Pode ser usado para mostrar um resumo ou contagem
  // onClearHistory: () => void; // Removido, será tratado na tela de Histórico
  onViewHistory: () => void; // Nova prop para navegar para a tela de histórico
  // completedLearningModules: Set<string>; // Removido
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
  // onClearHistory, // Removido
  onViewHistory,
  // completedLearningModules, // Removido
}) => {
  const renderCalculationItem = ({ item }: { item: CalculationType }) => (
    <TouchableOpacity key={item.id} style={styles.card} onPress={() => onCalculationSelect(item)}>
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
        {/* Badge de concluído removido */}
      </View>
    </TouchableOpacity>
  );

  // renderHistoryItem removido daqui

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
          {/* Botão Limpar removido daqui */}
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
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: AppColors.cardBackground, // Cor de fundo para a área segura, pode ser a mesma do header ou do background geral
  },
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
  // Estilos completedBadge e completedText removidos
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
  // clearButton e clearButtonText removidos
  // historyItem, historyTitle, historyDate, historyDetails, historyDetailLabel, historyDetailValue removidos
  historySummaryText: {
    fontSize: 14,
    color: AppColors.textSecondary,
    textAlign: 'center',
    marginBottom: 8,
  },
  viewHistoryButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: AppColors.buttonBlueBackground, // Reutilizando cor de fundo
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginTop: 8,
  },
  viewHistoryButtonText: {
    fontSize: 16,
    color: AppColors.primary, // Reutilizando cor do texto do botão "Aprender"
    fontWeight: '500',
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