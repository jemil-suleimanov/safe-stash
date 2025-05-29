<template>
    <div class="register-page-container">
        <n-card class="register-card">
            <template #header>
                <div class="flex items-center">
                    <span class="card-title">{{ $t('greet') }}</span>
                </div>
            </template>


            <n-alert :title="$t('register.info.title')" type="info">
                <p>{{ $t('register.info.line1') }}</p>
                <p class="privacy-text">
                    {{ $t('register.info.line2') }}
                </p>
            </n-alert>

            <n-divider />

            <RegisterForm @submit="register" />

            <n-divider title-placement="center">
                {{ $t('register.account') }}
            </n-divider>
            <n-button block @click="goToLogin">
                {{ $t('register.login') }}
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
