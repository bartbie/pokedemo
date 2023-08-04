// vite.config.js
import { resolve } from 'path';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

export default defineConfig({
    plugins: [dts()],
    build: {
        lib: {
            name: 'api',
            entry: resolve(__dirname, 'src/index.ts'),
            fileName: (fmt, entryName) => `${entryName}.${fmt}.js`,
        },
    },
})
