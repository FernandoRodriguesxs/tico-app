import { Text, View } from 'react-native';

type Props = {
  text: string;
  from: 'user' | 'bot';
};

// Balão de conversa: usuário à direita (laranja), Tico à esquerda (branco).
export function ChatBubble({ text, from }: Props) {
  if (from === 'user') {
    return (
      <View
        className="max-w-[80%] self-end rounded-[22px] rounded-br-[6px] bg-brand px-4 py-3"
        style={{
          shadowColor: '#FC6C26',
          shadowOpacity: 0.26,
          shadowRadius: 14,
          shadowOffset: { width: 0, height: 5 },
          elevation: 3,
        }}
      >
        <Text className="font-nunito-semi text-[15px] leading-[21px] text-white">{text}</Text>
      </View>
    );
  }

  return (
    <View
      className="max-w-[80%] self-start rounded-[22px] rounded-bl-[6px] bg-white px-4 py-3"
      style={{
        shadowColor: '#2B2119',
        shadowOpacity: 0.07,
        shadowRadius: 14,
        shadowOffset: { width: 0, height: 5 },
        elevation: 3,
      }}
    >
      <Text className="font-nunito-bold text-[15px] leading-[21px] text-ink">{text}</Text>
    </View>
  );
}
