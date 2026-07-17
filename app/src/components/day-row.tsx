import { Pressable, Text, View } from 'react-native';
import { router } from 'expo-router';
import Svg, { Path } from 'react-native-svg';

import { MiniRing } from '@/components/mini-ring';
import { StatusBadge } from '@/components/status-badge';
import { COLORS, fmt } from '@/lib/theme';
import { dayLabel } from '@/lib/dates';

type Props = {
  date: string;
  totalKcal: number;
  goal: number;
};

export function DayRow({ date, totalKcal, goal }: Props) {
  return (
    <Pressable
      onPress={() => router.push({ pathname: '/dia/[date]', params: { date } })}
      className="flex-row items-center gap-[14px] rounded-[22px] bg-white p-4 active:scale-[0.99]"
      style={{
        shadowColor: '#2B2119',
        shadowOpacity: 0.06,
        shadowRadius: 16,
        shadowOffset: { width: 0, height: 5 },
        elevation: 2,
      }}
    >
      <MiniRing consumed={totalKcal} goal={goal} />
      <View className="min-w-0 flex-1 gap-[3px]">
        <Text className="font-baloo text-[18px] leading-[22px] text-ink">{dayLabel(date)}</Text>
        <Text className="font-nunito-bold text-[14px] text-muted">{fmt(totalKcal)} kcal</Text>
      </View>
      <View className="flex-row items-center gap-2">
        <StatusBadge consumed={totalKcal} goal={goal} />
        <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
          <Path d="M9 6l6 6-6 6" stroke={COLORS.chevron} strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" />
        </Svg>
      </View>
    </Pressable>
  );
}
