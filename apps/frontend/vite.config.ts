import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [svelte()],
    // optimizeDeps: {
    //     include: ["@pokedemo/api", "@pokedemo/utils"],
    // },
    // build: {
    //     commonjsOptions: {
    //         include: [/api/, /utils/, /node_modules/],
    //     },
    // },
});
