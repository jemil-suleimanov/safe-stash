<template>
    <header
        class="app-topbar flex items-center justify-between h-auto py-4 px-4 sm:px-6 lg:px-8"
        :style="{
            backgroundColor: 'transparent',
            borderBottom: `1px solid var(--n-border-color)`
        }"
    >
        <div class="greeting-date-area">
            <h2 class="text-lg sm:text-xl font-medium text-[var(--n-text-color-1)] leading-tight">
                {{ timeOfDayGreeting }}, {{ userFirstName }}
            </h2>
            <p class="text-xs sm:text-sm text-[var(--n-text-color-3)] leading-tight">
                {{ currentDate }}
            </p>
        </div>

        <!-- Right Side: Actions & User Profile -->
        <div class="user-actions flex items-center space-x-3 sm:space-x-4">
            <!-- User Profile Dropdown -->
            <n-dropdown
                trigger="click"
                :options="userDropdownOptions"
                placement="bottom-end"
                :style="{ minWidth: '180px' }"
                @select="handleUserDropdownSelect"
            >
                <n-avatar
                    round
                    size="medium"
                    :style="{ backgroundColor: avatarColor, cursor: 'pointer' }"
                    class="hover:opacity-80 transition-opacity"
                >
                    {{ userInitials }}
                </n-avatar>
            </n-dropdown>
        </div>
    </header>
</template>

<script setup lang="ts">
import { useAuthStore } from '@app/features/auth/store';
import {
    LogOutOutline as LogoutIcon,
    SettingsOutline as SettingsIcon,
} from '@vicons/ionicons5';
import { NAvatar, NDropdown, NIcon } from 'naive-ui';
import { type Component, computed, h } from 'vue';

const authStore = useAuthStore();

const timeOfDayGreeting = computed(() => {
    const hour = new Date().getHours();
    if (hour < 5) return 'Good Evening';
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
});

const userFirstName = computed(() => {
    return authStore.user?.firstName || authStore.user?.username || 'User';
});

const currentDate = computed(() => {
    return new Date().toLocaleDateString('en-ES', {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
    });
});

// --- User Avatar Logic ---
const userInitials = computed(() => {
    if (authStore.user?.firstName && authStore.user?.lastName) {
        return `${authStore.user.firstName.charAt(0)}${authStore.user.lastName.charAt(0)}`.toUpperCase();
    }
    if (authStore.user?.firstName) {
        return authStore.user.firstName.charAt(0).toUpperCase();
    }
    if (authStore.user?.username) {
        return authStore.user.username.charAt(0).toUpperCase();
    }
    return ''; // NAvatar will show icon if no text
});

// Example: Generate a color for avatar based on username for consistency
// This is a simple hash, more sophisticated ones exist.
const avatarColor = computed(() => {
    const name = authStore.user?.username || 'DefaultUser';
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
        hash = name.charCodeAt(i) + ((hash << 5) - hash);
        hash = hash & hash; // Convert to 32bit integer
    }
    // Use a slice of your theme palette or generate a color
    const colors = [
        'var(--primary-color)',
        'var(--info-color)',
        'var(--success-color)',
        'var(--warning-color)',
        // Add more soft accent colors from your "Her" palette
        'var(--n-color-embedded)', // A neutral from Naive UI
    ];
    return colors[Math.abs(hash) % colors.length];
});

// --- User Dropdown Logic ---
const renderIcon = (icon: Component) => () => h(NIcon, null, { default: () => h(icon) });

const userDropdownOptions = computed(() => [
    // { label: `Hi, ${userFirstName.value}!`, key: 'greeting', disabled: true, class: 'font-semibold' },
    // { type: 'divider', key: 'd0' },
    {
        label: 'Profile Settings',
        key:   'profile-settings',
        icon:  renderIcon(SettingsIcon),
        // props: { onClick: () => router.push({ name: 'ProfileSettings'})} // Alternative navigation
    },
    {
        label: 'App Settings', // e.g. for theme persistence if not in profile
        key:   'app-settings',
        icon:  renderIcon(SettingsIcon),
    },
    { type: 'divider', key: 'd1' },
    {
        label: 'Logout',
        key:   'logout',
        icon:  renderIcon(LogoutIcon),
    },
]);

function handleUserDropdownSelect(key: string | number) {
    switch (key) {
    case 'profile-settings':
        // router.push({ name: 'ProfileSettingsPage' }); // TODO
        alert('Navigate to Profile Settings (WIP)');
        break;
    case 'app-settings':
        // router.push({ name: 'AppSettingsPage' }); // TODO
        alert('Navigate to App Settings (WIP)');
        break;
    case 'logout':
        authStore.logout(); // Store handles navigation
        break;
    }
}

</script>
