import { AccountTypeCode } from '@shared/types/account';
import { defineStore } from 'pinia';
import { ref } from 'vue';

import accountApi from '../api';

export const useAccountStore = defineStore('account', () => {
    const isLoading = ref(false);
    const error = ref<string | null>(null);
    const accountTypes = ref<AccountTypeCode[]>([]);

    function getAccountCodes() {
        if (!accountTypes.value.length) {
            fetchAccountCodes();
        }

        return accountTypes;
    }

    async function fetchAccountCodes() {
        isLoading.value = true;
        error.value = null;

        try {
            const response = await accountApi.getAccountTypes();

            console.log(response, 'response');

            if (response) {
                accountTypes.value = response;
            }

            return accountTypes;
        } catch (err) {
            error.value = 'An error occurred getting account codes.';
            console.error('Retrieving account codes error:', err);
        } finally {
            isLoading.value = false;
        }
    }

    return {
        error,
        isLoading,
        getAccountCodes,
        fetchAccountCodes,
        accountTypes,
    };
});
