import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform } from 'react-native';
import { CalculationType } from '@/types/calculation';
import { CheckCircle } from 'lucide-react-native';
// Removido ArrowLeft e CheckSquare, pois a navegação de voltar é pelo header do router
// e o toggle de modo será feito pelo headerRight na tela.
import MathJax from 'react-native-mathjax'; // Adicionado para LaTeX

interface LearningViewProps {
  calculation: CalculationType;
  // onMarkModuleComplete e isModuleCompleted removidos
}

const AppColors = {
  primary: '#007AFF',
  secondary: '#5856D6',
  background: '#F2F2F7',
  cardBackground: '#FFFFFF',
  text: '#000000',
  textSecondary: '#3C3C4399',
  accentGreen: '#34C759',
  buttonText: '#FFFFFF',
};

// Conteúdo de aprendizado placeholder (mesmo de antes, pode ser expandido)
const getLearningContent = (calculationId: string): { title: string; paragraphs: string[], formulas?: string[] } => {
  switch (calculationId) {
    case 'head-loss':
      return {
        title: 'Perda de Carga Localizada',
        paragraphs: [
          'A perda de carga localizada (ou singular) ocorre devido a distúrbios no fluxo causados por componentes como curvas, válvulas, cotovelos, tês, expansões, contrações, etc.',
          'Essas perdas são adicionais à perda de carga distribuída (atrito ao longo de tubos retos).',
          'São quantificadas usando um coeficiente de perda adimensional (K), que é específico para cada tipo de componente e, às vezes, para o número de Reynolds.',
          'A energia perdida é convertida em calor devido à turbulência e separação do fluxo.',
        ],
        formulas: ['h_L = K * (V² / 2g)', 'Onde:', 'h_L: Perda de carga localizada (m)', 'K: Coeficiente de perda (adimensional)', 'V: Velocidade média do fluido (m/s)','g: Aceleração da gravidade (9.81 m/s²)']
      };
    case 'pipe-flow':
      return {
        title: 'Vazão em Tubulações',
        paragraphs: [
            'A vazão (Q) é o volume de fluido que atravessa uma seção transversal da tubulação por unidade de tempo (ex: m³/s, L/min).',
            'Para fluxo incompressível e permanente em um tubo, a vazão é constante. Q = A * V, onde A é a área da seção e V é a velocidade média.',
            'O cálculo da vazão pode depender do regime de escoamento (laminar ou turbulento) e das propriedades do fluido e da tubulação.',
            'Em fluxo laminar em tubos circulares, a equação de Hagen-Poiseuille é aplicável: Q = (π * ΔP * D⁴) / (128 * μ * L).',
            'Em fluxo turbulento, a equação de Darcy-Weisbach relaciona a perda de carga com a vazão, necessitando do fator de atrito.',
        ],
        formulas: ['Q = A * V', 'Hagen-Poiseuille (laminar):', 'Q = (π * ΔP * D⁴) / (128 * μ * L)']
      };
    case 'pressure-drop':
        return {
            title: 'Perda de Pressão Contínua',
            paragraphs: [
                'A perda de pressão contínua, também conhecida como perda de carga distribuída, é a redução de pressão que ocorre ao longo de um trecho reto de tubulação.',
                'É causada principalmente pelo atrito entre o fluido em movimento e a superfície interna da tubulação.',
                'A equação de Darcy-Weisbach é a mais utilizada para calcular essa perda: h_f = f * (L/D) * (V² / 2g), onde h_f é a perda de carga em metros de coluna de fluido.',
                'Para converter para perda de pressão (ΔP): ΔP = ρ * g * h_f.',
                'O fator de atrito (f) é crucial e depende do Número de Reynolds (Re) e da rugosidade relativa da tubulação (ε/D). Para fluxo laminar, f = 64/Re. Para fluxo turbulento, usa-se o Diagrama de Moody ou equações como a de Colebrook-White.',
            ],
            formulas: ['h_f = f * (L/D) * (V² / 2g)', 'ΔP = ρ * g * h_f', 'f = 64/Re (para fluxo laminar)']
        };
    case 'pump-power':
        return {
            title: 'Potência da Bomba',
            paragraphs: [
                'A potência da bomba é a energia por unidade de tempo necessária para mover um fluido.',
                'Potência Hidráulica (P_h): É a potência efetivamente transferida ao fluido. P_h = ρ * g * Q * H_t',
                'Onde ρ é a densidade do fluido, g é a aceleração da gravidade, Q é a vazão e H_t é a altura manométrica total (energia adicionada pela bomba por unidade de peso do fluido).',
                'Potência de Eixo (P_eixo ou Brake Horsepower - BHP): É a potência que deve ser fornecida ao eixo da bomba. P_eixo = P_h / η_bomba',
                'η_bomba é a eficiência total da bomba, que considera perdas hidráulicas, mecânicas e volumétricas.',
                'A potência do motor (P_motor) deve ser maior que P_eixo, considerando a eficiência do motor: P_motor = P_eixo / η_motor.',
            ],
            formulas: ['P_h = ρ * g * Q * H_t', 'P_eixo = P_h / η_bomba']
        };
    case 'flow-velocity':
        return {
            title: 'Velocidade do Fluxo',
            paragraphs: [
                'A velocidade média do fluxo (V) em uma tubulação é a vazão volumétrica (Q) dividida pela área da seção transversal (A) do escoamento: V = Q / A.',
                'Para um tubo de seção circular, a área A = π * D² / 4, onde D é o diâmetro interno do tubo.',
                'A velocidade é um parâmetro fundamental em mecânica dos fluidos, influenciando o regime de escoamento (laminar ou turbulento), perdas de carga e forças exercidas pelo fluido.',
                'Em projetos, velocidades excessivas podem causar erosão, ruído e altas perdas de pressão, enquanto velocidades muito baixas podem levar à sedimentação de partículas em suspensão.',
            ],
            formulas: ['V = Q / A', 'A = π * D² / 4 (para tubos circulares)']
        };
    case 'reynolds-number':
        return {
            title: 'Número de Reynolds',
            paragraphs: [
                'O Número de Reynolds (Re) é um parâmetro adimensional crucial na mecânica dos fluidos. Ele representa a razão entre as forças de inércia e as forças viscosas dentro de um fluido.',
                'É usado para prever o regime de escoamento: laminar (fluxo suave e ordenado) ou turbulento (fluxo caótico e com vórtices).',
                'Para escoamento em tubos: Re = (ρ * V * D) / μ = (V * D) / ν',
                'Onde:',
                '  ρ (rho) = densidade do fluido (kg/m³)',
                '  V = velocidade média do fluido (m/s)',
                '  D = diâmetro hidráulico do tubo (m)',
                '  μ (mu) = viscosidade dinâmica do fluido (Pa·s ou kg/(m·s))',
                '  ν (nu) = viscosidade cinemática do fluido (m²/s), ν = μ/ρ',
                'Regimes típicos para tubos:',
                '  Re < 2300: Fluxo laminar',
                '  2300 ≤ Re ≤ 4000: Fluxo de transição',
                '  Re > 4000: Fluxo turbulento',
            ],
            formulas: ['Re = (ρ * V * D) / μ', 'Re = (V * D) / ν']
        };
    default:
      return {
        title: 'Módulo de Aprendizado',
        paragraphs: ['Conteúdo de aprendizado para este cálculo ainda não disponível.'],
      };
  }
};

const LearningViewComponent: React.FC<LearningViewProps> = ({
  calculation,
  // onMarkModuleComplete e isModuleCompleted removidos das props
}) => {
  const content = getLearningContent(calculation.id);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContentContainer}>
      {/* O Header com título e botões de ação (voltar, alternar modo) foi movido para a tela (app/learning/[id].tsx) */}
      <View style={styles.contentCard}>
        {content.paragraphs.map((paragraph, index) => (
          <Text key={`p-${index}`} style={styles.paragraph}>
            {paragraph}
          </Text>
        ))}
        {content.formulas && content.formulas.length > 0 && (
          <View style={styles.formulasContainer}>
            <Text style={styles.formulaTitle}>Fórmulas Relevantes:</Text>
            {content.formulas.map((formulaString, index) => {
              // Heurística simples para detectar LaTeX. Pode precisar de ajuste.
              const isLatex = /[\\{}^_]/.test(formulaString) || formulaString.includes('²') || formulaString.includes('³') || formulaString.includes('⁴');
              if (isLatex || formulaString.startsWith('h_L') || formulaString.startsWith('Q =') || formulaString.startsWith('h_f') || formulaString.startsWith('P_h') || formulaString.startsWith('P_eixo') || formulaString.startsWith('V =') || formulaString.startsWith('Re =') || formulaString.startsWith('A =') || formulaString.startsWith('ΔP')) {
                return (
                  <MathJax
                    key={`f-${index}`}
                    style={styles.formulaItem}
                    html={`<p style="font-size: 15px; line-height: 22px; color: ${AppColors.textSecondary}; margin-bottom: 4px; font-family: ${Platform.OS === 'ios' ? 'Menlo' : 'monospace'};">$$${formulaString}$$</p>`}
                  />
                );
              }
              // Se não parecer LaTeX, renderiza como texto normal, mas ainda com estilo de item de fórmula
              return (
                <Text key={`f-${index}`} style={[styles.formulaItem, styles.formulaDescription]}>
                  {formulaString}
                </Text>
              );
            })}
          </View>
        )}
      </View>

      {/* Seção de "Marcar como Concluído" e "Módulo Concluído" removida */}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColors.background,
  },
  scrollContentContainer: {
    padding: 16,
  },
  // Header styles foram removidos daqui pois o header é gerenciado pelo Stack Navigator na tela
  contentCard: {
    backgroundColor: AppColors.cardBackground,
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
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
  paragraph: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 12,
    color: AppColors.textSecondary,
  },
  formulasContainer: {
    marginTop: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: AppColors.background,
  },
  formulaTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: AppColors.text,
    marginBottom: 8,
  },
  formulaItem: {
    fontSize: 15,
    lineHeight: 22,
    color: AppColors.textSecondary,
    marginBottom: 4,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    // Ajustado para ser um estilo base para MathJax e Text
  },
  formulaDescription: { // Estilo para texto não-LaTeX dentro da lista de fórmulas
    fontSize: 15, // Consistente com o tamanho da fonte no MathJax
    lineHeight: 22,
    color: AppColors.textSecondary,
    marginBottom: 4,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  completeButton: {
    backgroundColor: AppColors.accentGreen,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  completeButtonText: {
    color: AppColors.buttonText,
    fontSize: 17,
    fontWeight: '600',
    marginLeft: 8,
  },
  // Estilos de completedMessageContainer e completedMessageText removidos
});

export default LearningViewComponent; // Renomeado para evitar conflito
