import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Image, Modal, Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';
import * as ImagePicker from 'expo-image-picker';

import * as api from '@/lib/api';
import { COLORS } from '@/lib/theme';

type Props = {
  visible: boolean;
  onClose: () => void;
  onLogged: (meal: api.ApiMeal) => void;
};

type Stage = 'aim' | 'analyzing' | 'result' | 'error';

const PICKER_OPTIONS: ImagePicker.ImagePickerOptions = {
  mediaTypes: ['images'],
  allowsEditing: true,
  aspect: [1, 1],
  quality: 0.35,
  base64: true,
};

export function PhotoCaptureModal({ visible, onClose, onLogged }: Props) {
  const [stage, setStage] = useState<Stage>('aim');
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [meal, setMeal] = useState<api.ApiMeal | null>(null);

  useEffect(() => {
    if (visible) reset();
  }, [visible]);

  const reset = () => {
    setStage('aim');
    setPhotoUri(null);
    setMeal(null);
  };

  const analyze = async (asset: ImagePicker.ImagePickerAsset) => {
    if (!asset.base64) return;
    setPhotoUri(asset.uri);
    setStage('analyzing');
    try {
      const created = await api.createMealFromPhoto(asset.base64, 'image/jpeg');
      setMeal(created);
      setStage('result');
    } catch {
      setStage('error');
    }
  };

  const take = async () => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('Permissão', 'Preciso da câmera pra fotografar o prato 🐿️');
      return;
    }
    const result = await ImagePicker.launchCameraAsync(PICKER_OPTIONS);
    if (!result.canceled) analyze(result.assets[0]);
  };

  const pick = async () => {
    const result = await ImagePicker.launchImageLibraryAsync(PICKER_OPTIONS);
    if (!result.canceled) analyze(result.assets[0]);
  };

  const confirm = () => {
    if (meal) onLogged(meal);
    onClose();
  };

  const notFood = stage === 'result' && meal?.kcal === 0;

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <View className="flex-1 bg-cream">
        <SafeAreaView className="flex-1 px-[26px] pb-9" edges={['top', 'bottom']}>
          <View className="flex-row items-center gap-[10px] pt-2">
            <Pressable
              onPress={onClose}
              className="h-11 w-11 items-center justify-center rounded-full bg-white active:scale-90"
            >
              <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
                <Path d="M6 6l12 12M18 6L6 18" stroke={COLORS.brand} strokeWidth={2.6} strokeLinecap="round" />
              </Svg>
            </Pressable>
            <View>
              <Text className="font-baloo-x text-[22px] leading-[26px] text-ink">Foto do prato</Text>
              <Text className="mt-[2px] font-nunito-semi text-[13px] text-muted">o Tico estima as calorias 🐿️📸</Text>
            </View>
          </View>

          <View className="flex-1 justify-center py-4">
            <View className="aspect-square w-full overflow-hidden rounded-[30px] bg-ink">
              {photoUri ? (
                <Image source={{ uri: photoUri }} style={{ width: '100%', height: '100%' }} resizeMode="cover" />
              ) : (
                <View className="flex-1 items-center justify-center gap-2 px-8">
                  <Text className="text-center font-nunito-bold text-[16px] text-over">
                    enquadre seu prato e toque em tirar foto
                  </Text>
                </View>
              )}

              {stage === 'analyzing' ? (
                <View className="absolute inset-0 items-center justify-center gap-4 bg-ink/50">
                  <ActivityIndicator size="large" color={COLORS.brand} />
                  <Text className="font-baloo text-[18px] text-white">analisando seu prato…</Text>
                </View>
              ) : null}

              {stage === 'result' && meal ? (
                <View className="absolute inset-x-4 bottom-4 flex-row items-center gap-3 rounded-[20px] bg-white/95 p-[14px]">
                  <View className="h-[46px] w-[46px] items-center justify-center rounded-[14px] bg-card">
                    <Text className="text-[24px]">{notFood ? '🤔' : '🍽️'}</Text>
                  </View>
                  <View className="flex-1">
                    <Text className="font-nunito-x text-[15px] leading-[19px] text-ink">{meal.food}</Text>
                    <Text className="mt-[2px] font-nunito-semi text-[12px] text-muted">
                      {notFood ? 'tenta outra foto 🐿️' : 'estimativa do Tico · dá pra ajustar depois'}
                    </Text>
                  </View>
                  {notFood ? null : (
                    <Text className="font-baloo-x text-[22px] text-brand">{meal.kcal}</Text>
                  )}
                </View>
              ) : null}
            </View>
          </View>

          {stage === 'error' ? (
            <Text className="mb-3 text-center font-nunito-bold text-[14px] text-over">
              Não consegui analisar agora 🐿️{'\n'}Confira o servidor e a chave da IA.
            </Text>
          ) : null}

          {stage === 'aim' || stage === 'error' ? (
            <View className="gap-[10px]">
              <Pressable
                onPress={take}
                className="h-[66px] flex-row items-center justify-center gap-[10px] rounded-[24px] bg-brand active:scale-[0.98]"
              >
                <Svg width={26} height={26} viewBox="0 0 24 24" fill="none">
                  <Path
                    d="M4 8a2 2 0 012-2h1.5l1.2-1.6a1 1 0 01.8-.4h5a1 1 0 01.8.4L15.5 6H18a2 2 0 012 2v9a2 2 0 01-2 2H6a2 2 0 01-2-2V8z"
                    stroke="#fff"
                    strokeWidth={2}
                    strokeLinejoin="round"
                  />
                  <Path d="M12 15.7a3.2 3.2 0 100-6.4 3.2 3.2 0 000 6.4z" stroke="#fff" strokeWidth={2} />
                </Svg>
                <Text className="font-baloo text-[21px] text-white">Tirar foto</Text>
              </Pressable>
              <Pressable onPress={pick} className="h-[46px] items-center justify-center active:opacity-60">
                <Text className="font-nunito-x text-[15px] text-brand">escolher da galeria</Text>
              </Pressable>
            </View>
          ) : null}

          {stage === 'analyzing' ? (
            <View className="h-[66px] items-center justify-center rounded-[24px] bg-line">
              <Text className="font-baloo text-[21px] text-white">estimando…</Text>
            </View>
          ) : null}

          {stage === 'result' ? (
            <View className="flex-row gap-[10px]">
              <Pressable
                onPress={reset}
                className="h-[66px] w-[66px] items-center justify-center rounded-[24px] border-2 border-field bg-white active:scale-95"
              >
                <Svg width={26} height={26} viewBox="0 0 24 24" fill="none">
                  <Path
                    d="M4 12a8 8 0 018-8 8 8 0 016.9 4M20 12a8 8 0 01-8 8 8 8 0 01-6.9-4"
                    stroke={COLORS.brand}
                    strokeWidth={2.2}
                    strokeLinecap="round"
                  />
                  <Path d="M18 3v4h-4M6 21v-4h4" stroke={COLORS.brand} strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" />
                </Svg>
              </Pressable>
              {notFood ? null : (
                <Pressable
                  onPress={confirm}
                  className="h-[66px] flex-1 items-center justify-center rounded-[24px] bg-brand active:scale-[0.98]"
                >
                  <Text className="font-baloo text-[21px] text-white">Adicionar · {meal?.kcal} kcal</Text>
                </Pressable>
              )}
            </View>
          ) : null}
        </SafeAreaView>
      </View>
    </Modal>
  );
}
