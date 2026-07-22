import { Pressable, TextInput, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';

import { COLORS } from '@/lib/theme';

type Props = {
  value: string;
  onChangeText: (t: string) => void;
  onSend: () => void;
  onCamera: () => void;
};

export function ChatInput({ value, onChangeText, onSend, onCamera }: Props) {
  return (
    <View
      className="flex-row items-center gap-[10px] bg-cream px-4 pb-[30px] pt-3"
      style={{
        shadowColor: '#2B2119',
        shadowOpacity: 0.05,
        shadowRadius: 18,
        shadowOffset: { width: 0, height: -6 },
      }}
    >
      <Pressable
        onPress={onCamera}
        className="h-[52px] w-[52px] items-center justify-center rounded-full bg-white active:scale-95"
        style={{
          shadowColor: '#2B2119',
          shadowOpacity: 0.06,
          shadowRadius: 12,
          shadowOffset: { width: 0, height: 4 },
          elevation: 2,
        }}
      >
        <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
          <Path
            d="M4 8a2 2 0 012-2h1.5l1.2-1.6a1 1 0 01.8-.4h5a1 1 0 01.8.4L15.5 6H18a2 2 0 012 2v9a2 2 0 01-2 2H6a2 2 0 01-2-2V8z"
            stroke={COLORS.brand}
            strokeWidth={2}
            strokeLinejoin="round"
          />
          <Path
            d="M12 15.7a3.2 3.2 0 100-6.4 3.2 3.2 0 000 6.4z"
            stroke={COLORS.brand}
            strokeWidth={2}
          />
        </Svg>
      </Pressable>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        onSubmitEditing={onSend}
        returnKeyType="send"
        placeholder="o que você comeu?"
        placeholderTextColor={COLORS.placeholder}
        className="h-[52px] flex-1 rounded-[26px] bg-white px-5 font-nunito-semi text-[16px] text-ink"
        style={{
          shadowColor: '#2B2119',
          shadowOpacity: 0.06,
          shadowRadius: 12,
          shadowOffset: { width: 0, height: 4 },
          elevation: 2,
        }}
      />
      <Pressable
        onPress={onSend}
        className="h-[52px] w-[52px] items-center justify-center rounded-full bg-brand active:scale-95"
        style={{
          shadowColor: '#FC6C26',
          shadowOpacity: 0.4,
          shadowRadius: 16,
          shadowOffset: { width: 0, height: 6 },
          elevation: 5,
        }}
      >
        <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
          <Path
            d="M12 19V5M6 11l6-6 6 6"
            stroke="#fff"
            strokeWidth={2.6}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </Svg>
      </Pressable>
    </View>
  );
}
