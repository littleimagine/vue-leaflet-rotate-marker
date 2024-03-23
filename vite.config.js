import { resolve } from 'path';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

const build_config = {
  minify: true,
  lib: {
    entry: resolve(__dirname, 'src/lib.js'),
    name: 'VueLMarkerRotate',
    formats: ['es', 'cjs', 'umd'],
    fileName: `VueLMarkerRotate`
  },
  rollupOptions: {
    external: ['vue', /^leaflet\/.*/, '@vue-leaflet/vue-leaflet'],
    output: {
      validate: true,
      compact: true,
      generatedCode: {
        preset: 'es2015',
        constBindings: true,
        objectShorthand: true,
        arrowFunctions: false
      },
      globals: {
        vue: 'vue',
        '@vue-leaflet/vue-leaflet': '@vue-leaflet/vue-leaflet'
      }
    }
  }
};

export default defineConfig({
  plugins: [vue()],
  build: build_config,
  resolve: {
    alias: {
      vue: 'vue',
      '@': '/src'
    }
  }
});
