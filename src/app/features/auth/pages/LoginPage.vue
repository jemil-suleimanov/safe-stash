<template>
    <div class="flex items-center justify-center h-full">
        <n-card class="w-full max-w-md shadow-xl rounded-lg">
            <template #header>
                <h1 class="text-2xl sm:text-3xl font-bold text-center text-gray-900">
                    {{ $t('login.title') }}
                </h1>
            </template>

            <div class="text-center text-sm text-gray-600 mb-6 px-2">
                <p>{{ $t('login.subtitle') }}</p>
            </div>

            <LoginForm :is-loading="authStore.isLoading" @login-submit="handleLoginSubmit" />

            <div v-if="authStore.error && !authStore.isLoading" class="mt-4 text-center text-sm text-red-600">
                {{ authStore.error }}
            </div>

            <div class="mt-3 text-right">
                <n-button text type="primary" @click="handleForgotPassword">
                    {{ $t('login.forgotPassword') }}
                </n-button>
            </div>

            <n-modal
                v-model:show="showHintModal"
                preset="card"
                :title="$t('login.passwordHintTitle')"
                class="max-w-sm w-11/12"
            >
                <n-spin :show="isLoadingHintUi">
                    <div v-if="passwordHintUi" class="py-4 text-gray-700 break-words whitespace-pre-wrap">
                        {{ passwordHintUi }}
                    </div>
                    <div v-else-if="!isLoadingHintUi && provideUsernameForHint" class="py-4 text-gray-600">
                        {{ $t('login.enterUsernameForHint') }}
                    </div>
                </n-spin>
                <n-input
                    v-if="provideUsernameForHint"
                    v-model:value="usernameForHintModal"
                    :placeholder="$t('login.usernameInputPlaceholder')"
                    class="mt-4"
                    @keydown.enter="fetchHintFromModal"
                />
                <n-button
                    v-if="provideUsernameForHint"
                    block
                    class="mt-3"
                    @click="fetchHintFromModal"
                >
                    {{ $t('login.getHintButton') }}
                </n-button>
                <template #footer>
                    <n-button class="w-full" @click="showHintModal = false">
                        {{ $t('login.gotItButton') }}
                    </n-button>
                </template>
            </n-modal>

            <n-divider class="my-6">
                <span class="text-xs text-gray-500">{{ $t('login.noProfileYet') }}</span>
            </n-divider>

            <n-button
                block
                strong
                secondary
                @click="navigateToRegister"
            >
                {{ $t('login.createLocalProfile') }}
            </n-button>

            <div class="mt-8 mb-4 text-center text-xs text-gray-500">
                {{ $t('login.localSecurityNote') }}
            </div>

            <LanguageSelector />
        </n-card>
    </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '@app/features/auth';
import LanguageSelector from '@app/features/settings/components/LanguageSelector.vue';
import type { UserLoginPayload } from '@shared/dtos/auth.dto';
import { NButton, NCard, NDivider, NInput, NModal, NSpin, useMessage } from 'naive-ui';
import { onUnmounted,ref, watch } from 'vue';
import { useRouter } from 'vue-router';

import LoginForm from '../components/LoginForm.vue';

const router = useRouter();
const authStore = useAuthStore();
const messageApi = useMessage(); // For general UI messages not tied to authStore.error

const showHintModal = ref(false);
const passwordHintUi = ref<string | null>(null); // For displaying the hint in UI
const isLoadingHintUi = ref(false); // UI loading state for hint
const usernameForHintModal = ref(''); // Username entered in the modal
const provideUsernameForHint = ref(false); // Control visibility of username input in modal

// Variable to store username from the main login form temporarily
let lastAttemptedUsername = '';

async function handleLoginSubmit(credentials: UserLoginPayload) {
    lastAttemptedUsername = credentials.username; // Store username from this attempt
    passwordHintUi.value = null; // Clear any old hint when attempting login
    provideUsernameForHint.value = false;

    authStore.login(credentials).then(async () => {
        await router.push('/app');
    });
}

async function handleForgotPassword() {
    authStore.error = null; // Clear main login error when opening hint modal

    if (lastAttemptedUsername) {
        usernameForHintModal.value = lastAttemptedUsername; // Pre-fill if available
        provideUsernameForHint.value = false; // Don't initially ask for it again
        showHintModal.value = true;
        await fetchHint(lastAttemptedUsername);
    } else {
        // No username available, prompt for it in the modal
        passwordHintUi.value = 'Please enter your username to retrieve the hint.';
        provideUsernameForHint.value = true;
        showHintModal.value = true;
    }
}

async function fetchHint(username: string) {
    if (!username.trim()) {
        passwordHintUi.value = 'Username is required to fetch a hint.';
        provideUsernameForHint.value = true; // Keep input visible if they cleared it
        return;
    }
    isLoadingHintUi.value = true;
    passwordHintUi.value = null;
    try {
        // MOCK BACKEND CALL FOR HINT for now
        console.log(`Mocking: Fetching hint for username: ${username}`);
        await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay
        if (username === 'testuser') { // Example user with a hint
            passwordHintUi.value = 'Your hint: Favorite color';
        } else if (username === 'no_hint_user') { // Example user with no hint
            passwordHintUi.value = 'No password hint was set for this username.';
        } else { // Username not found (mocked)
            passwordHintUi.value = 'Username not found or no hint available.';
        }
        // END MOCK
        // In real implementation:
        // const hint = await authApi.getPasswordHint(username); // Assuming authApi is set up
        // if (hint) {
        //   passwordHintUi.value = `Your hint: ${hint}`;
        // } else {
        //   passwordHintUi.value = "No password hint was set for this username, or username not found.";
        // }
    } catch (err) {
        // This catch is for the mocked promise or if authApi.getPasswordHint throws
        passwordHintUi.value = err instanceof Error ? err.message : 'Could not retrieve hint due to an error.';
        messageApi.error(passwordHintUi.value); // Show error using Naive UI message
    } finally {
        isLoadingHintUi.value = false;
    }
}

async function fetchHintFromModal() {
    provideUsernameForHint.value = false; // Hide input once "Get Hint" is clicked
    await fetchHint(usernameForHintModal.value);
}

async function navigateToRegister() {
    authStore.error = null; // Clear login error before navigating
    await router.push('/');
}

// Clear hint when modal is closed
onUnmounted(() => {
    // This won't work as expected for modal v-model:show,
    // better to clear it when opening or successfully getting hint.
    // passwordHintUi.value = null;
});

// Watch modal state to clear hint input if needed
watch(showHintModal, (newValue) => {
    if (!newValue) {
        // When modal closes, reset hint-related states
        // passwordHintUi.value = null; // Keep hint visible until next "Forgot Password" click
        usernameForHintModal.value = '';
        provideUsernameForHint.value = false;
        isLoadingHintUi.value = false;
    } else {
        // When modal opens, clear previous generic login error message
        authStore.error = null;
    }
});
</script>
