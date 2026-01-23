/**
 * @fault-type: vite-config-error
 * @category: build-errors
 * @description: vite.config.js configuration error
 * @expected-error: Invalid configuration
 * @target-file: vite.config.js
 * @severity: high
 */

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// FAULT INJECTION: Vite configuration error
// Error Type: Invalid configuration options
// Expected Result: Vite cannot start, build fails

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/',
  build: {
    outDir: 'dist',
    // ERROR: Invalid configuration options
    invalidOption: true, // Unknown option
    target: 'invalid-target', // Invalid target
    minify: 'invalid-minifier', // Invalid minifier
  },
  // ERROR: Invalid resolve configuration
  resolve: {
    alias: {
      '@': 'invalid/path/that/does/not/exist',
    },
  },
  // ERROR: Invalid server configuration
  server: {
    port: 'not-a-number', // Port must be a number
    strictPort: 'not-a-boolean', // Must be boolean
  },
});
