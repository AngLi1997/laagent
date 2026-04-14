// packages/button/vite.config.ts
import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    lib: {
      entry: './src/index.ts',
      name: 'BmosI18n',
      fileName: 'bmos-i18n',
    },
    minify: false,
    rollupOptions: {
      external: [
        // 除了 @bmos/axios，未来可能还会依赖其他内部模块，不如用正则表达式将 @bmos 开头的依赖项一起处理掉
        /@bmos.*/, 
      ],
    },
  }
})