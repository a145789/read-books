import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import Components from 'unplugin-vue-components/vite'
import AutoImport from 'unplugin-auto-import/vite'
import { VarletUIResolver } from 'unplugin-vue-components/resolvers'
import Unocss from 'unocss/vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueJsx(),
    Unocss(),
    AutoImport({
      imports: ['vue', 'vue-router'],
      dts: './src/auto-imports.d.ts',
      vueTemplate: true,
      resolvers: [VarletUIResolver()]
    }),
    Components({
      dirs: ['src/components'],
      // allow auto load markdown components under `./src/components/`
      extensions: ['vue'],
      // allow auto import and register components used in markdown
      include: [/\.vue$/, /\.vue\?vue/],
      dts: './src/auto-components.d.ts',
      resolvers: [VarletUIResolver({ autoImport: true })]
    })
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  esbuild: {
    pure: ['console.log', 'debugger']
  },
  build: {
    target: 'es2015',
    cssTarget: 'chrome80',
    minify: 'esbuild',
    cssCodeSplit: true,
    sourcemap: false,
    chunkSizeWarningLimit: 2000,
    rollupOptions: {
      output: {
        manualChunks: file => {
          if (file.includes('node_modules')) {
            if (file.includes('@vue')) {
              return 'vue'
            }
            if (file.includes('@varlet')) {
              return 'varlet'
            }
            return 'vendor'
          }
        }
      }
    }
  }
})
