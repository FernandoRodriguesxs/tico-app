// Tokens de cor do design (Tico.dc.html). Use aqui quando a classe NativeWind
// não alcança — principalmente props de SVG (stroke/fill) e cores dinâmicas.
export const COLORS = {
  brand: '#FC6C26',
  brandHover: '#e15d1c',
  ink: '#2B2119',
  muted: '#8A7B6B',
  mutedLight: '#B6AB98',
  placeholder: '#BCB09B',
  cream: '#FFF4D6',
  canvas: '#ECE2CB',
  ringTrack: '#FCE0C9',
  over: '#D9533B',
  success: '#5FA45A',
  card: '#FFF0DF',
  line: '#FCD9C2',
  white: '#FFFFFF',
} as const;

// Nomes exatos das fontes carregadas em _layout.tsx (usados em fontFamily).
export const FONTS = {
  baloo: 'Baloo2_700Bold',
  balooX: 'Baloo2_800ExtraBold',
  nunito: 'Nunito_400Regular',
  nunitoMed: 'Nunito_500Medium',
  nunitoSemi: 'Nunito_600SemiBold',
  nunitoBold: 'Nunito_700Bold',
  nunitoX: 'Nunito_800ExtraBold',
} as const;

// Formata número no padrão pt-BR (ex: 1234 -> "1.234").
export const fmt = (n: number): string =>
  Math.round(n).toLocaleString('pt-BR');
