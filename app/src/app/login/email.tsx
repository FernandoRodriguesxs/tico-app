import { useState } from 'react';
import { Alert, Image, KeyboardAvoidingView, Platform, Pressable, Text, TextInput, View } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

import { SpeechBubble } from '@/components/speech-bubble';
import { requestCode } from '@/lib/api';
import { COLORS } from '@/lib/theme';

const isValidEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());

export default function LoginEmail() {
  const [email, setEmail] = useState('');
  const [sending, setSending] = useState(false);
  const valid = isValidEmail(email);

  const send = async () => {
    if (!valid || sending) return;
    const normalized = email.trim().toLowerCase();
    setSending(true);
    try {
      await requestCode(normalized);
      setSending(false);
      router.push({ pathname: '/login/codigo', params: { email: normalized } });
    } catch {
      setSending(false);
      Alert.alert('Ops', 'Não consegui enviar o código 🐿️\nVeja se o servidor está no ar e tente de novo.');
    }
  };

  return (
    <View className="flex-1 bg-cream">
      <SafeAreaView className="flex-1" edges={['top', 'bottom']}>
        <KeyboardAvoidingView
          className="flex-1 px-[26px] pb-9 pt-10"
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <View className="items-center gap-4">
            <Image
              source={require('../../../assets/tico.png')}
              style={{ width: 120, height: 120, resizeMode: 'contain' }}
            />
            <SpeechBubble>Entrar é rapidinho 🔓{'\n'}Qual o seu e-mail?</SpeechBubble>
          </View>

          <View className="flex-1 justify-center gap-[10px]">
            <Text className="mx-1 font-nunito-x text-[13px] uppercase tracking-[0.4px] text-muted">Seu e-mail</Text>
            <TextInput
              value={email}
              onChangeText={setEmail}
              placeholder="voce@email.com"
              placeholderTextColor={COLORS.placeholder}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              onSubmitEditing={send}
              className="h-[60px] rounded-[20px] border-2 border-field bg-white px-5 font-nunito-bold text-[17px] text-ink focus:border-brand"
            />
            <Text className="mx-1 font-nunito-semi text-[14px] leading-[20px] text-muted-light">
              a gente manda um código de 6 dígitos — sem senha pra decorar 🌿
            </Text>
          </View>

          <Pressable
            onPress={send}
            disabled={!valid || sending}
            className="h-[62px] items-center justify-center rounded-[24px] bg-brand active:scale-[0.98]"
            style={{ opacity: valid ? 1 : 0.4 }}
          >
            <Text className="font-baloo text-[22px] text-white">{sending ? 'Enviando…' : 'Enviar código'}</Text>
          </Pressable>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}
