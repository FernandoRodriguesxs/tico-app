import { useRef } from 'react';
import { TextInput, View } from 'react-native';

type Props = {
  value: string;
  onChange: (code: string) => void;
};

export function OtpInput({ value, onChange }: Props) {
  const refs = useRef<Array<TextInput | null>>([]);
  const digits = Array.from({ length: 6 }, (_, i) => value[i] ?? '');

  const handleChange = (text: string) => {
    const digit = text.replace(/\D/g, '').slice(-1);
    if (!digit) return;
    const next = (value + digit).slice(0, 6);
    onChange(next);
    refs.current[Math.min(next.length, 5)]?.focus();
  };

  const handleKey = (key: string) => {
    if (key !== 'Backspace' || value.length === 0) return;
    const next = value.slice(0, -1);
    onChange(next);
    refs.current[next.length]?.focus();
  };

  return (
    <View className="flex-row justify-center gap-[9px]">
      {digits.map((digit, i) => (
        <TextInput
          key={i}
          ref={(el) => {
            refs.current[i] = el;
          }}
          value={digit}
          onChangeText={handleChange}
          onKeyPress={(e) => handleKey(e.nativeEvent.key)}
          keyboardType="number-pad"
          maxLength={1}
          autoFocus={i === 0}
          className="h-[62px] w-[48px] rounded-[16px] border-2 border-field bg-white text-center font-baloo-x text-[30px] text-ink focus:border-brand"
        />
      ))}
    </View>
  );
}
