import { resolve } from 'node:path';
import react from '@vitejs/plugin-react';
import { defineConfig, loadEnv } from 'vite';
import svgr from 'vite-plugin-svgr';

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  return {
    plugins: [
      react(),
      svgr({
        svgrOptions: {
          exportType: 'named',
          ref: true,
          svgo: false,
          titleProp: true,
        },
        // assets/icons/*.svg 目录下的所有 SVG 文件会被自动导入为 React 组件
        include: './src/assets/icons/*.svg',
      }),
    ],
    server: {
      host: '0.0.0.0',
      port: 8083,
      hmr: {
        overlay: false,
      },
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
      proxy: {
        '/api/app': {
          // eslint-disable-next-line node/prefer-global/process
          target: loadEnv(mode, process.cwd()).VITE_API_HOST,
          changeOrigin: true,
          ws: true,
        },
        '/api/app/agent/chat/sse': {
          // eslint-disable-next-line node/prefer-global/process
          target: loadEnv(mode, process.cwd()).VITE_API_HOST,
          changeOrigin: true,
          ws: true,
          configure: (proxy) => {
            proxy.on('proxyRes', (proxyRes, req, res) => {
              // 解决 SSE 或 streaming 被缓存的问题
              res.setHeader('Cache-Control', 'no-cache');
              res.setHeader('Content-Type', 'text/event-stream');
              res.setHeader('Connection', 'keep-alive');
            });
          },
        },
      },
    },
    resolve: {
      alias: {
        '@': resolve(__dirname, './src'),
      },
    },
    build: {
      rollupOptions: {
        output: {
          manualChunks(id) {
            // 打包第三方库
            if (id.includes('node_modules')) {
              if (id.includes('antd'))
                return 'vendor-antd';
              if (id.includes('@ant-design/icons'))
                return 'vendor-antd-icons';
              if (id.includes('react'))
                return 'vendor-react';
              if (id.includes('lodash-es'))
                return 'vendor-lodash';
              if (id.includes('zustand'))
                return 'vendor-zustand';
              if (id.includes('dayjs'))
                return 'vendor-dayjs';
              return 'vendor';
            }
            // 本地 utils 目录
            if (id.includes('/src/utils/'))
              return 'utils';
            return undefined;
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
    base: '/app/bmos-chat',
  };
});
