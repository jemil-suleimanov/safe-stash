<template>
    <n-select
        v-model:value="accountType"
        placeholder="Choose account type (Optional)"
        :options="accountTypeOptions"
        :loading="isLoading"
        filterable
        clearable
    />
</template>

<script setup lang="ts">
import { useAccountStore } from '@app/features/account/store/useAccountStore';
import type { AccountTypeCode } from '@shared/types/account';
import { NSelect } from 'naive-ui';
import { storeToRefs } from 'pinia';
import { computed, defineProps, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';

defineProps<{
    disabled?: boolean;
}>();

const accountStore = useAccountStore();
const { accountTypes, isLoading } = storeToRefs(accountStore);
const { getAccountCodes } = accountStore; // Action to get types

const { t } = useI18n(); // Use if you have i18n keys for type names, otherwise use DB name

const accountType = defineModel<AccountTypeCode | null>('accountType', { required: true });

const accountTypeOptions = computed(() => {
    if (!accountTypes.value) return [];
    return accountTypes.value.map((type: AccountTypeCode) => ({
        value: type,
        label: t(`account.type.${type}`),
    }));
});

onMounted(async () => {
    if (!accountTypes.value?.length) {
        getAccountCodes();
    }
});
</script>
