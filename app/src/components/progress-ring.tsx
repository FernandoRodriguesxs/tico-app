import { Text, View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';

import { COLORS, fmt } from '@/lib/theme';

// Circunferência do anel (2·π·r com r=85), igual ao design.
const CIRCUMFERENCE = 534.07;

type Props = {
  consumed: number;
  goal: number;
};

// Anel de progresso: consumido vs. meta. Fica vermelho ao passar da meta.
export function ProgressRing({ consumed, goal }: Props) {
  const over = consumed > goal;
  const pct = goal > 0 ? Math.min(consumed / goal, 1) : 0;
  const offset = CIRCUMFERENCE * (1 - pct);

  return (
    <View className="h-[204px] w-[204px] items-center justify-center">
      <Svg width={204} height={204} viewBox="0 0 204 204" style={{ transform: [{ rotate: '-90deg' }] }}>
        <Circle cx={102} cy={102} r={85} fill="none" stroke={COLORS.ringTrack} strokeWidth={21} />
        <Circle
          cx={102}
          cy={102}
          r={85}
          fill="none"
          stroke={over ? COLORS.over : COLORS.brand}
          strokeWidth={21}
          strokeLinecap="round"
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={offset}
        />
      </Svg>
      <View className="absolute inset-0 items-center justify-center">
        <Text className="font-baloo-x text-[52px] leading-[52px] text-ink">{fmt(consumed)}</Text>
        <Text className="mt-1 font-nunito-bold text-[15px] text-muted">de {fmt(goal)} kcal</Text>
      </View>
    </View>
  );
}
