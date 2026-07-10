import { Text, View } from 'react-native';

import { fmt } from '@/lib/theme';

type Props = {
  emoji: string;
  food: string;
  kcal: number;
};

// Card de refeição registrada: emoji + alimento + kcal.
export function MealCard({ emoji, food, kcal }: Props) {
  return (
    <View
      className="flex-row items-center gap-3 self-stretch rounded-[18px] bg-white px-[14px] py-3"
      style={{
        shadowColor: '#2B2119',
        shadowOpacity: 0.06,
        shadowRadius: 14,
        shadowOffset: { width: 0, height: 5 },
        elevation: 2,
      }}
    >
      <View className="h-[42px] w-[42px] items-center justify-center rounded-[13px] bg-card">
        <Text className="text-[22px]">{emoji}</Text>
      </View>
      <View className="min-w-0 flex-1 gap-[2px]">
        <Text className="font-nunito-x text-[15px] leading-[19px] text-ink">{food}</Text>
        <Text className="font-nunito-semi text-[13px] text-muted">refeição registrada</Text>
      </View>
      <Text className="font-baloo text-[18px] text-brand">{fmt(kcal)} kcal</Text>
    </View>
  );
}
