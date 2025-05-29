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
            <n-form-item-gi path="firstName" :label="$t('register.form.firstNameLabel')">
                <n-input
                    v-model:value="formData.firstName"
                    :placeholder="$t('register.form.firstNamePlaceholder')"
                />
            </n-form-item-gi>

            <n-form-item-gi path="lastName" :label="$t('register.form.lastNameLabel')">
                <n-input
                    v-model:value="formData.lastName"
                    :placeholder="$t('register.form.lastNamePlaceholder')"
                />
            </n-form-item-gi>

            <n-form-item-gi :span="2" path="username" :label="$t('register.form.usernameLabel')">
                <n-input
                    v-model:value="formData.username"
                    :placeholder="$t('register.form.usernamePlaceholder')"
                />
            </n-form-item-gi>

            <n-form-item-gi path="password" :label="$t('register.form.passwordLabel')">
                <n-input
                    v-model:value="formData.password"
                    type="password"
                    show-password-on="mousedown"
                    :placeholder="$t('register.form.passwordPlaceholder')"
                />
            </n-form-item-gi>

            <n-form-item-gi path="confirmPassword" :label="$t('register.form.confirmPasswordLabel')">
                <n-input
                    v-model:value="formData.confirmPassword"
                    type="password"
                    show-password-on="mousedown"
                    :placeholder="$t('register.form.confirmPasswordPlaceholder')"
                />
            </n-form-item-gi>

            <n-form-item-gi :span="2" path="passwordHint" label-style="display: flex; align-items: center;">
                <template #label>
                    {{ $t('register.form.passwordHintLabel') }}
                    <n-popover trigger="hover" style="max-width: 300px;">
                        <template #trigger>
                            <n-icon size="18" :depth="3" style="cursor: help; padding-top: 4px;">
                                <HelpCircleOutline />
                            </n-icon>
                        </template>
                        <span>{{ $t('register.form.passwordHintInfo.tooltip') }}</span>
                    </n-popover>
                </template>
                <n-input
                    v-model:value="formData.passwordHint"
                    :placeholder="$t('register.form.passwordHintPlaceholder')"
                    :status="formErrors.passwordHint ? 'error' : undefined"
                />
            </n-form-item-gi>

            <n-form-item-gi path="languageCode" :label="$t('register.form.languageCodeLabel')">
                <LanguageSelector />
            </n-form-item-gi>

            <n-form-item-gi path="currencyCode" :label="$t('register.form.currencyCodeLabel')">
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
            {{ $t('register.form.submitButton') }}
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
import { computed, reactive, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';

const notificationStore = useNotificationStore();
const { t } = useI18n();

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

const formRules = computed(() => {
    return {
        username: [
            { required: true, message: t('register.form.validation.usernameRequired'), trigger: ['input', 'blur'] },
            { min: 3, message: t('register.form.validation.usernameMin'), trigger: ['input', 'blur'] },
        ],
        password: [
            { required: true, message: t('register.form.validation.passwordRequired'), trigger: ['input', 'blur'] },
            { min: 6, message: t('register.form.validation.passwordMin'), trigger: ['input', 'blur'] },
        ],
        passwordHint: [
            { required: true, message: t('register.form.validation.passwordHintRequired'), trigger: ['input', 'blur'] },
            { min: 3, message: t('register.form.validation.passwordHintMin'), trigger: ['input', 'blur'] },
        ],
        confirmPassword: [
            { required: true, message: t('register.form.validation.confirmPasswordRequired'), trigger: ['input', 'blur'] },
            {
                validator: (rule: FormItemRule, value: string) => {
                    if (value !== formData.value.password) {
                        return new Error(t('register.form.validation.confirmPasswordMismatch'));
                    }
                    return true;
                },
                trigger: ['input', 'blur'],
            },
        ],
        languageCode: [
            { required: true, message: t('register.form.validation.languageCodeRequired'), trigger: ['change', 'blur'] },
        ],
        currencyCode: [
            { required: true, message: t('register.form.validation.currencyCodeRequired'), trigger: ['change', 'blur'] },
        ],
    };
});


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
        notificationStore.error(t('register.form.formError'));
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
