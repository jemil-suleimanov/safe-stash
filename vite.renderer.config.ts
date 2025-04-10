import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
    resolve: {
        alias: {
            '@app': '/src/app',
            '@data': '/src/data',
        }   
    },
    plugins: [vue()]
});
