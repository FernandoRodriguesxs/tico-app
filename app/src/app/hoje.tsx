import { useEffect, useRef, useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ChatBubble } from '@/components/chat-bubble';
import { ChatInput } from '@/components/chat-input';
import { MealCard } from '@/components/meal-card';
import { ProgressRing } from '@/components/progress-ring';
import { StatusPill } from '@/components/status-pill';
import { buildMeal, type Meal } from '@/lib/estimator';
import { getGoal } from '@/lib/storage';

// Tela 03 — Hoje. Anel de progresso + feed conversacional + input.
export default function Hoje() {
  const [goal, setGoal] = useState(2000);
  const [meals, setMeals] = useState<Meal[]>([]);
  const [draft, setDraft] = useState('');
  const scrollRef = useRef<ScrollView>(null);

  useEffect(() => {
    getGoal().then((g) => {
      if (g != null) setGoal(g);
    });
  }, []);

  // Rola o feed pro fim sempre que chega uma refeição nova.
  useEffect(() => {
    scrollRef.current?.scrollToEnd({ animated: true });
  }, [meals]);

  const consumed = meals.reduce((acc, m) => acc + m.kcal, 0);

  const send = () => {
    if (!draft.trim()) return;
    setMeals((prev) => [...prev, buildMeal(draft)]);
    setDraft('');
  };

  return (
    <View className="flex-1 bg-cream">
      <SafeAreaView className="flex-1" edges={['top']}>
        <View className="items-center gap-[13px] px-6 pb-5 pt-6">
          <Text className="font-nunito-x text-[15px] uppercase tracking-[0.6px] text-muted">Hoje</Text>
          <ProgressRing consumed={consumed} goal={goal} />
          <StatusPill consumed={consumed} goal={goal} />
        </View>

        <ScrollView
          ref={scrollRef}
          className="flex-1 px-[22px]"
          contentContainerStyle={{ gap: 12, paddingTop: 18, paddingBottom: 12 }}
          keyboardShouldPersistTaps="handled"
        >
          <ChatBubble from="bot" text="Oi! Me conta o que você comeu que eu vou somando 🐿️" />
          {meals.map((m, i) => (
            <View key={i} style={{ gap: 12 }}>
              <ChatBubble from="user" text={m.text} />
              <ChatBubble from="bot" text={m.reply} />
              <MealCard emoji={m.emoji} food={m.food} kcal={m.kcal} />
            </View>
          ))}
        </ScrollView>

        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <ChatInput value={draft} onChangeText={setDraft} onSend={send} />
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}
