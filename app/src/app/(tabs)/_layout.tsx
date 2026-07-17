import { Tabs } from 'expo-router';
import Svg, { Path } from 'react-native-svg';

import { COLORS, FONTS } from '@/lib/theme';

function HojeIcon({ color }: { color: string }) {
  return (
    <Svg width={26} height={26} viewBox="0 0 24 24" fill="none">
      <Path
        d="M20 11.5a7.5 7.5 0 01-10.9 6.7L4 19.5l1.3-4.1A7.5 7.5 0 1120 11.5z"
        stroke={color}
        strokeWidth={2}
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function HistoricoIcon({ color }: { color: string }) {
  return (
    <Svg width={26} height={26} viewBox="0 0 24 24" fill="none">
      <Path d="M12 8v4l2.5 2.5M12 4a8 8 0 108 8" stroke={color} strokeWidth={2} strokeLinecap="round" />
      <Path d="M4 8V4h4" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: COLORS.brand,
        tabBarInactiveTintColor: COLORS.tabInactive,
        tabBarLabelStyle: { fontFamily: FONTS.nunitoX, fontSize: 12 },
        tabBarStyle: {
          backgroundColor: '#fff',
          borderTopWidth: 0,
          paddingTop: 8,
          shadowColor: '#2B2119',
          shadowOpacity: 0.06,
          shadowRadius: 20,
          shadowOffset: { width: 0, height: -6 },
          elevation: 12,
        },
      }}
    >
      <Tabs.Screen
        name="hoje"
        options={{ title: 'Hoje', tabBarIcon: ({ color }) => <HojeIcon color={color} /> }}
      />
      <Tabs.Screen
        name="historico"
        options={{ title: 'Histórico', tabBarIcon: ({ color }) => <HistoricoIcon color={color} /> }}
      />
    </Tabs>
  );
}
