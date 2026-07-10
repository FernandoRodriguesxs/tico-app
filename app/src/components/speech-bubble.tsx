import type { ReactNode } from 'react';
import { Text, View } from 'react-native';

// Balão de fala do Tico, com o "biquinho" triangular no topo.
export function SpeechBubble({ children }: { children: ReactNode }) {
  return (
    <View
      className="relative max-w-[300px] rounded-[24px] bg-white px-6 py-[18px]"
      style={{
        shadowColor: '#2B2119',
        shadowOpacity: 0.1,
        shadowRadius: 24,
        shadowOffset: { width: 0, height: 10 },
        elevation: 5,
      }}
    >
      <View
        className="absolute -top-[7px] left-1/2 h-4 w-4 rounded-[4px] bg-white"
        style={{ transform: [{ translateX: -8 }, { rotate: '45deg' }] }}
      />
      <Text className="text-center font-nunito-bold text-[20px] leading-[27px] text-ink">
        {children}
      </Text>
    </View>
  );
}
