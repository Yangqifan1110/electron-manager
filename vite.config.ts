import { defineConfig, loadEnv } from "vite";
import { fileURLToPath, URL } from "node:url";
import { resolve } from "path";
import vue from "@vitejs/plugin-vue";
import Components from "unplugin-vue-components/vite";
import electron from "vite-plugin-electron";
import electronRenderer from "vite-plugin-electron-renderer";
import polyfillExports from "vite-plugin-electron-renderer";
import vueJsx from "@vitejs/plugin-vue-jsx";
import { createSvgIconsPlugin } from "vite-plugin-svg-icons";
// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd());
  const { VITE_BASE_URL } = env;
  return {
    server: {
      port: 8080,
      proxy: {
        "/api": {
          target: VITE_BASE_URL,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ""),
        },
      },
    },
    css: {
      preprocessorOptions: {
        less: {
          javascriptEnabled: true,
          modifyVars: {
            hack: `true; @import (reference) "${resolve(
              "src/assets/style/variables.less"
            )}";`,
          },
        },
      },
    },
    plugins: [
      vue(),
      Components({
        dirs: ["src/components", "src/views/design/nodeFormOption"],
      }),
      createSvgIconsPlugin({
        iconDirs: [
          fileURLToPath(new URL("./src/assets/icons", import.meta.url)),
        ],
        symbolId: "icon-[dir]-[name]",
        svgoOptions: {
          full: true,
          plugins: [
            {
              name: "removeAttrs",
              params: {
                attrs: "fill",
              },
            },
          ],
        },
      }),
      electron([
        {
          entry: "electron/main.ts",
        },
        {
          entry: "electron/preload.ts",
        },
      ]),
      electronRenderer(),
      polyfillExports(),
      vueJsx(),
    ],
    resolve: {
      alias: {
        "@": fileURLToPath(new URL("./src", import.meta.url)),
      },
    },
    build: {
      emptyOutDir: false,
      outDir: "dist-electron",
    },
    define: {
      __Admin_VERSION__: JSON.stringify(process.env.npm_package_version),
    },
  };
});
