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

    async function registerUser(userData: UserCreatePayload) {
        isLoading.value = true;
        error.value = null;

        try {
            const response = await AuthApi.register(userData);
            if (response) {
                user.value = response;
                isAuthenticated.value = true;
            }
            return response;
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

    function login(userData: UserLoginPayload) {
        return AuthApi.login(userData).then((res) => {
            isAuthenticated.value = true;
            user.value = res;
        });
    }

    return {
        user,
        error,
        isLoading,
        isAuthenticated,
        registerUser,
        logout,
        login,
    };
});
