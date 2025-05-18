import { RegisterPage } from '@app/features/auth';
import { createMemoryHistory, createRouter } from 'vue-router';

const routes = [
    {
        // for now, this is the only route
        path:      '/',
        component: RegisterPage,
    },
];

export const router = createRouter({
    history: createMemoryHistory(),
    routes,
});
