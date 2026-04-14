// packages/utils/vite.config.ts
import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    lib: {
      entry: './src/index.ts',
      name: 'BmosUtils',
      fileName: 'bmos-utils',
    },
    minify: false,
    rollupOptions: {
      external: [
        // 除了 @bmos/utils，未来可能还会依赖其他内部模块，不如用正则表达式将 @bmos 开头的依赖项一起处理掉
        /@bmos.*/, 
      ],
    },
  }
})