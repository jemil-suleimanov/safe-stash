// vite.main.config.ts
import { builtinModules } from 'node:module' // Import builtinModules
import path from 'node:path'

import { defineConfig } from 'vite'

export default defineConfig({
    // Ensure root is correct if needed, often defaults fine
    // root: process.cwd(),
    build: {
    // Tell Rollup to treat Node.js built-ins as external
    // (avoids bundling them unnecessarily)
        rollupOptions: {
            external: [
                'electron',
                ...builtinModules.flatMap(p => [p, `node:${p}`]), // Mark all node builtins as external
                'better-sqlite3', // <<<--- Explicitly mark better-sqlite3 as external
            ],
        },
    // Optional: Configure CommonJS plugin if needed, though externalizing might be enough
    // commonjsOptions: {
    //   ignoreDynamicRequires: true, // Or configure dynamicRequireTargets
    // }
    },
    resolve: {
        alias: {
            '@app':      path.resolve('./src/app'),
            '@electron': path.resolve('./src/electron'),
            '@shared':   path.resolve('./src/shared'),
        },
    },
    // --- Important for Native Modules ---
    optimizeDeps: {
    // Exclude native modules from Vite's dependency pre-bundling
        exclude: ['better-sqlite3'],
    },
    // Add plugin if needed (though often externalizing is sufficient)
    // plugins: [
    //   require('@rollup/plugin-commonjs')({
    //      dynamicRequireTargets: [
    //        // If you have other dynamic requires you want to support
    //        'node_modules/better-sqlite3/**/*.node',
    //      ],
    //   }),
    // ],
})
