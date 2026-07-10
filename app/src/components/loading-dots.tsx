import { useEffect } from 'react';
import { View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

// Uma bolinha que sobe e desce em loop (efeito "digitando" da splash).
function Dot({ delay }: { delay: number }) {
  const t = useSharedValue(0);

  useEffect(() => {
    t.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withTiming(1, { duration: 480, easing: Easing.inOut(Easing.ease) }),
          withTiming(0, { duration: 480, easing: Easing.inOut(Easing.ease) }),
        ),
        -1,
      ),
    );
  }, [delay, t]);

  const style = useAnimatedStyle(() => ({
    transform: [{ translateY: -9 * t.value }],
    opacity: 0.45 + 0.55 * t.value,
  }));

  return (
    <Animated.View
      style={[{ width: 11, height: 11, borderRadius: 999, backgroundColor: '#fff' }, style]}
    />
  );
}

export function LoadingDots() {
  return (
    <View style={{ flexDirection: 'row', gap: 11 }}>
      <Dot delay={0} />
      <Dot delay={160} />
      <Dot delay={320} />
    </View>
  );
}
