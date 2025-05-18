<template>
    <n-select
        v-model="defaultCurrency"
        placeholder="Choose currency"
        :options="currencyOptions"
        filterable
        @update:value="onChange"
    />
</template>

<script setup lang="ts">
import { useSettingsStore } from '@app/features/settings/store';
import { SupportedLocales } from '@app/shared/plugins/i18n';
import { storeToRefs } from 'pinia';
import { computed, onMounted } from 'vue';

const { currencies, defaultCurrency } = storeToRefs(useSettingsStore());

const { getCurrencies, setCurrency } = useSettingsStore();


const currencyOptions = computed(() => {
    return currencies.value.map(currency => {
        return {
            value: currency.code,
            label: `${currency.symbol} | ${currency.name}`,
        };
    });
});

onMounted(() => {
    getCurrencies();
});

function onChange(value: SupportedLocales) {
    setCurrency(value);
}
</script>
