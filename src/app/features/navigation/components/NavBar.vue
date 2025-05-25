<template>
    <nav
        class="navbar-container flex flex-col w-64 p-4 space-y-2 border-r h-full transition-colors duration-300"
        :style="{
            backgroundColor: 'var(--n-card-color)', /* Slightly distinct from body, or same as body */
            borderColor: 'var(--n-border-color)'
        }"
    >
        <div class="app-branding flex items-center justify-center h-16 mb-6">
            <svg class="h-10 w-auto text-[var(--primary-color)]" fill="currentColor" viewBox="0 0 100 100">
                <path d="M50 5C25.16 5 5 25.16 5 50s20.16 45 45 45 45-20.16 45-45S74.84 5 50 5zm0 82.05c-20.47 0-37.05-16.58-37.05-37.05S29.53 12.95 50 12.95s37.05 16.58 37.05 37.05S70.47 87.05 50 87.05zM50 27.5c-2.48 0-4.5 2.02-4.5 4.5v16c0 2.48 2.02 4.5 4.5 4.5s4.5-2.02 4.5-4.5v-16c0-2.48-2.02-4.5-4.5-4.5zm0 29c-2.48 0-4.5 2.02-4.5 4.5s2.02 4.5 4.5 4.5 4.5-2.02 4.5-4.5-2.02-4.5-4.5-4.5z" />
            </svg>
            <span class="ml-3 text-xl font-semibold text-[var(--n-title-text-color)]">SafeStash</span>
        </div>
        <ul>
            <li v-for="item in navItems" :key="item.routeName">
                <router-link
                    v-slot="{ isActive, href, navigate }"
                    :to="{ name: item.routeName }"
                >
                    <a
                        :href="`/${href}`"
                        class="nav-item flex items-center py-3 px-4 my-1 rounded-md transition-all duration-200 ease-in-out"
                        :class="[
                            isActive
                                ? 'active-nav-item text-[var(--primary-color)] bg-[var(--primary-color-pressed)] bg-opacity-10 font-medium' // Active state with very subtle bg
                                : 'text-[var(--n-text-color-2)] hover:bg-[var(--n-action-color)] hover:text-[var(--n-text-color-1)]' // Default and hover
                        ]"
                        @click="navigate"
                    >
                        <n-icon size="22" class="mr-3">
                            <component :is="item.icon" />
                        </n-icon>
                        <span>{{ item.label }}</span>
                    </a>
                </router-link>
            </li>
        </ul>
        <div class="flex-grow" />
    </nav>
</template>

  <script setup lang="ts">
import {
    BarChartOutline as ReportsIcon,
    HomeOutline as DashboardIcon,
    PieChartOutline as BudgetsIcon,
    SwapHorizontalOutline as TransactionsIcon,
} from '@vicons/ionicons5';
import { NIcon } from 'naive-ui';
import { shallowRef } from 'vue'; // Use shallowRef for component types if they don't change
import { RouterLink } from 'vue-router';
// import { useAuthStore } from '@/app/features/auth/store'; // For logout
// import { useRouter } from 'vue-router'; // For logout

// const authStore = useAuthStore();
// const router = useRouter();

interface NavItem {
    label:     string;
    routeName: string;
    icon:      any; // Type for Vue component
}

const navItems = shallowRef<NavItem[]>([
    { label: 'Dashboard', routeName: 'Dashboard', icon: DashboardIcon },
    { label: 'Transactions', routeName: 'Transactions', icon: TransactionsIcon },
    { label: 'Budgets', routeName: 'Budgets', icon: BudgetsIcon },
    { label: 'Reports', routeName: 'Reports', icon: ReportsIcon },
]);

</script>

<style scoped>

</style>
