import { useSettingsStore } from '@app/features/settings';
import { SupportedLocales } from '@app/shared/plugins/i18n';
import { User } from '@shared/domain/User';
import { UserCreatePayload, UserLoginPayload } from '@shared/dtos/auth.dto';
import { defineStore } from 'pinia';
import { ref } from 'vue';

import AuthApi from '../api';

export const useAuthStore = defineStore('auth', () => {
    const isLoading = ref(false);
    const error = ref<string | null>(null);
    const user = ref<User | null>(null);
    const isAuthenticated = ref(false);

    const settingsStore = useSettingsStore();

    async function registerUser(userData: UserCreatePayload) {
        isLoading.value = true;
        error.value = null;

        try {
            const response = await AuthApi.register(userData);
            if (response) {
                user.value = response;
                isAuthenticated.value = true;
            }
            return user;
        } catch (err) {
            error.value = 'An error occurred during registration.';
            console.error('Registration error:', err);
        } finally {
            isLoading.value = false;
        }
    }

    function logout() {
        user.value = null;
        isAuthenticated.value = false;
    }

    async function login(userData: UserLoginPayload) {
        isLoading.value = true;
        error.value = null;

        try {
            const loggedUser = await AuthApi.login(userData);
            user.value = loggedUser;
            if (user.value?.currencyCode) {
                settingsStore.setCurrency(user.value?.currencyCode);
                settingsStore.setLanguage(user.value.languageCode as SupportedLocales);
            }
            return true;
        } catch (err) {
            error.value = err instanceof Error ? err.message : 'Login failed.';
            return false;
        } finally {
            isLoading.value = false;
        }
    }

    async function attemptAutoLogin(): Promise<boolean> {
        console.log('Attempting auto-login...');
        isLoading.value = true;
        try {
            const userResponse = await AuthApi.getInitialSession();
            if (userResponse) {
                user.value = userResponse;
                settingsStore.setCurrency(user.value.currencyCode);
                settingsStore.setLanguage(user.value.languageCode as SupportedLocales);
                return true;
            }
            console.log('No remembered session found for auto-login.');
            return false;
        } catch (err) {
            console.error('Error during auto-login attempt:', err);
            error.value = 'Failed to check remembered session.'; // Keep this subtle
            return false;
        } finally {
            isLoading.value = false;
        }
    }

    return {
        user,
        error,
        isLoading,
        isAuthenticated,
        registerUser,
        logout,
        login,
        attemptAutoLogin,
    };
});
