import path, { resolve } from 'node:path';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
import AutoImport from 'unplugin-auto-import/vite';
import { AntDesignVueResolver } from 'unplugin-vue-components/resolvers';
import Components from 'unplugin-vue-components/vite';
import { defineConfig, loadEnv } from 'vite';
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons';
import { vitePlugin } from '../../scripts/plugins';
// @ts-ignore
import { getIconsConfig } from './src/utils/path';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  return {
    build: {
      rollupOptions: {
        input: {
          login: path.resolve(__dirname, 'login/index.html'),
          index: path.resolve(__dirname, 'index.html'),
        },
        output: {
          manualChunks(id) {
            if (id.includes('node_modules')) {
              if (id.includes('ant-design-vue'))
                return 'vendor-antdv';
              if (id.includes('@antv/x6'))
                return 'vendor-x6';
              if (id.includes('vue'))
                return 'vendor-vue';
              if (id.includes('vue-router') || id.includes('pinia'))
                return 'vendor-vue-core';

              // 其他通用第三方库
              return 'vendor';
            }
            // @bmos
            if (id.includes('@bmos/')) {
              const matches = id.match(/@bmos\/([^/]+)/);
              if (matches && matches[1]) {
                return `bmos-${matches[1]}`;
              }
            }
          },
        },
      },
      minify: 'terser',
      terserOptions: {
        compress: {
          drop_console: true,
          drop_debugger: true,
        },
      },
    },
    plugins: [
      vue(),
      vueJsx(),
      Components({
        dts: false,
        resolvers: [
          AntDesignVueResolver({
            importStyle: false, // css in js
            prefix: '',
          }),
        ],
      }),
      AutoImport({
        imports: ['vue', 'vue-router'],
        dts: false,
        include: [
          /\.[tj]sx?$/, // .ts, .tsx, .js, .jsx
          /\.vue$/,
          /\.vue\?vue/, // .vue
          /\.md$/, // .md
        ],
        eslintrc: {
          enabled: false, // Default `false`
          filepath: './.eslintrc-auto-import.json', // Default `./.eslintrc-auto-import.json`
        },
      }),
      createSvgIconsPlugin(getIconsConfig()),
      vitePlugin(),
    ],
    resolve: {
      alias: {
        '@': resolve(__dirname, './src'),
      },
    },
    server: {
      host: '0.0.0.0',
      port: 8084,
      hmr: {
        overlay: false,
      },
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
      proxy: {
        '/api/app': {
          // eslint-disable-next-line node/prefer-global/process
          target: loadEnv(mode, process.cwd()).VITE_API_HOST || 'http://172.30.1.160/',
          changeOrigin: true,
          ws: true,
        },
      },
    },
    base: '/app/bmos-ai/',
    css: {
      preprocessorOptions: {
        less: {
          modifyVars: {
            prefixCls: 'ant', // 自定义类名前缀
          },
          javascriptEnabled: true,
        },
      },
    },
  };
});
