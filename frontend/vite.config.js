import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
  plugins: [vue()],
  base: './',
  server: { host: '127.0.0.1', port: 5173 },
  build: {
    // DEM 数据是单个体积较大的模块，放宽告警阈值
    chunkSizeWarningLimit: 5000,
  },
});
