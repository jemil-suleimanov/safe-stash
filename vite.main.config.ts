import { builtinModules } from 'node:module'; // Import builtinModules
import path from 'node:path';

import { defineConfig } from 'vite';

export default defineConfig({
    build: {
        rollupOptions: {
            external: [
                'electron',
                ...builtinModules.flatMap(p => [p, `node:${p}`]),
                'better-sqlite3',
            ],
        },
    },
    resolve: {
        alias: {
            '@app':      path.resolve('./src/app'),
            '@electron': path.resolve('./src/electron'),
            '@shared':   path.resolve('./src/shared'),
        },
    },
    optimizeDeps: {
        exclude: ['better-sqlite3'],
    },
});
