import { useCallback, useState } from 'react';
import { ActivityIndicator, Image, Pressable, ScrollView, Text, View } from 'react-native';
import { router, useFocusEffect } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

import { DayRow } from '@/components/day-row';
import * as api from '@/lib/api';
import { clearToken } from '@/lib/session';
import { COLORS } from '@/lib/theme';
import { todayKey } from '@/lib/dates';

export default function Historico() {
  const [goal, setGoal] = useState(2000);
  const [days, setDays] = useState<api.DaySummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      const [me, history] = await Promise.all([api.getMe(), api.getDays()]);
      setGoal(me.dailyGoalKcal);
      setDays(history);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load]),
  );

  const logout = async () => {
    await clearToken();
    router.replace('/login/email');
  };

  const tKey = todayKey();
  const rows =
    days.length === 0 ? [] : days.some((d) => d.date === tKey) ? days : [{ date: tKey, totalKcal: 0 }, ...days];

  return (
    <View className="flex-1 bg-cream">
      <SafeAreaView className="flex-1" edges={['top']}>
        <View className="flex-row items-start justify-between px-6 pb-[14px] pt-2">
          <View className="flex-1">
            <Text className="font-baloo-x text-[30px] leading-[36px] text-ink">Histórico</Text>
            <Text className="mt-1 font-nunito-semi text-[15px] text-muted">seus últimos dias, sem cobrança 🌿</Text>
          </View>
          <Pressable onPress={logout} className="mt-1 p-1 active:opacity-60">
            <Text className="font-nunito-x text-[14px] text-muted-light">Sair</Text>
          </Pressable>
        </View>

        {loading ? (
          <View className="flex-1 items-center justify-center">
            <ActivityIndicator color={COLORS.brand} />
          </View>
        ) : error ? (
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
        ) : rows.length === 0 ? (
          <View className="flex-1 items-center justify-center gap-1 px-10">
            <Image
              source={require('../../../assets/tico.png')}
              style={{ width: 148, height: 148, resizeMode: 'contain' }}
            />
            <Text className="mt-3 text-center font-baloo-x text-[22px] text-ink">
              seu histórico aparece aqui 🐿️
            </Text>
            <Text className="text-center font-nunito-semi text-[15px] leading-[22px] text-muted">
              assim que você registrar suas refeições, cada dia vira uma linha aqui pra você olhar sem pressa.
            </Text>
          </View>
        ) : (
          <ScrollView className="flex-1 px-5" contentContainerStyle={{ gap: 12, paddingBottom: 16 }}>
            {rows.map((d) => (
              <DayRow key={d.date} date={d.date} totalKcal={d.totalKcal} goal={goal} />
            ))}
          </ScrollView>
        )}
      </SafeAreaView>
    </View>
  );
}
