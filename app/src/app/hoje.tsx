import { useEffect, useRef, useState } from 'react';
import { Keyboard, KeyboardAvoidingView, Platform, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ChatBubble } from '@/components/chat-bubble';
import { ChatInput } from '@/components/chat-input';
import { GoalEditorModal } from '@/components/goal-editor-modal';
import { MealCard } from '@/components/meal-card';
import { MealEditorModal } from '@/components/meal-editor-modal';
import { ProgressRing } from '@/components/progress-ring';
import { StatusPill } from '@/components/status-pill';
import { buildMeal, type Meal } from '@/lib/estimator';
import { getGoal, setGoal as saveGoal } from '@/lib/storage';

export default function Hoje() {
  const [goal, setGoal] = useState(2000);
  const [meals, setMeals] = useState<Meal[]>([]);
  const [draft, setDraft] = useState('');
  const [editingGoal, setEditingGoal] = useState(false);
  const [editingMeal, setEditingMeal] = useState<Meal | null>(null);
  const nextId = useRef(1);
  const scrollRef = useRef<ScrollView>(null);

  useEffect(() => {
    getGoal().then((g) => {
      if (g != null) setGoal(g);
    });
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollToEnd({ animated: true });
  }, [meals]);

  const consumed = meals.reduce((acc, m) => acc + m.kcal, 0);

  const send = () => {
    if (!draft.trim()) return;
    setMeals((prev) => [...prev, { ...buildMeal(draft), id: nextId.current++ }]);
    setDraft('');
    Keyboard.dismiss();
  };

  const saveNewGoal = (newGoal: number) => {
    setGoal(newGoal);
    saveGoal(newGoal);
    setEditingGoal(false);
  };

  const saveMeal = (id: number, food: string, kcal: number) => {
    setMeals((prev) => prev.map((m) => (m.id === id ? { ...m, food, kcal } : m)));
    setEditingMeal(null);
  };

  const deleteMeal = (id: number) => {
    setMeals((prev) => prev.filter((m) => m.id !== id));
    setEditingMeal(null);
  };

  return (
    <View className="flex-1 bg-cream">
      <SafeAreaView className="flex-1" edges={['top']}>
        <View className="items-center gap-[13px] px-6 pb-5 pt-6">
          <Text className="font-nunito-x text-[15px] uppercase tracking-[0.6px] text-muted">Hoje</Text>
          <Pressable onPress={() => setEditingGoal(true)} className="active:opacity-70">
            <ProgressRing consumed={consumed} goal={goal} />
          </Pressable>
          <StatusPill consumed={consumed} goal={goal} />
        </View>

        <ScrollView
          ref={scrollRef}
          className="flex-1 px-[22px]"
          contentContainerStyle={{ gap: 12, paddingTop: 18, paddingBottom: 12 }}
          keyboardShouldPersistTaps="handled"
        >
          <ChatBubble from="bot" text="Oi! Me conta o que você comeu que eu vou somando 🐿️" />
          {meals.map((m) => (
            <View key={m.id} style={{ gap: 12 }}>
              <ChatBubble from="user" text={m.text} />
              <ChatBubble from="bot" text={m.reply} />
              <MealCard emoji={m.emoji} food={m.food} kcal={m.kcal} onPress={() => setEditingMeal(m)} />
            </View>
          ))}
        </ScrollView>

        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <ChatInput value={draft} onChangeText={setDraft} onSend={send} />
        </KeyboardAvoidingView>
      </SafeAreaView>

      <GoalEditorModal
        visible={editingGoal}
        goal={goal}
        onClose={() => setEditingGoal(false)}
        onSave={saveNewGoal}
      />

      <MealEditorModal
        meal={editingMeal}
        onClose={() => setEditingMeal(null)}
        onSave={saveMeal}
        onDelete={deleteMeal}
      />
    </View>
  );
}
