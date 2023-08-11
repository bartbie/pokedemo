import { sveltekit } from "@sveltejs/kit/vite";
import { defineConfig } from "vite";

export default defineConfig({
    plugins: [sveltekit()],
    optimizeDeps: {
        include: ["@pokedemo/api", "@pokedemo/utils"]
    },
    build: {
        commonjsOptions: {
            include: [/api/, /utils/, /node_modules/]
        }
    }
});
