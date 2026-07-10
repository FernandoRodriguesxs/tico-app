/** @type {import('tailwindcss').Config} */
// Tokens de design do Tico.dc.html (Claude Design). Cores em hex exato do design.
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        brand: { DEFAULT: '#FC6C26', hover: '#e15d1c' },
        ink: '#2B2119',
        muted: { DEFAULT: '#8A7B6B', light: '#B6AB98' },
        placeholder: '#BCB09B',
        cream: '#FFF4D6',
        canvas: '#ECE2CB',
        ring: '#FCE0C9',
        over: '#D9533B',
        success: '#5FA45A',
        card: '#FFF0DF',
        line: '#FCD9C2',
      },
      fontFamily: {
        baloo: ['Baloo2_700Bold'],
        'baloo-x': ['Baloo2_800ExtraBold'],
        nunito: ['Nunito_400Regular'],
        'nunito-med': ['Nunito_500Medium'],
        'nunito-semi': ['Nunito_600SemiBold'],
        'nunito-bold': ['Nunito_700Bold'],
        'nunito-x': ['Nunito_800ExtraBold'],
      },
    },
  },
  plugins: [],
};
