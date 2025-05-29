<template>
    <n-form
        ref="formRef"
        :model="formData"
        :rules="formRules"
        label-placement="top"
        @submit.prevent="onFormSubmit"
    >
        <n-form-item :label="$t('login.form.usernameLabel')" path="username">
            <n-input
                v-model:value="formData.username"
                :placeholder="$t('login.form.usernamePlaceholder')"
                :status="formErrors.username ? 'error' : undefined"
                @blur="validateField('username')"
                @input="clearError('username')"
            >
                <template #prefix>
                    <n-icon :component="PersonOutline" />
                </template>
            </n-input>
        </n-form-item>

        <n-form-item :label="$t('login.form.passwordLabel')" path="password">
            <n-input
                v-model:value="formData.password"
                type="password"
                show-password-on="mousedown"
                :placeholder="$t('login.form.passwordPlaceholder')"
                :status="formErrors.password ? 'error' : undefined"
                @blur="validateField('password')"
                @input="clearError('password')"
            >
                <template #prefix>
                    <n-icon :component="LockClosedOutline" />
                </template>
            </n-input>
        </n-form-item>

        <n-button
            type="primary"
            attr-type="submit"
            block
            :loading="isLoading"
            :disabled="isLoading"
            style="margin-top: 20px;"
        >
            {{ $t('login.form.submitButton') }}
        </n-button>
    </n-form>
</template>

<script setup lang="ts">
import { UserLoginPayload } from '@shared/dtos/auth.dto';
import { LockClosedOutline,PersonOutline } from '@vicons/ionicons5';
import {
    type FormInst,
    type FormRules, NButton,     NForm, NFormItem, NIcon,
    NInput   } from 'naive-ui';
import { defineEmits, defineProps,reactive, ref } from 'vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const emit = defineEmits<{
    // eslint-disable-next-line no-unused-vars
    (e: 'loginSubmit', payload: UserLoginPayload): void;
}>();

defineProps<{
    isLoading?: boolean; // Allow parent to pass loading state
}>();

const formRef = ref<FormInst | null>(null);
const formData = reactive<UserLoginPayload>({
    username: '',
    password: '',
});

// To manually track error states for input :status prop
const formErrors = reactive<Record<keyof UserLoginPayload, boolean>>({
    username: false,
    password: false,
});

const formRules: FormRules = {
    username: [
        { required: true, message: t('login.form.validation.usernameRequired'), trigger: ['input', 'blur'] },
    ],
    password: [
        { required: true, message: t('login.form.validation.passwordRequired'), trigger: ['input', 'blur'] },
    ],
};

// Function to validate a single field (e.g., on blur)
async function validateField(fieldPath: keyof UserLoginPayload) {
    if (!formRef.value) return;
    try {
        await formRef.value.validate(
            undefined,
            (rule) => rule.key === fieldPath,
        );
        formErrors[fieldPath] = false;
    } catch (errors) {
        console.warn('validation error: ', errors);
        formErrors[fieldPath] = true;
    }
}

// Function to clear manual error state on input
function clearError(fieldPath: keyof UserLoginPayload) {
    if (formErrors[fieldPath]) {
        formErrors[fieldPath] = false;
    }
}

async function onFormSubmit() {
    if (!formRef.value) return;

    Object.keys(formErrors).forEach(key => formErrors[key as keyof UserLoginPayload] = false);

    try {
        await formRef.value.validate();

        emit('loginSubmit', { ...formData });
    } catch (validationErrors) {
        const errorFields = (validationErrors as Array<{ key: keyof typeof formErrors }>).map(e => e.key);
        errorFields.forEach(field => {
            if (formErrors[field] !== undefined) {
                formErrors[field] = true;
            }
        });
        console.log('Login form validation failed:', validationErrors);
    }
}
</script>
