// vite.config.js
import { resolve } from "path";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

export default defineConfig({
    plugins: [dts()],
    build: {
        lib: {
            formats: ["es", "umd"],
            name: "utils",
            entry: resolve(__dirname, "src/index.ts"),
            fileName: "index",
            // fileName: (fmt, entryName) => `${entryName}.${fmt}.js`,
        },
    },
});
