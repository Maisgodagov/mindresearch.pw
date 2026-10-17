import { realpathSync } from 'node:fs';
import { resolve } from 'node:path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');
  return {
    plugins: [react()],
    server: {
      port: 5173,
      fs: { allow: [resolve('../..'), realpathSync(resolve('../../node_modules'))] },
      proxy: {
        '/api': {
          target: env.VITE_API_PROXY_TARGET || 'https://mindresearch.pro',
          changeOrigin: true,
          secure: true,
        },
      },
    },
  };
});
