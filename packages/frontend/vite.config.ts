import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [svelte()],
  optimizeDeps: {
    include: ["@pokedemo/common"],
  },
  build: {
    commonjsOptions: {
      include: [/common/, /node_modules/],
    },
  },
});
