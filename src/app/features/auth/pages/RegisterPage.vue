<template>
    <div class="register-page-container">
        <n-card class="register-card">
            <template #header>
                <div class="flex items-center">
                    <span class="card-title">Create Your SafeStash Profile</span>
                </div>
            </template>


            <n-alert title="Secure your SafeStash app on this device" type="info">
                <p>This profile protects your local financial data from unauthorized access.</p>
                <p class="privacy-text">
                    This profile and your financial data are stored <strong>only on your device</strong> and are never sent anywhere. SafeStash puts your privacy first.
                </p>
            </n-alert>

            <n-divider />

            <RegisterForm @submit="register" />

            <n-divider title-placement="center">
                Already have an account?
            </n-divider>
            <n-button block @click="goToLogin">
                Login Here
            </n-button>
        </n-card>
    </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '@app/features/auth';
import { UserCreatePayload } from '@shared/dtos/auth.dto';
import {
    NButton,
    NCard,
    NDivider,
} from 'naive-ui';
import { useRouter } from 'vue-router';

import RegisterForm from '../components/RegisterForm.vue';

const { registerUser } = useAuthStore();

const router = useRouter();

async function goToLogin() {
    await router.push('/login');
}

async function register(userData: UserCreatePayload) {
    await registerUser(userData).then(async () => {
        await goToLogin();
    });
}

</script>

<style scoped>
.register-page-container {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 20px;
}

.register-card {
    width: 100%;
    max-width: 600px; /* Max width for the form card */
}

.error-text {
    color: #d03050; /* Naive UI error color */
    font-size: 0.875rem;
    margin-top: 4px;
}
</style>
