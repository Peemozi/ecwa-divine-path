module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    plugins: [
      [
        "module-resolver",
        {
          root: ["./"],
          alias: {
            "@": "./"   // root of the project
          },
          extensions: [".js", ".ts", ".tsx", ".json"]
        }
      ],
      "react-native-reanimated/plugin"
    ]
  };
};
