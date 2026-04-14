// packages/button/vite.config.ts
import path from 'path';
import { defineConfig } from 'vite'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons';

export default defineConfig({
  plugins: [
    createSvgIconsPlugin({
      iconDirs: [path.resolve(process.cwd(), 'src/icon')],
      symbolId: 'icon-[dir]-[name]',
    }),
  ],
  build: {
    lib: {
      entry: './src/index.ts',
      name: 'BmosIcon',
      fileName: 'bmos-icon',
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