// vite.config.js
import { resolve } from 'path';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

export default defineConfig({
    plugins: [dts()],
    build: {
        lib: {
            name: 'common',
            entry: {
                'index': resolve(__dirname, 'src/index.ts'),
                'api/index': resolve(__dirname, 'src/api/index.ts'),
                'utils/index': resolve(__dirname, 'src/utils/index.ts'),
            },
            fileName: (fmt, entryName) => `${entryName}.${fmt}.js`,
        },
    },
})
