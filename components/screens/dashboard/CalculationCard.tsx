import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { CalculationType } from '@/types/calculation';
import { BookOpen, ChevronRight } from 'lucide-react-native';
import { calculationCardStyles as styles } from './CalculationCard.styles'; // Importando os estilos corretos
import { AppColors } from '@/constants/colors';

interface CalculationCardProps {
  item: CalculationType;
  onSelect: (calculation: CalculationType) => void;
  onLearn: (calculation: CalculationType) => void;
}

const CalculationCard: React.FC<CalculationCardProps> = ({ item , onSelect, onLearn }) => {
  return (
    <TouchableOpacity style={styles.card} onPress={() => onSelect(item)}>
      <View style={styles.cardContent}>
        <Text style={styles.cardIcon}>{item.icon}</Text>
        <View style={styles.cardTextContainer}>
          <Text style={styles.cardTitle}>{item.title}</Text>
          <Text style={styles.cardDescription} numberOfLines={2}>{item.description}</Text>
          <Text style={styles.cardCategory}>Categoria: {item.category}</Text>
        </View>
        <ChevronRight color={AppColors.borderColor} size={24} style={styles.chevron} />
      </View>
      <View style={styles.actionsContainer}>
        <TouchableOpacity
          style={[styles.actionButton]}
          onPress={(e) => {
            e.stopPropagation();
            onLearn(item);
          }}
        >
          <BookOpen color={AppColors.primary} size={18} />
          <Text style={[styles.actionText]}>Aprender</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

export default CalculationCard;
