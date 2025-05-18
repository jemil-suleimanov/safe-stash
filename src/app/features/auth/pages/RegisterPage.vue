<template>
    <div class="register-page-container">
        <n-card title="Create Your SafeStash Account" class="register-card">
            <n-form
                ref="formRef"
                :model="formData"
                label-placement="top"
                label-width="auto"
                require-mark-placement="right-hanging"
                @submit.prevent="handleRegister"
            >
                <n-grid :cols="2" :x-gap="24">
                    <n-form-item-gi path="firstName" label="First Name">
                        <n-input v-model:value="formData.firstName" placeholder="Enter your first name" />
                    </n-form-item-gi>
                    <n-form-item-gi path="lastName" label="Last Name">
                        <n-input v-model:value="formData.lastName" placeholder="Enter your last name" />
                    </n-form-item-gi>

                    <n-form-item-gi :span="2" path="username" label="Username">
                        <n-input v-model:value="formData.username" placeholder="Choose a username" />
                    </n-form-item-gi>

                    <n-form-item-gi path="password" label="Password">
                        <n-input
                            v-model:value="formData.password"
                            type="password"
                            show-password-on="mousedown"
                            placeholder="Enter a password"
                        />
                    </n-form-item-gi>

                    <n-form-item-gi :span="2" path="passwordHint" label="Password Hint (Optional)">
                        <n-input v-model:value="formData.passwordHint" placeholder="Enter a password hint" />
                    </n-form-item-gi>

                    <n-form-item-gi path="languageCode" label="Default Language">
                        <LanguageSelector />
                    </n-form-item-gi>

                    <n-form-item-gi path="languageCode" label="Default Currency">
                        <CurrencySelector />
                    </n-form-item-gi>

                    <n-form-item-gi :span="2" path="theme" label="Default Theme">
                        <ThemeSelector />
                    </n-form-item-gi>
                </n-grid>



                <n-button
                    type="primary"
                    attr-type="submit"
                    block
                    :loading="false"
                    :disabled="false"
                    style="margin-top: 20px;"
                >
                    Register
                </n-button>
            </n-form>
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
import { CurrencySelector, LanguageSelector, ThemeSelector } from '@app/features/settings';
import { useSettingsStore } from '@app/features/settings/store';
import type { UserPayloadData } from '@shared/dtos/auth.dto';
import {
    type FormInst, // For form validation later
    NButton,     NCard, NDivider,
    NForm, NFormItemGi, NGrid,
    NInput, NRadio,     NRadioGroup, NSpace } from 'naive-ui';
import { storeToRefs } from 'pinia';
import { ref } from 'vue';

const { selectedLanguage } = storeToRefs(useSettingsStore());

const formRef = ref<FormInst | null>(null); // For Naive UI form validation API later
const formData = ref<UserPayloadData>({
    username:     '',
    firstName:    '',
    lastName:     '',
    password:     '',
    passwordHint: '',
    currency:     '',
    language:     selectedLanguage.value || 'en',
    theme:        'light',    // Default theme
});

async function handleRegister() {
    console.log('regsitering');
}


function navigateToLogin() {
    // router.push({ name: 'Login' }); // Assuming a login route
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
