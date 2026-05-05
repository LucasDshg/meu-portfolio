import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import obfuscator from 'vite-plugin-javascript-obfuscator';

export default defineConfig({
  plugins: [
    react(),
    // eslint-disable-next-line no-undef
    process.env.NODE_ENV === 'production'
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
