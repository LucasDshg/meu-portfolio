import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import obfuscator from 'vite-plugin-javascript-obfuscator';

// eslint-disable-next-line no-undef
const enableObfuscation = process.env.VITE_ENABLE_OBFUSCATION === 'true';

export default defineConfig({
  plugins: [
    react(),
    enableObfuscation
      ? obfuscator({
          options: {
            compact: true,
            controlFlowFlattening: true,
            deadCodeInjection: true,
            stringArray: true,
            stringArrayThreshold: 0.75,
          },
          exclude: [/node_modules/],
        })
      : null,
  ].filter(Boolean),
  resolve: {
    alias: {},
  },
  build: {
    sourcemap: false,
  },
});
