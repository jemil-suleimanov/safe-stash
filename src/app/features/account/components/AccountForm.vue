<template>
    <n-form
        ref="formRef"
        :model="formData"
        :rules="formRules"
        label-placement="top"
        class="space-y-4 p-1"
        @submit.prevent="handleSubmit"
    >
        <n-form-item path="name" label="Account Name">
            <n-input
                v-model:value="formData.name"
                placeholder="e.g., Main Checking, Savings Pot"
                size="large"
                :status="formErrors.name ? 'error' : undefined"
                @blur="validateField('name')"
                @input="clearError('name')"
            />
        </n-form-item>

        <n-form-item path="startBalanceCents" label="Starting Balance">
            <n-input-number
                v-model:value="formData.startBalanceCents"
                placeholder="0.00"
                clearable
                :precision="2"
                :step="10"
                size="large"
                class="w-full"
                :show-button="false"
                :status="formErrors.startBalanceCents ? 'error' : undefined"
                @blur="validateField('startBalanceCents')"
                @update:value="clearError('startBalanceCents')"
            >
                <template #prefix>
                    {{ defaultCurrency?.symbol }}
                </template>
            </n-input-number>
        </n-form-item>

        <n-form-item path="accountTypeCode" label="Account Type">
            <AccountTypeSelector v-model:account-type="formData.accountTypeCode" />
        </n-form-item>

        <n-form-item path="iconPath" label="Icon Name (Optional)">
            <n-input
                v-model:value="formData.iconPath"
                placeholder="e.g., 'cash-outline', 'card-outline' (from IonIcons)"
                size="large"
                :status="formErrors.iconPath ? 'error' : undefined"
                @blur="validateField('iconPath')"
                @input="clearError('iconPath')"
            />
        </n-form-item>

        <n-form-item path="description" label="Notes (Optional)">
            <n-input
                v-model:value="formData.description"
                type="textarea"
                placeholder="Any additional details..."
                :autosize="{ minRows: 2, maxRows: 4 }"
                size="large"
            />
        </n-form-item>

        <div class="flex justify-end space-x-3 mt-6">
            <n-button size="large" :disabled="props.isLoading" @click="handleCancel">
                Cancel
            </n-button>
            <n-button
                type="primary"
                attr-type="submit"
                :loading="props.isLoading"
                :disabled="props.isLoading"
                size="large"
            >
                {{ props.mode === 'edit' ? 'Save Changes' : 'Create Account' }}
            </n-button>
        </div>
    </n-form>
</template>

<script setup lang="ts">
import { useSettingsStore } from '@app/features/settings';
import type { CreateAccountPayload } from '@shared/dtos/account.dto';
import type { AccountTypeCode } from '@shared/types/account';
import {
    type FormInst, type FormItemRule, type FormRules,
    NButton, NForm, NFormItem, NInput, NInputNumber,
} from 'naive-ui';
import { storeToRefs } from 'pinia';
import { computed,defineEmits, defineProps, onMounted, reactive, ref, watch } from 'vue';

import AccountTypeSelector from './AccountTypeSelector.vue';

interface AccountFormData {
    id?:               number;
    name:              string;
    startBalanceCents: number | null;
    description:       string;
    accountTypeCode:   AccountTypeCode;
    iconPath:          string;
}

const props = withDefaults(defineProps<{ // Use withDefaults for mode
    mode?:        'create' | 'edit';
    initialData?: Partial<AccountFormData>;
    isLoading?:   boolean;
}>(), {
    mode: 'create',
});

const emit = defineEmits<{
    (e: 'submit', payload: CreateAccountPayload): void;
    (e: 'cancel'): void;
}>();

const formRef = ref<FormInst | null>(null);
const settingsStore = useSettingsStore();
const { defaultCurrency } = storeToRefs(settingsStore); // For displaying user's default currency

const defaultFormData: AccountFormData = {
    name:              '',
    startBalanceCents: 0,
    description:       '',
    accountTypeCode:   'BANK_CHK',
    iconPath:          '',
};

const formData = reactive<AccountFormData>(defaultFormData);

onMounted(() => {
    if (props.mode === 'edit' && props.initialData) {
        Object.assign(formData, {
            ...defaultFormData,
            ...props.initialData,
            startBalanceCents: props.initialData.startBalanceCents !== undefined
                ? props.initialData.startBalanceCent / 100 : 0,
            iconPath: props.initialData.iconPath || '', // Ensure string
        });
    } else {
        formData.startBalanceCents = 0;
    }
});

watch(() => props.initialData, (newData) => {
    if (props.mode === 'edit' && newData) {
        Object.assign(formData, {
            ...defaultFormData,
            ...newData,
            startBalanceCents: newData.startBalanceCents !== undefined
                ? newData.startBalanceCents / 100 : 0,
            iconPath: newData.iconPath || '',
        });
    } else if (props.mode === 'create') {
        Object.assign(formData, defaultFormData);
        formData.startBalanceCents = 0;
    }
}, { immediate: true, deep: true });

const formErrors = reactive<Record<keyof Omit<AccountFormData, 'id'>, boolean>>({
    name:              false,
    startBalanceCents: false,
    description:       false,
    accountTypeCode:   false,
    iconPath:          false,
});

const formRules: FormRules = {
    name: [
        { required: true, message: 'Account name is required.', trigger: ['input', 'blur'] },
        { min: 2, message: 'Account name should be at least 2 characters long.', trigger: ['input', 'blur'] },
    ],
    accountTypeCode: [
        { required: true, message: 'Account type is required.', trigger: ['input', 'blur'] },
    ],
    startBalanceCents: [
        {
            required:  true, type:      'number',
            message:   'Starting balance is required.', trigger:   ['input', 'blur'],
            validator: (rule: FormItemRule, value: number | null) => {
                if (value === null) return new Error('Starting balance is required.');
                return true;
            },
        },
    ],
};

async function validateField(fieldPath: keyof Omit<AccountFormData, 'id'>) {
    if (!formRef.value) return;
    try {
        await formRef.value.validate(undefined, (rule) => rule.key === fieldPath || rule.fullPath === fieldPath);
        if (formErrors[fieldPath] !== undefined) formErrors[fieldPath] = false;
    } catch (errors) {
        if (formErrors[fieldPath] !== undefined) formErrors[fieldPath] = true;
    }
}

function clearError(fieldPath: keyof Omit<AccountFormData, 'id'>) {
    if (formErrors[fieldPath]) formErrors[fieldPath] = false;
}

async function handleSubmit() {
    if (!formRef.value) return;
    Object.keys(formErrors).forEach(key => formErrors[key as keyof typeof formErrors] = false);
    try {
        await formRef.value.validate();
        const payload: CreateAccountPayload = {
            name:              formData.name,
            startBalanceCents: formData.startBalanceCents !== null ? Math.round(formData.startBalanceCents * 100) : 0,
            description:       formData.description || null,
            type:              formData.accountTypeCode,
            iconPath:          formData.iconPath || null,
        };
        emit('submit', payload);
    } catch (validationErrors) {
        const errorFields = (validationErrors as Array<{ key: string }>).map(e => e.key);
        errorFields.forEach(field => {
            if (formErrors[field as keyof typeof formErrors] !== undefined) {
                formErrors[field as keyof typeof formErrors] = true;
            }
        });
        console.log('Account form validation failed:', validationErrors);
    }
}

function handleCancel() {
    emit('cancel');
}
</script>
