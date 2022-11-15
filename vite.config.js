import { fileURLToPath, URL } from "node:url";

import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import vueJsx from "@vitejs/plugin-vue-jsx";
import VueSetupExtend from "vite-plugin-vue-setup-extend";

import resolveExternalsPlugin from "vite-plugin-resolve-externals";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueJsx(),
    VueSetupExtend(),
    resolveExternalsPlugin({ qc: "QC" }),
  ],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  css: {
    preprocessorOptions: {
      less: {
        javascriptEnabled: true,
        additionalData: [
          `@import "${path.resolve(
            __dirname,
            "src/assets/styles/variables.less"
          )}";`,
        ],
      },
    },
  },
  server: {
    port: 8080, //设置服务启动端口号
    cors: true,
    proxy: {
      "/api": {
        target: "http://pcapi-xiaotuxian-front-devtest.itheima.net/",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
});
