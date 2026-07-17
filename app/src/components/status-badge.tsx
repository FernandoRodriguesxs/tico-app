import { Text, View } from 'react-native';

import { dayStatus } from '@/lib/day-status';

type Props = {
  consumed: number;
  goal: number;
  size?: 'sm' | 'lg';
};

export function StatusBadge({ consumed, goal, size = 'sm' }: Props) {
  const status = dayStatus(consumed, goal);
  const box = size === 'lg' ? 'px-4 py-[7px]' : 'px-3 py-[6px]';
  const text = size === 'lg' ? 'text-[14px]' : 'text-[13px]';

  return (
    <View className={`rounded-full ${box}`} style={{ backgroundColor: status.bgColor }}>
      <Text className={`font-nunito-x ${text}`} style={{ color: status.textColor }}>
        {status.label}
      </Text>
    </View>
  );
}
