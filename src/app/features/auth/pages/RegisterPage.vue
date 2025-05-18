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

            <RegisterForm />

            <n-divider title-placement="center">
                Already have an account?
            </n-divider>
            <n-button block @click="navigateToLogin">
                Login Here
            </n-button>
        </n-card>
    </div>
</template>

<script setup lang="ts">
import {
    NButton,
    NCard,
    NDivider,
} from 'naive-ui';

import RegisterForm from '../components/RegisterForm.vue';


function navigateToLogin() {
    alert('Navigate to Login page (to be implemented)');
}

</script>

<style scoped>
.register-page-container {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 90vh; /* Adjust as needed */
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
