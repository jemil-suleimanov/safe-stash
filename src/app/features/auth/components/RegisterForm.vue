<template>
    <n-form
        ref="formRef"
        :model="formData"
        :rules="formRules"
        label-placement="top"
        label-width="auto"
        require-mark-placement="right-hanging"
        @submit.prevent="onFormSubmit"
    >
        <n-grid :cols="2" :x-gap="24" :y-gap="4">
            <n-form-item-gi path="firstName" label="First Name (Optional)">
                <n-input v-model:value="formData.firstName" placeholder="Enter your first name" />
            </n-form-item-gi>
            <n-form-item-gi path="lastName" label="Last Name (Optional)">
                <n-input v-model:value="formData.lastName" placeholder="Enter your last name" />
            </n-form-item-gi>

            <n-form-item-gi :span="2" path="username" label="Username">
                <n-input v-model:value="formData.username" placeholder="Choose a local username" />
            </n-form-item-gi>

            <n-form-item-gi path="password" label="Password">
                <n-input
                    v-model:value="formData.password"
                    type="password"
                    show-password-on="mousedown"
                    placeholder="Enter a password"
                />
            </n-form-item-gi>
            <n-form-item-gi path="confirmPassword" label="Confirm Password">
                <n-input
                    v-model:value="formData.confirmPassword"
                    type="password"
                    show-password-on="mousedown"
                    placeholder="Confirm your password"
                />
            </n-form-item-gi>

            <n-form-item-gi :span="2" path="passwordHint" label-style="display: flex; align-items: center;">
                <template #label>
                    Password Hint
                    <n-popover trigger="hover" style="max-width: 300px;">
                        <template #trigger>
                            <n-icon size="18" :depth="3" style="cursor: help; padding-top: 4px;">
                                <HelpCircleOutline />
                            </n-icon>
                        </template>
                        <span>
                            <strong>SafeStash</strong> is a fully offline app and cannot send password recovery links.
                            This hint will be shown to you locally if you forget your password.
                            Make it memorable for you, but not obvious to others.
                        </span>
                    </n-popover>
                </template>
                <n-input
                    v-model:value="formData.passwordHint"
                    placeholder="e.g., My first pet's name"
                    :status="formErrors.passwordHint ? 'error' : undefined"
                />
            </n-form-item-gi>

            <n-form-item-gi path="languageCode" label="Default Language">
                <LanguageSelector />
            </n-form-item-gi>

            <n-form-item-gi path="currencyCode" label="Default Currency">
                <CurrencySelector />
            </n-form-item-gi>
        </n-grid>

        <n-button
            type="primary"
            attr-type="submit"
            block
            :loading="isLoading"
            :disabled="isLoading"
            style="margin-top: 24px;"
        >
            Create Profile & Secure App
        </n-button>
        <n-text v-if="error" type="error" class="form-error-text">
            {{ error }}
        </n-text>
    </n-form>
</template>

<script setup lang="ts">
import { useAuthStore } from '@app/features/auth';
import { CurrencySelector, LanguageSelector, useSettingsStore } from '@app/features/settings';
import { useNotificationStore } from '@app/stores/notificationStore';
import type { UserCreatePayload } from '@shared/dtos/auth.dto';
import { HelpCircleOutline } from '@vicons/ionicons5';
import {
    type FormInst,
    FormItemRule,
    FormRules,
    NButton,     NForm, NFormItemGi, NGrid, NInput, NText,
} from 'naive-ui';
import { storeToRefs } from 'pinia';
import { reactive, ref, watch } from 'vue';

const notificationStore = useNotificationStore();

const emit = defineEmits<{
    (e: 'submit', userData: UserCreatePayload);
}>();

const { selectedLanguage, defaultCurrency } = storeToRefs(useSettingsStore());
const { isLoading, error } = storeToRefs(useAuthStore());
const formRef = ref<FormInst | null>(null);
const formData = ref({
    firstName:       '',
    lastName:        '',
    username:        '',
    email:           '',
    password:        '',
    confirmPassword: '',
    passwordHint:    '',
    languageCode:    '',
    currencyCode:    '',
});

const formErrors = reactive<Record<string, boolean>>({
    firstName:       false,
    lastName:        false,
    username:        false,
    password:        false,
    confirmPassword: false,
});

const formRules: FormRules = {
    username: [
        { required: true, message: 'Username is required.', trigger: ['input', 'blur'] },
        { min: 3, message: 'Username must be at least 3 characters long.', trigger: ['input', 'blur'] },
    ],
    password: [
        { required: true, message: 'Password is required.', trigger: ['input', 'blur'] },
        { min: 6, message: 'Password must be at least 6 characters long.', trigger: ['input', 'blur'] },
    ],
    passwordHint: [
        { required: true, message: 'Password hint is required.', trigger: ['input', 'blur'] },
        { min: 3, message: 'Hint should be at least 3 characters long for effectiveness.', trigger: ['input', 'blur'] },
    ],
    confirmPassword: [
        { required: true, message: 'Please confirm your password.', trigger: ['input', 'blur'] },
        {
            validator: (rule: FormItemRule, value: string) => {
                if (value !== formData.value.password) {
                    return new Error('Passwords do not match.');
                }
                return true;
            },
            trigger: ['input', 'blur'],
        },
    ],
    languageCode: [
        { required: true, message: 'Please select a default language.', trigger: ['change', 'blur'] },
    ],
    currencyCode: [
        { required: true, message: 'Please select a default currency.', trigger: ['change', 'blur'] },
    ],
};


watch([selectedLanguage, defaultCurrency], ([newLanguage, newCurrency]) => {
    if (newLanguage) {
        formData.value.languageCode = newLanguage;
    }
    if (newCurrency) {
        formData.value.currencyCode = newCurrency.code;
    }
});


async function onFormSubmit() {
    const isValid = await formRef.value?.validate().catch(() => {
        notificationStore.error('Please fill in all required fields correctly.');
    });

    if (!isValid) {
        return;
    }

    const payload: UserCreatePayload = {
        username:     formData.value.username,
        firstName:    formData.value.firstName || null,
        lastName:     formData.value.lastName || null,
        email:        formData.value.email || null,
        password:     formData.value.password,
        passwordHint: formData.value.passwordHint,
        languageCode: formData.value.languageCode,
        currencyCode: formData.value.currencyCode,
    };

    notificationStore.info('Creating your profile...');
    emit('submit', payload);
}
</script>

<style scoped>
  .error-text {
    color: var(--n-color-error); /* Use Naive UI theme variable */
    font-size: 12px; /* Smaller for inline messages */
    margin-top: 4px;
  }
  .form-error-text {
    display: block;
    text-align: center;
    margin-top: 10px;
    color: var(--n-color-error);
  }
</style>
