import { CreateAccountPayload } from '@shared/dtos/account.dto';
import { AccountTypeCode } from '@shared/types/account';
import { defineStore } from 'pinia';
import { ref } from 'vue';

import accountApi from '../api';

export const useAccountStore = defineStore('account', () => {
    const isLoading = ref(false);
    const error = ref<string | null>(null);
    const accountTypes = ref<AccountTypeCode[]>([]);
    const accounts = ref<any[]>([]);

    function getAccountCodes() {
        if (!accountTypes.value.length) {
            fetchAccountCodes();
        }

        return accountTypes;
    }

    async function getAccountsList() {
        if (!accounts.value.length) {
            fetchAccountsList();
        }

        return accounts;
    }

    async function fetchAccountCodes() {
        isLoading.value = true;
        error.value = null;

        try {
            const response = await accountApi.getAccountTypes();

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

    async function fetchAccountsList() {
        isLoading.value = true;
        error.value = null;

        try {
            const response = await accountApi.getAccountsList();

            if (response) {
                accounts.value = response;
            }

            return accounts;
        } catch(err) {
            error.value = 'An error occurred getting accounts list.';
            console.error('Retrieving accounts lists error: ', err);
        } finally {
            isLoading.value = false;
        }
    }

    async function createAccount(accountPayload: CreateAccountPayload) {
        isLoading.value = true;

        accountApi.createAccount(accountPayload)
            .then(() => {
                // refetch accounts list
                fetchAccountsList();
            })
            .catch((error) => {
                error.value = 'An error occurred while creating account';
                console.error('Retrieving accounts lists error: ', error);
            })
            .finally(() => {
                isLoading.value = false;
            });
    }

    return {
        error,
        isLoading,
        getAccountCodes,
        getAccountsList,
        fetchAccountCodes,
        createAccount,
        accountTypes,
        accounts,
    };
});
