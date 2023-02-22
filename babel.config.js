module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    plugins: ["react-native-paper/babel", "nativewind/babel"],
    env: {
      production: {
        plugins: ["react-native-paper/babel", "nativewind/babel"],
      },
    },
  };
};
