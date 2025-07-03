import AsyncStorage from '@react-native-async-storage/async-storage';
import { CalculationHistory } from '@/types/calculation';
import { HISTORY_KEY, STREAK_KEY, LAST_CALC_DATE_KEY } from './storageKeys';

// Funções Genéricas
export const getItem = async <T>(key: string): Promise<T | null> => {
  try {
    const jsonValue = await AsyncStorage.getItem(key);
    return jsonValue != null ? JSON.parse(jsonValue) as T : null;
  } catch (e) {
    console.error(`Failed to get item for key "${key}" from AsyncStorage:`, e);
    return null;
  }
};

export const setItem = async <T>(key: string, value: T): Promise<boolean> => {
  try {
    const jsonValue = JSON.stringify(value);
    await AsyncStorage.setItem(key, jsonValue);
    return true;
  } catch (e) {
    console.error(`Failed to set item for key "${key}" in AsyncStorage:`, e);
    return false;
  }
};

export const removeItem = async (key: string): Promise<boolean> => {
  try {
    await AsyncStorage.removeItem(key);
    return true;
  } catch (e) {
    console.error(`Failed to remove item for key "${key}" from AsyncStorage:`, e);
    return false;
  }
};

// Funções Específicas para Histórico
export const loadHistory = async (): Promise<CalculationHistory[]> => {
  const history = await getItem<CalculationHistory[]>(HISTORY_KEY);
  return history || [];
};

export const saveHistoryEntry = async (calculationEntry: CalculationHistory): Promise<CalculationHistory[]> => {
  let currentHistory = await loadHistory();
  // Adiciona a nova entrada no início e limita o histórico a 50 itens
  const newHistory = [calculationEntry, ...currentHistory.slice(0, 49)];
  await setItem<CalculationHistory[]>(HISTORY_KEY, newHistory);
  return newHistory;
};

export const clearHistoryStorage = async (): Promise<boolean> => {
  return await removeItem(HISTORY_KEY);
};

// Funções Específicas para Streak e Data da Última Calculação
export const loadStreakData = async (): Promise<{ streak: number; lastCalcDate: string | null }> => {
  const streak = await getItem<number>(STREAK_KEY);
  const lastCalcDate = await getItem<string>(LAST_CALC_DATE_KEY);
  return { streak: streak || 0, lastCalcDate };
};

export const updateStreakAndLastCalcDate = async (): Promise<{ newStreak: number; newLastCalcDate: string }> => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayISO = today.toISOString();

  const { streak: currentStreak, lastCalcDate: lastCalcDateStr } = await loadStreakData();
  let newStreak = currentStreak;

  if (lastCalcDateStr) {
    const lastCalcDate = new Date(lastCalcDateStr);
    lastCalcDate.setHours(0, 0, 0, 0);

    const diffTime = today.getTime() - lastCalcDate.getTime();
    const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) {
      newStreak += 1;
    } else if (diffDays > 1) {
      newStreak = 1; // Reseta o streak se mais de um dia se passou
    }
    // Se diffDays === 0, o streak não muda (já calculou hoje)
    // Se diffDays < 0, algo está errado (data futura), não deveria acontecer
  } else {
    newStreak = 1; // Primeiro cálculo
  }

  await setItem<number>(STREAK_KEY, newStreak);
  await setItem<string>(LAST_CALC_DATE_KEY, todayISO);

  console.log("Streak atualizado via asyncStorage.ts:", newStreak, "Última data:", todayISO);
  return { newStreak, newLastCalcDate: todayISO };
};

// Outras funções de utilidade para AsyncStorage podem ser adicionadas aqui
// Ex: para módulos de aprendizado, configurações do usuário, etc.
