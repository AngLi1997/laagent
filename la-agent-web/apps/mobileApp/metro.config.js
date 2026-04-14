const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');
const path = require('path');

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('metro-config').MetroConfig}
 */
async function getCustomConfig() {
  const defaultConfig = await getDefaultConfig(__dirname);

  const { assetExts, sourceExts } = defaultConfig.resolver;

  return mergeConfig(defaultConfig, {
    transformer: {
      babelTransformerPath: require.resolve('react-native-svg-transformer'),
      getTransformOptions: async () => ({
        transformOptions: {
          experimentalImportSupport: false,
          inlineRequires: true,
        },
      }),
    },
    resolver: {
      unstable_enableSymlinks: true,
      unstable_enablePackageExports: true,
      resolverMainFields: ['react-native', 'browser', 'main'],
      extraNodeModules: {
        crypto: require.resolve('react-native-get-random-values'),
        stream: require.resolve('stream-browserify'),
        buffer: require.resolve('buffer'),
        zlib: require.resolve('pako'),
        url: require.resolve('react-native-url-polyfill'),
        http: require.resolve('stream-http'),
        https: require.resolve('https-browserify'),
        events: require.resolve('eventemitter3'),
        util: require.resolve('util'),
        assert: require.resolve('assert'),
      },
      assetExts: assetExts.filter(ext => ext !== 'svg'),
      sourceExts: [...sourceExts, 'svg'],
    },
    watchFolders: [path.join(__dirname, '..', '..')],
  });
}

module.exports = getCustomConfig();
