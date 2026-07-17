import { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, Text, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';

import { DetailMealCard } from '@/components/detail-meal-card';
import { ProgressRing } from '@/components/progress-ring';
import { StatusBadge } from '@/components/status-badge';
import * as api from '@/lib/api';
import { emojiFor } from '@/lib/meal-display';
import { COLORS } from '@/lib/theme';
import { dayLabel, daySubtitle } from '@/lib/dates';

export default function DiaDetalhe() {
  const { date } = useLocalSearchParams<{ date: string }>();
  const [goal, setGoal] = useState(2000);
  const [meals, setMeals] = useState<api.ApiMeal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let active = true;
    (async () => {
      setLoading(true);
      setError(false);
      try {
        const [me, list] = await Promise.all([api.getMe(), api.getMeals(date)]);
        if (!active) return;
        setGoal(me.dailyGoalKcal);
        setMeals(list);
      } catch {
        if (active) setError(true);
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, [date]);

  const consumed = meals.reduce((acc, m) => acc + m.kcal, 0);

  return (
    <View className="flex-1 bg-cream">
      <SafeAreaView className="flex-1" edges={['top']}>
        <View className="flex-row items-center gap-3 px-5 pb-4 pt-2">
          <Pressable
            onPress={() => router.back()}
            className="h-11 w-11 items-center justify-center rounded-full bg-white active:scale-90"
            style={{
              shadowColor: '#2B2119',
              shadowOpacity: 0.07,
              shadowRadius: 12,
              shadowOffset: { width: 0, height: 4 },
              elevation: 3,
            }}
          >
            <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
              <Path d="M15 6l-6 6 6 6" stroke={COLORS.brand} strokeWidth={2.6} strokeLinecap="round" strokeLinejoin="round" />
            </Svg>
          </Pressable>
          <View>
            <Text className="font-baloo-x text-[24px] leading-[28px] text-ink">{dayLabel(date)}</Text>
            <Text className="mt-[2px] font-nunito-semi text-[14px] text-muted">{daySubtitle(date)}</Text>
          </View>
        </View>

        {loading ? (
          <View className="flex-1 items-center justify-center">
            <ActivityIndicator color={COLORS.brand} />
          </View>
        ) : error ? (
          <View className="flex-1 items-center justify-center px-10">
            <Text className="text-center font-nunito-bold text-[16px] text-muted">
              Não consegui carregar esse dia 🐿️
            </Text>
          </View>
        ) : (
          <ScrollView className="flex-1 px-5" contentContainerStyle={{ gap: 12, paddingBottom: 24 }}>
            <View className="items-center gap-3 py-2">
              <ProgressRing consumed={consumed} goal={goal} />
              <StatusBadge consumed={consumed} goal={goal} size="lg" />
            </View>
            <Text className="mx-1 mt-1 font-nunito-x text-[13px] uppercase tracking-[0.4px] text-muted">
              Refeições do dia
            </Text>
            {meals.map((m) => (
              <DetailMealCard key={m.id} emoji={emojiFor(m.id)} food={m.food} kcal={m.kcal} />
            ))}
          </ScrollView>
        )}
      </SafeAreaView>
    </View>
  );
}
