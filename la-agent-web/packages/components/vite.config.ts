// packages/button/vite.config.ts
import vue from '@vitejs/plugin-vue';
import { defineConfig } from 'vite';
import vueJsx from '@vitejs/plugin-vue-jsx'

export default defineConfig({
  // 增加插件的使用
  plugins: [vue(), vueJsx()],
  build: {
    lib: {
      entry: './src/index.ts',
      name: 'BmosComponents',
      fileName: 'bmos-components',
    },
    minify: false,
    rollupOptions: {
      external: [
        // 除了 @bmos/utils，未来可能还会依赖其他内部模块，不如用正则表达式将 @openxui 开头的依赖项一起处理掉
        /@bmos.*/,
        'vue',
      ],
    },
  },
});
