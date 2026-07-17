import { useEffect, useState } from 'react';
import { Image, KeyboardAvoidingView, Platform, Pressable, Text, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';

import { OtpInput } from '@/components/otp-input';
import { requestCode, verifyCode } from '@/lib/api';
import { setToken } from '@/lib/session';
import { COLORS } from '@/lib/theme';

const RESEND_SECONDS = 45;

export default function LoginCodigo() {
  const { email } = useLocalSearchParams<{ email: string }>();
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [seconds, setSeconds] = useState(RESEND_SECONDS);

  useEffect(() => {
    if (seconds <= 0) return;
    const timer = setTimeout(() => setSeconds((s) => s - 1), 1000);
    return () => clearTimeout(timer);
  }, [seconds]);

  const confirm = async () => {
    if (code.length < 6 || loading) return;
    setLoading(true);
    setError('');
    try {
      const result = await verifyCode(email, code);
      await setToken(result.token);
      router.replace(result.isNew ? '/onboarding' : '/hoje');
    } catch {
      setLoading(false);
      setError('Código inválido ou expirado. Confere e tenta de novo.');
      setCode('');
    }
  };

  const resend = async () => {
    if (seconds > 0) return;
    try {
      await requestCode(email);
      setSeconds(RESEND_SECONDS);
      setError('');
    } catch {
      setError('Não consegui reenviar agora.');
    }
  };

  return (
    <View className="flex-1 bg-cream">
      <SafeAreaView className="flex-1" edges={['top', 'bottom']}>
        <KeyboardAvoidingView
          className="flex-1 px-[26px] pb-9 pt-[14px]"
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <Pressable
            onPress={() => router.back()}
            className="-ml-1 flex-row items-center gap-[6px] self-start py-[6px] px-1 active:scale-95"
          >
            <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
              <Path d="M15 6l-6 6 6 6" stroke={COLORS.brand} strokeWidth={2.6} strokeLinecap="round" strokeLinejoin="round" />
            </Svg>
            <Text className="font-nunito-x text-[15px] text-brand">trocar e-mail</Text>
          </Pressable>

          <View className="mt-[14px] items-center gap-[14px]">
            <Image
              source={require('../../../assets/tico.png')}
              style={{ width: 104, height: 104, resizeMode: 'contain' }}
            />
            <Text className="text-center font-baloo-x text-[26px] leading-[30px] text-ink">Digite o código</Text>
            <Text className="max-w-[290px] text-center font-nunito-semi text-[15px] leading-[22px] text-muted">
              enviamos 6 dígitos para{'\n'}
              <Text className="font-nunito-x text-ink">{email}</Text>
            </Text>
          </View>

          <View className="flex-1 justify-center gap-[18px]">
            <OtpInput value={code} onChange={setCode} />
            {error ? (
              <Text className="text-center font-nunito-bold text-[14px] text-over">{error}</Text>
            ) : null}
            <View className="items-center">
              <Pressable onPress={resend} disabled={seconds > 0} className="p-[6px] active:scale-95">
                <Text
                  className="font-nunito-x text-[15px]"
                  style={{ color: seconds > 0 ? COLORS.mutedLight : COLORS.brand }}
                >
                  {seconds > 0 ? `reenviar em ${seconds}s` : 'reenviar código'}
                </Text>
              </Pressable>
            </View>
          </View>

          <Pressable
            onPress={confirm}
            disabled={code.length < 6 || loading}
            className="h-[62px] items-center justify-center rounded-[24px] bg-brand active:scale-[0.98]"
            style={{ opacity: code.length === 6 ? 1 : 0.4 }}
          >
            <Text className="font-baloo text-[22px] text-white">{loading ? 'Entrando…' : 'Confirmar'}</Text>
          </Pressable>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}
