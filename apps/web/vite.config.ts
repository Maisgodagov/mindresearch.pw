import { researcherDocument } from "../api/src/researcher-landing/landing";
import { injectDocument } from "../api/src/researcher-landing/render";
import { realpathSync } from 'node:fs';
import { resolve } from 'node:path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');
  return {
    plugins: [react(), {name: "researcher-landing-prerender", enforce: "post", generateBundle(_options, bundle) {
 const entry = bundle["index.html"];
 if (entry?.type === "asset") this.emitFile({type:"asset",fileName:"for-researchers/index.html",source:injectDocument(String(entry.source),researcherDocument())});
}}],
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
