import path from 'node:path';

import tailwindcss from '@tailwindcss/vite';
import vue from '@vitejs/plugin-vue';
import { defineConfig } from 'vite';

export default defineConfig({
    resolve: {
        alias: {
            '@app':      path.resolve('./src/app'),
            '@electron': path.resolve('./src/electron'),
            '@shared':   path.resolve('./src/shared'),
        },
    },
    plugins: [
        vue(),
        tailwindcss(),
    ],
    build: {
        target: 'es2022',
    },
});

