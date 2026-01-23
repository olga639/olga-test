/**
 * @fault-type: env-variable-missing
 * @category: build-errors
 * @description: Required environment variable missing during build
 * @expected-error: Environment variable is not defined
 * @target-file: vite.config.js
 * @severity: medium
 */

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// FAULT INJECTION: Missing environment variable
// Error Type: Required environment variable not defined
// Expected Result: Build failure

// ERROR: Using undefined environment variable
const requiredApiUrl = process.env.VITE_REQUIRED_API_URL;
if (!requiredApiUrl) {
  throw new Error('Environment variable VITE_REQUIRED_API_URL is not defined');
}

// ERROR: Using undefined environment variable
const requiredKey = process.env.VITE_REQUIRED_KEY;
if (!requiredKey) {
  throw new Error('Environment variable VITE_REQUIRED_KEY is not defined');
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/',
  build: {
    outDir: 'dist',
  },
  define: {
    'process.env.VITE_API_URL': JSON.stringify(requiredApiUrl),
    'process.env.VITE_KEY': JSON.stringify(requiredKey),
  },
});
