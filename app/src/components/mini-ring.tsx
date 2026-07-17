import { View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';

import { COLORS } from '@/lib/theme';

const CIRCUMFERENCE = 100.53;

type Props = {
  consumed: number;
  goal: number;
};

export function MiniRing({ consumed, goal }: Props) {
  const over = consumed > goal;
  const pct = goal > 0 ? Math.min(consumed / goal, 1) : 0;
  const offset = CIRCUMFERENCE * (1 - pct);

  return (
    <View className="h-11 w-11">
      <Svg width={44} height={44} viewBox="0 0 44 44" style={{ transform: [{ rotate: '-90deg' }] }}>
        <Circle cx={22} cy={22} r={16} fill="none" stroke={COLORS.ringTrack} strokeWidth={5} />
        <Circle
          cx={22}
          cy={22}
          r={16}
          fill="none"
          stroke={over ? COLORS.over : COLORS.brand}
          strokeWidth={5}
          strokeLinecap="round"
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={offset}
        />
      </Svg>
    </View>
  );
}
