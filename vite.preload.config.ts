import path from 'node:path'

import { defineConfig } from 'vite'

// https://vitejs.dev/config
export default defineConfig({
    resolve: {
        alias: {
            '@app':      path.resolve('./src/app'),
            '@electron': path.resolve('./src/electron'),
            '@shared':   path.resolve('./src/shared'),
        },
    },
})
