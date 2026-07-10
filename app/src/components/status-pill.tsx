import { Text, View } from 'react-native';

import { COLORS, fmt } from '@/lib/theme';

type Props = {
  consumed: number;
  goal: number;
};

// Pílula de status "sem culpa": "faltam X kcal" (verde) ou "passou X kcal" (vermelho).
export function StatusPill({ consumed, goal }: Props) {
  const remaining = goal - consumed;
  const over = remaining < 0;
  const color = over ? COLORS.over : COLORS.success;
  const label = over ? `passou ${fmt(-remaining)} kcal` : `faltam ${fmt(remaining)} kcal`;

  return (
    <View
      className="flex-row items-center gap-2 rounded-full bg-white px-[18px] py-[9px]"
      style={{
        shadowColor: '#2B2119',
        shadowOpacity: 0.07,
        shadowRadius: 14,
        shadowOffset: { width: 0, height: 5 },
        elevation: 3,
      }}
    >
      <View className="h-[9px] w-[9px] rounded-full" style={{ backgroundColor: color }} />
      <Text className="font-nunito-x text-[15px]" style={{ color }}>
        {label}
      </Text>
    </View>
  );
}
