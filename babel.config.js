module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['module:@react-native/babel-preset'],
    plugins: [
      [
        "module-resolver",
        {
          root: ["."],
          alias: {
            "@components": "./src/components",
            "@features": "./src/features",
            "@data": "./src/data",
            "@assets": "./assets",
            "@utils": "./src/utils",
            "@screens": "./src/screens",
            "@navigations": "./src/navigations",
            "@assets": "./src/assets",
            "@services": "./src/services",
          },
        },
      ],
    ],
  };
};