/**
 * @fault-type: circular-dependency
 * @category: build-errors
 * @description: 将循环依赖告警提升为错误，确保构建失败
 * @expected-error: Circular dependency detected
 * @target-file: vite.config.js
 * @severity: medium
 */

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/',
  server: {
    port: 3000,
    open: true
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      onwarn(warning, warn) {
        if (warning.code === 'CIRCULAR_DEPENDENCY') {
          throw new Error(`Circular dependency detected: ${warning.message}`);
        }
        warn(warning);
      },
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom']
        }
      }
    }
  }
});
