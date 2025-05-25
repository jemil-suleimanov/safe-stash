import { LoginPage, RegisterPage } from '@app/features/auth';
import SuccessPage from '@app/features/auth/pages/SuccessPage.vue';
import MainLayout from '@app/layouts/MainLayout.vue';
import { createMemoryHistory, createRouter } from 'vue-router';

const routes = [
    {
        // for now, this is the only route
        path:      '/',
        component: RegisterPage,
    },
    {
        path:      '/app',
        component: MainLayout,
        meta:      { requiresAuth: true },
        children:  [
            {
                path:      '',
                name:      'Dashboard',
                component: () => import('@app/features/dashboard/DashboardPage.vue'),
                meta:      { title: 'Dashboard' },
            },
            {
                path:      'transactions',
                name:      'Transactions',
                component: () => import('@app/features/transaction/TransactionsPage.vue'),
                meta:      { title: 'My Transactions' },
            },
            {
                path:      'budgets',
                name:      'Budgets',
                component: () => import('@app/features/budget/BudgetsPage.vue'),
                meta:      { title: 'Manage Budgets' },
            },
            {
                path:      'reports',
                name:      'Reports',
                component: () => import('@app/features/report/ReportsPage.vue'),
                meta:      { title: 'Financial Reports' },
            },
            { path: '', redirect: { name: 'Dashboard' } },
        ],
    },
    {
        path:      '/login',
        component: LoginPage,
    },
    {
        path:      '/success',
        component: SuccessPage,
    },
];

export const router = createRouter({
    history: createMemoryHistory(),
    routes,
});
