import { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ChatBubble } from '@/components/chat-bubble';
import { ChatInput } from '@/components/chat-input';
import { GoalEditorModal } from '@/components/goal-editor-modal';
import { MealCard } from '@/components/meal-card';
import { MealEditorModal } from '@/components/meal-editor-modal';
import { ProgressRing } from '@/components/progress-ring';
import { StatusPill } from '@/components/status-pill';
import * as api from '@/lib/api';
import { emojiFor, pickReply, type UIMeal } from '@/lib/meal-display';
import { COLORS } from '@/lib/theme';

function notifyError() {
  Alert.alert('Ops', 'Não consegui falar com o servidor 🐿️\nVeja se ele está no ar e tente de novo.');
}

export default function Hoje() {
  const [goal, setGoal] = useState(2000);
  const [meals, setMeals] = useState<UIMeal[]>([]);
  const [draft, setDraft] = useState('');
  const [editingGoal, setEditingGoal] = useState(false);
  const [editingMeal, setEditingMeal] = useState<UIMeal | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const scrollRef = useRef<ScrollView>(null);

  const load = async () => {
    setLoading(true);
    setLoadError(false);
    try {
      const [me, list] = await Promise.all([api.getMe(), api.getMeals()]);
      setGoal(me.dailyGoalKcal);
      setMeals(list.map((m) => ({ ...m, emoji: emojiFor(m.id) })));
    } catch {
      setLoadError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollToEnd({ animated: true });
  }, [meals]);

  const consumed = meals.reduce((acc, m) => acc + m.kcal, 0);

  const send = async () => {
    const text = draft.trim();
    if (!text) return;
    setDraft('');
    Keyboard.dismiss();
    try {
      const created = await api.createMeal(text);
      setMeals((prev) => [...prev, { ...created, emoji: emojiFor(created.id), reply: pickReply() }]);
    } catch {
      notifyError();
    }
  };

  const saveNewGoal = async (newGoal: number) => {
    setEditingGoal(false);
    setGoal(newGoal);
    try {
      await api.updateGoal(newGoal);
    } catch {
      notifyError();
    }
  };

  const saveMeal = async (id: string, food: string, kcal: number) => {
    setEditingMeal(null);
    try {
      const updated = await api.updateMeal(id, { food, kcal });
      setMeals((prev) => prev.map((m) => (m.id === id ? { ...m, ...updated } : m)));
    } catch {
      notifyError();
    }
  };

  const deleteMeal = async (id: string) => {
    setEditingMeal(null);
    try {
      await api.deleteMeal(id);
      setMeals((prev) => prev.filter((m) => m.id !== id));
    } catch {
      notifyError();
    }
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

        {loading ? (
          <View className="flex-1 items-center justify-center">
            <ActivityIndicator color={COLORS.brand} />
          </View>
        ) : loadError ? (
          <View className="flex-1 items-center justify-center gap-3 px-10">
            <Text className="text-center font-nunito-bold text-[16px] text-muted">
              Não consegui carregar 🐿️{'\n'}O servidor está no ar?
            </Text>
            <Pressable
              onPress={load}
              className="h-[46px] items-center justify-center rounded-full bg-brand px-6 active:scale-95"
            >
              <Text className="font-baloo text-[16px] text-white">Tentar de novo</Text>
            </Pressable>
          </View>
        ) : (
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
                {m.reply ? <ChatBubble from="bot" text={m.reply} /> : null}
                <MealCard emoji={m.emoji} food={m.food} kcal={m.kcal} onPress={() => setEditingMeal(m)} />
              </View>
            ))}
          </ScrollView>
        )}

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
