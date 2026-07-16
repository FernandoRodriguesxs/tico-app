import AsyncStorage from '@react-native-async-storage/async-storage';

const ONBOARDING_KEY = '@tico/onboarding-done';

export async function getOnboardingDone(): Promise<boolean> {
  const raw = await AsyncStorage.getItem(ONBOARDING_KEY);
  return raw === 'true';
}

export async function setOnboardingDone(done: boolean): Promise<void> {
  await AsyncStorage.setItem(ONBOARDING_KEY, done ? 'true' : 'false');
}
