<template>
    <n-select
        placeholder="Choose account type"
        :options="accountOptions"
        filterable
    />
    <div>
        {{ $t('account.type.CASH') }}
    </div>
</template>

<script setup lang="ts">
import { useAccountStore } from '@app/features/account/store/useAccountStore';
import { storeToRefs } from 'pinia';
import { computed, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';

const { accountTypes } = storeToRefs(useAccountStore());

const { getAccountCodes } = useAccountStore();

const { t } = useI18n();


const accountOptions = computed(() => {
    console.log('account types', accountTypes);
    return accountTypes.value.map(type => {
        console.log(type, 'type');
        return {
            value: type,
            label: t(`account.type.${type}`),
        };
    });
});

onMounted(() => {
    getAccountCodes();
});
</script>
