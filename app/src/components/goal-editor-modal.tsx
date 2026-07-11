import { useEffect, useState } from 'react';
import { Modal, Pressable, Text, View } from 'react-native';

import { GoalStepper } from '@/components/goal-stepper';
import { PrimaryButton } from '@/components/primary-button';

const STEP = 50;
const MIN = 800;
const MAX = 5000;

type Props = {
  visible: boolean;
  goal: number;
  onClose: () => void;
  onSave: (goal: number) => void;
};

export function GoalEditorModal({ visible, goal, onClose, onSave }: Props) {
  const [value, setValue] = useState(goal);

  useEffect(() => {
    if (visible) setValue(goal);
  }, [visible, goal]);

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable className="flex-1 items-center justify-center bg-black/40 px-6" onPress={onClose}>
        <Pressable
          className="w-full items-center gap-4 rounded-[28px] bg-cream p-6"
          onPress={() => {}}
          style={{
            shadowColor: '#2B2119',
            shadowOpacity: 0.18,
            shadowRadius: 30,
            shadowOffset: { width: 0, height: 12 },
            elevation: 10,
          }}
        >
          <Text className="font-baloo text-[22px] text-ink">Editar meta diária</Text>

          <GoalStepper
            goal={value}
            size="md"
            onDec={() => setValue((g) => Math.max(g - STEP, MIN))}
            onInc={() => setValue((g) => Math.min(g + STEP, MAX))}
          />

          <View className="mt-2 w-full gap-1">
            <PrimaryButton label="Salvar" onPress={() => onSave(value)} />
            <Pressable className="h-[52px] items-center justify-center active:opacity-60" onPress={onClose}>
              <Text className="font-nunito-bold text-[16px] text-muted">Cancelar</Text>
            </Pressable>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
