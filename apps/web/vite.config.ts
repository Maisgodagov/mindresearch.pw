import { researcherDocument } from "../api/src/public-methods/landing";
import { injectDocument } from "../api/src/public-methods/render";
import { realpathSync } from "node:fs";
import { resolve } from "node:path";
import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, ".", "");
  return {
    plugins: [
      react(),
      {name:"researcher-landing-prerender",enforce:"post",generateBundle(_options,bundle){
        const entry=bundle["index.html"];
        if(entry?.type==="asset")this.emitFile({type:"asset",fileName:"for-researchers/index.html",source:injectDocument(String(entry.source),researcherDocument())});
      }},
      {
        name: "temporary-home-redirect",
        configureServer(server) {
          server.middlewares.use((req, res, next) => {
            const url = new URL(req.url || "/", "http://localhost");
            if (url.pathname !== "/") return next();
            res.writeHead(302, {
              Location: "/for-researchers" + url.search,
              "Cache-Control": "no-store",
            });
            res.end();
          });
        },
      },
      {
        name: "public-methods-html",
        transformIndexHtml: {
          order: "pre",
          async handler(html, ctx) {
            const path = new URL(
              ctx.originalUrl || ctx.path,
              "http://localhost",
            ).pathname;
            if (!ctx.server || (path !== "/for-researchers" && !/^\/methods(?:\/[^/]+)?\/?$/.test(path)))
              return html;
            const slug = path.split("/").filter(Boolean)[1];
            const target =
              env.VITE_PUBLIC_METHODS_TARGET ||
              env.VITE_API_PROXY_TARGET ||
              "http://127.0.0.1:4011";
            try {
              const response = await fetch(
                path === "/for-researchers" ? `${target}/api/public/researcher-document` : `${target}/api/public/methods/document${slug ? `?slug=${encodeURIComponent(slug)}` : ""}`,
              );
              if (!response.ok) return html;
              const doc = (await response.json()) as {
                head: string;
                body: string;
              };
              return html
                .replace(/<title>[\s\S]*?<\/title>/i, "")
                .replace(/<meta[^>]+name=["']description["'][^>]*>/gi, "")
                .replace("</head>", `${doc.head}</head>`)
                .replace(
                  '<div id="root"></div>',
                  `<div id="root">${doc.body}</div>`,
                );
            } catch {
              return html;
            }
          },
        },
      },
    ],
    server: {
      port: 5173,
      fs: {
        allow: [resolve("../.."), realpathSync(resolve("../../node_modules"))],
      },
      proxy: {
        "/api": {
          target: env.VITE_API_PROXY_TARGET || "https://mindresearch.pro",
          changeOrigin: true,
          secure: true,
        },
      },
    },
  };
});
