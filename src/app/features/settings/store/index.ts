import { SupportedLocales, updateLocale } from '@app/shared/plugins/i18n';
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
    const selectedLanguage = ref<SupportedLocales | null>(null);
    const defaultCurrency = ref<Currency | null>(null);
    const theme = ref<'light' | 'dark'>('light');

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

    function setTheme(newTheme: 'light' | 'dark') {
        theme.value = newTheme;
    }

    function setLanguage(language: SupportedLocales) {
        if (languages.value.some(lang => lang.code === language)) {
            selectedLanguage.value = language;
            updateLocale(language);
        } else {
            console.error(`Language ${language} is not available.`);
        }
    }

    function setCurrency(currency: string) {
        const newCurrency = currencies.value.find(cur => cur.code === currency);
        if (newCurrency) {
            defaultCurrency.value = newCurrency;
        } else {
            console.error(`Currency ${currency} is not available.`);
        }
    }

    async function fetchAvailableSettings() {
        if (hasFetchedLookups.value || isLoading.value) {
            return;
        }

        isLoading.value = true;
        error.value = null;
        await settingsApi.getAvailableSettings()
            .then(res => {
                languages.value = res?.availableLanguages ?? [];
                currencies.value = res?.availableCurrencies ?? [];
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
        theme,
        error,
        isLoading,
        selectedLanguage,
        defaultCurrency,
        fetchAvailableSettings,
        getLanguages,
        getCurrencies,
        setLanguage,
        setCurrency,
        setTheme,
    };
});
