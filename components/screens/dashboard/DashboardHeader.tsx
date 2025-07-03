import React from 'react';
import { View, Text } from 'react-native';
import { LayoutDashboard } from 'lucide-react-native';
import { styles } from '../../Dashboard.styles'; // Os estilos do header estão em Dashboard.styles
import { AppColors } from '@/constants/colors'; // Importando de constants

interface DashboardHeaderProps {
  title: string;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ title }) => {
  return (
    <View style={styles.headerContainer}>
      <LayoutDashboard color={AppColors.primary} size={28} />
      <Text style={styles.headerTitle}>{title}</Text>
    </View>
  );
};

export default DashboardHeader;
