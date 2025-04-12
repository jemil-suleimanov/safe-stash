import vue from '@vitejs/plugin-vue';
import { defineConfig } from 'vite';

export default defineConfig({
    resolve: {
        alias: {
            '@app': '/src/app',
        }   
    },
    plugins: [vue()],
    build:   {
        target: 'es2022'
    }
});
