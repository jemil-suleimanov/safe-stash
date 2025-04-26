import path from 'node:path'

import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'

export default defineConfig({
    resolve: {
        alias: {
            '@app':      path.resolve('./src/app'),
            '@electron': path.resolve('./src/electron'),
            '@shared':   path.resolve('./src/shared'),
        },
    },
    plugins: [vue()],
    build:   {
        target: 'es2022',
    },
})
