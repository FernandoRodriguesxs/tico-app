import { useEffect } from 'react';
import { Image, Text, View } from 'react-native';
import { router } from 'expo-router';

import { LoadingDots } from '@/components/loading-dots';
import { getGoal } from '@/lib/storage';

export default function Splash() {
  useEffect(() => {
    const timer = setTimeout(async () => {
      const goal = await getGoal();
      router.replace(goal != null ? '/hoje' : '/onboarding');
    }, 1600);
    return () => clearTimeout(timer);
  }, []);

  return (
    <View className="flex-1 items-center justify-center bg-brand px-8">
      <Image
        source={require('../../assets/tico.png')}
        style={{ width: 250, height: 250, resizeMode: 'contain' }}
      />
      <Text className="mt-[14px] font-baloo-x text-[66px] leading-[80px] text-white">Tico</Text>
      <Text className="mt-[10px] font-nunito-semi text-[18px] text-white/90">
        suas calorias, sem esforço
      </Text>
      <View className="absolute bottom-[72px]">
        <LoadingDots />
      </View>
    </View>
  );
}
