import { useState } from 'react';
import { Alert, Image, Text, View } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

import { GoalStepper } from '@/components/goal-stepper';
import { PrimaryButton } from '@/components/primary-button';
import { SpeechBubble } from '@/components/speech-bubble';
import { updateGoal } from '@/lib/api';

const STEP = 50;
const MIN = 800;
const MAX = 5000;

export default function Onboarding() {
  const [goal, setGoalState] = useState(2000);
  const [saving, setSaving] = useState(false);

  const finish = async () => {
    if (saving) return;
    setSaving(true);
    try {
      await updateGoal(goal);
      router.replace('/hoje');
    } catch {
      setSaving(false);
      Alert.alert('Ops', 'Não consegui salvar sua meta 🐿️\nVeja se o servidor está no ar e tente de novo.');
    }
  };

  return (
    <View className="flex-1 bg-cream">
      <SafeAreaView className="flex-1 px-[26px] pb-9" edges={['top', 'bottom']}>
        <View className="items-center gap-4 pt-8">
          <Image
            source={require('../../assets/tico.png')}
            style={{ width: 128, height: 128, resizeMode: 'contain' }}
          />
          <SpeechBubble>Oi! Eu sou o Tico 🐿️{'\n'}Qual a sua meta de calorias por dia?</SpeechBubble>
        </View>

        <View className="flex-1 items-center justify-center gap-2">
          <GoalStepper
            goal={goal}
            onDec={() => setGoalState((g) => Math.max(g - STEP, MIN))}
            onInc={() => setGoalState((g) => Math.min(g + STEP, MAX))}
          />
          <Text className="mt-1 font-nunito-semi text-[14px] text-muted-light">
            dá pra mudar depois, relaxa 🌿
          </Text>
        </View>

        <PrimaryButton label={saving ? 'Salvando…' : 'Começar'} onPress={finish} />
      </SafeAreaView>
    </View>
  );
}
