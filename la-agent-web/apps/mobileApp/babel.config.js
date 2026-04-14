module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    [
      'module-resolver',
      {
        root: ['./src'], // 指定 src 目录为根
        alias: {
          '@': './src', // 将 @ 映射到 ./src
        },
      },
    ],
    ["import", { libraryName: "@ant-design/react-native" }] // 与 Web 平台的区别是不需要设置 style
  ],
  env: {
    production: {
      plugins: ['react-native-paper/babel'],
    },
  },
};
