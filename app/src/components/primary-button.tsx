import { Pressable, Text } from 'react-native';

type Props = {
  label: string;
  onPress: () => void;
};

export function PrimaryButton({ label, onPress }: Props) {
  return (
    <Pressable
      onPress={onPress}
      className="h-[62px] items-center justify-center rounded-[24px] bg-brand active:scale-[0.98]"
      style={{
        shadowColor: '#FC6C26',
        shadowOpacity: 0.42,
        shadowRadius: 26,
        shadowOffset: { width: 0, height: 12 },
        elevation: 8,
      }}
    >
      <Text className="font-baloo text-[22px] text-white">{label}</Text>
    </Pressable>
  );
}
