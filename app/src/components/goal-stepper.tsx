import { Pressable, Text, View } from 'react-native';

import { fmt } from '@/lib/theme';

type Props = {
  goal: number;
  onDec: () => void;
  onInc: () => void;
  size?: 'lg' | 'md';
};

const SIZES = {
  lg: { btn: 'h-[62px] w-[62px]', sign: 'text-[38px] leading-[48px]', num: 'text-[74px] leading-[92px]', minW: 'min-w-[168px]', gap: 'gap-6' },
  md: { btn: 'h-[52px] w-[52px]', sign: 'text-[32px] leading-[40px]', num: 'text-[56px] leading-[70px]', minW: 'min-w-[120px]', gap: 'gap-4' },
} as const;

function StepButton({ label, onPress, btn, sign }: { label: string; onPress: () => void; btn: string; sign: string }) {
  return (
    <Pressable
      onPress={onPress}
      className={`${btn} items-center justify-center rounded-full border-2 border-line bg-white active:scale-95`}
      style={{
        shadowColor: '#2B2119',
        shadowOpacity: 0.08,
        shadowRadius: 12,
        shadowOffset: { width: 0, height: 4 },
        elevation: 3,
      }}
    >
      <Text className={`font-baloo text-brand ${sign}`}>{label}</Text>
    </Pressable>
  );
}

export function GoalStepper({ goal, onDec, onInc, size = 'lg' }: Props) {
  const s = SIZES[size];
  return (
    <View className={`flex-row items-center ${s.gap}`}>
      <StepButton label="−" onPress={onDec} btn={s.btn} sign={s.sign} />
      <View className={`${s.minW} items-center`}>
        <Text className={`font-baloo-x text-brand ${s.num}`}>{fmt(goal)}</Text>
        <Text className="mt-[6px] font-nunito-bold text-[16px] text-muted">kcal por dia</Text>
      </View>
      <StepButton label="+" onPress={onInc} btn={s.btn} sign={s.sign} />
    </View>
  );
}
