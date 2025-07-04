import React from 'react';
import { View, Text, Image } from 'react-native'; // Importar Image
// import { LayoutDashboard } from 'lucide-react-native'; // Remover esta importação
import { styles } from '../../Dashboard.styles';
import { AppColors } from '@/constants/colors';

interface DashboardHeaderProps {
  title: string;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ title }) => {
  return (
    <View style={styles.headerContainer}>
      {/* Substituindo o ícone pela imagem */}
      <Image
        source={require('../../../assets/LogosGrupoNovaes_6.png')} // Ajuste o caminho conforme sua estrutura de pastas
        style={styles.headerImage} // Adicione este estilo para controlar tamanho e outros
      />
      <Text style={styles.headerTitle}>{title}</Text>
    </View>
  );
};

export default DashboardHeader;