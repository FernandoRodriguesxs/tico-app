import { Pressable, Text, View } from 'react-native';

import { fmt } from '@/lib/theme';

type Props = {
  goal: number;
  onDec: () => void;
  onInc: () => void;
};

function StepButton({ label, onPress }: { label: string; onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      className="h-[62px] w-[62px] items-center justify-center rounded-full border-2 border-line bg-white active:scale-95"
      style={{
        shadowColor: '#2B2119',
        shadowOpacity: 0.08,
        shadowRadius: 12,
        shadowOffset: { width: 0, height: 4 },
        elevation: 3,
      }}
    >
      <Text className="font-baloo text-[38px] leading-[48px] text-brand">{label}</Text>
    </Pressable>
  );
}

// Seletor de meta diária: − [número] +.
export function GoalStepper({ goal, onDec, onInc }: Props) {
  return (
    <View className="flex-row items-center gap-6">
      <StepButton label="−" onPress={onDec} />
      <View className="min-w-[168px] items-center">
        <Text className="font-baloo-x text-[74px] leading-[92px] text-brand">{fmt(goal)}</Text>
        <Text className="mt-[6px] font-nunito-bold text-[16px] text-muted">kcal por dia</Text>
      </View>
      <StepButton label="+" onPress={onInc} />
    </View>
  );
}
