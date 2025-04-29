import { Currency } from '@shared/domain/Currency';
import { Language } from '@shared/domain/Language';
import { defineStore } from 'pinia';
import { ref } from 'vue';

import settingsApi from '../api';

export const useSettingsStore = defineStore('settings', () => {
    const languages = ref<Language[]>([]);
    const currencies = ref<Currency[]>([]);
    const isLoading = ref<boolean>(false);
    const error = ref<string | null>(null);
    const hasFetchedLookups = ref(false);

    function getLanguages() {
        if (!languages.value.length) {
            fetchAvailableSettings();
        }

        return languages;
    }

    function getCurrencies() {
        if (!currencies.value.length) {
            fetchAvailableSettings();
        }

        return languages;
    }

    async function fetchAvailableSettings() {
        if (hasFetchedLookups.value || isLoading.value) {
            return;
        }

        isLoading.value = true;
        error.value = null;
        await settingsApi.getAvailableSettings()
            .then(res => {
                languages.value = res.data?.availableLanguages ?? [];
                currencies.value = res.data?.availableCurrencies ?? [];
                hasFetchedLookups.value = true;
            })
            .catch(err => {
                console.error('Store: Failed to fetch lookups:', error);
                error.value = err.message || 'Failed to load required settings data.';
            })
            .finally(() => {
                isLoading.value = false;
            });
    }

    return {
        languages,
        currencies,
        error,
        isLoading,
        fetchAvailableSettings,
        getLanguages,
        getCurrencies,
    };
});
