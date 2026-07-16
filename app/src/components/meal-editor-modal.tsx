import { useEffect, useState } from 'react';
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  Text,
  TextInput,
  View,
} from 'react-native';
import Svg, { Path } from 'react-native-svg';

import { COLORS, fmt } from '@/lib/theme';
import type { UIMeal } from '@/lib/meal-display';

const STEP = 10;
const MIN = 0;
const MAX = 5000;

type Props = {
  meal: UIMeal | null;
  onClose: () => void;
  onSave: (id: string, food: string, kcal: number) => void;
  onDelete: (id: string) => void;
};

export function MealEditorModal({ meal, onClose, onSave, onDelete }: Props) {
  const [food, setFood] = useState('');
  const [kcal, setKcal] = useState(0);

  useEffect(() => {
    if (meal) {
      setFood(meal.food);
      setKcal(meal.kcal);
    }
  }, [meal]);

  const save = () => {
    if (!meal) return;
    onSave(meal.id, food.trim() || meal.food, Math.max(MIN, Math.round(kcal)));
  };

  return (
    <Modal visible={meal != null} transparent animationType="slide" onRequestClose={onClose}>
      <KeyboardAvoidingView
        className="flex-1 justify-end"
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <Pressable className="absolute inset-0 bg-ink/40" onPress={onClose} />

        <View
          className="rounded-t-[30px] bg-sheet px-6 pb-9 pt-3"
          style={{
            shadowColor: '#2B2119',
            shadowOpacity: 0.2,
            shadowRadius: 40,
            shadowOffset: { width: 0, height: -12 },
            elevation: 16,
          }}
        >
          <View className="mx-auto mb-[18px] mt-1 h-[5px] w-11 rounded-full bg-handle" />

          <Text className="text-center font-baloo-x text-[24px] text-ink">Editar refeição</Text>
          <Text className="mt-[3px] text-center font-nunito-semi text-[14px] text-muted">
            ajuste o nome ou as calorias 🐿️
          </Text>

          <Text className="mx-1 mb-2 mt-[22px] font-nunito-x text-[13px] uppercase tracking-[0.4px] text-muted">
            Alimento
          </Text>
          <TextInput
            value={food}
            onChangeText={setFood}
            placeholder="nome do alimento"
            placeholderTextColor={COLORS.placeholder}
            className="h-[54px] rounded-[18px] border-2 border-field bg-white px-[18px] font-nunito-bold text-[16px] text-ink focus:border-brand"
          />

          <Text className="mx-1 mb-2 mt-5 font-nunito-x text-[13px] uppercase tracking-[0.4px] text-muted">
            Calorias
          </Text>
          <View className="flex-row items-center gap-4 rounded-[18px] border-2 border-field bg-white px-[14px] py-[10px]">
            <Pressable
              onPress={() => setKcal((k) => Math.max(k - STEP, MIN))}
              className="h-[46px] w-[46px] items-center justify-center rounded-[14px] bg-card active:scale-90"
            >
              <Text className="font-baloo text-[30px] leading-[38px] text-brand">−</Text>
            </Pressable>
            <View className="flex-1 flex-row items-baseline justify-center">
              <Text className="font-baloo-x text-[40px] leading-[50px] text-ink">{fmt(kcal)}</Text>
              <Text className="ml-[6px] font-nunito-bold text-[15px] text-muted">kcal</Text>
            </View>
            <Pressable
              onPress={() => setKcal((k) => Math.min(k + STEP, MAX))}
              className="h-[46px] w-[46px] items-center justify-center rounded-[14px] bg-card active:scale-90"
            >
              <Text className="font-baloo text-[30px] leading-[38px] text-brand">+</Text>
            </Pressable>
          </View>

          <Pressable
            onPress={save}
            className="mt-[26px] h-[58px] items-center justify-center rounded-[20px] bg-brand active:scale-[0.98]"
            style={{
              shadowColor: '#FC6C26',
              shadowOpacity: 0.4,
              shadowRadius: 24,
              shadowOffset: { width: 0, height: 10 },
              elevation: 8,
            }}
          >
            <Text className="font-baloo text-[20px] text-white">Salvar</Text>
          </Pressable>

          <Pressable
            onPress={() => meal && onDelete(meal.id)}
            className="mt-[6px] h-[52px] flex-row items-center justify-center gap-2 active:opacity-60"
          >
            <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
              <Path
                d="M4 7h16M9 7V5a1 1 0 011-1h4a1 1 0 011 1v2m2 0v13a1 1 0 01-1 1H7a1 1 0 01-1-1V7"
                stroke={COLORS.over}
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </Svg>
            <Text className="font-nunito-x text-[16px] text-over">Excluir refeição</Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}
