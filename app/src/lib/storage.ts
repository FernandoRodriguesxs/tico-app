import AsyncStorage from '@react-native-async-storage/async-storage';

const GOAL_KEY = '@tico/meta-diaria';

// Lê a meta de calorias salva. Retorna null se ainda não houve onboarding.
export async function getGoal(): Promise<number | null> {
  const raw = await AsyncStorage.getItem(GOAL_KEY);
  if (raw == null) return null;
  const n = parseInt(raw, 10);
  return Number.isNaN(n) ? null : n;
}

// Salva a meta escolhida no onboarding.
export async function setGoal(goal: number): Promise<void> {
  await AsyncStorage.setItem(GOAL_KEY, String(goal));
}
