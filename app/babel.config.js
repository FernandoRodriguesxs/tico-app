module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      ['babel-preset-expo', { jsxImportSource: 'nativewind' }],
      'nativewind/babel',
    ],
    // Reanimated 4 usa o plugin do worklets; deve ser sempre o último.
    plugins: ['react-native-worklets/plugin'],
  };
};
