<template>
    <div class="p-6">
        <div class="flex justify-between items-center mb-6">
            <h1 class="text-2xl font-semibold text-[var(--n-title-text-color)]">
                My Accounts
            </h1>
            <n-button type="primary" size="large" @click="showCreateModal = true">
                <template #icon>
                    <n-icon :component="AddIcon" />
                </template>
                New Account
            </n-button>
        </div>

        <n-modal
            v-model:show="showCreateModal"
            preset="card"
            title="Create New Account"
            class="max-w-lg w-11/12 rounded-lg"
            :mask-closable="false"
        >
            <AccountForm
                mode="create"
                :is-loading="false"
                @submit="handleCreateAccount"
                @cancel="showCreateModal = false"
            />
        </n-modal>

        <div class="mt-4 p-4 border border-[var(--n-border-color)] rounded-md bg-[var(--n-card-color)] text-[var(--n-text-color-2)]">
            Account list will appear here.
            <div v-if="accounts.length > 0">
                <p v-for="acc in accounts" :key="acc.id">
                    {{ acc.name }} - {{ formatCents(acc.startBalanceCents) }}
                </p>
            </div>
            <p v-else>
                No accounts yet. Click "New Account" to add one!
            </p>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useAccountStore } from '@app/features/account/store/useAccountStore';
import { useMoneyFormatter } from '@app/shared/composables/useMoneyFormatter';
import type { CreateAccountPayload } from '@shared/dtos/account.dto';
import { AddOutline as AddIcon } from '@vicons/ionicons5';
import { NButton, NIcon, NModal } from 'naive-ui';
import { storeToRefs } from 'pinia';
import { onMounted, ref } from 'vue';

import AccountForm from '../components/AccountForm.vue';

const showCreateModal = ref(false);

const { accounts } = storeToRefs(useAccountStore());
const { getAccountsList, createAccount } = useAccountStore();
const showMoney = useMoneyFormatter();

onMounted(async () => {
    await getAccountsList();
    console.log(accounts.value);
});

async function handleCreateAccount(payload: CreateAccountPayload) {
    await createAccount(payload);
    showCreateModal.value = false;
}

function formatCents(cents: number | null | undefined) {
    if (cents === null || cents === undefined) {
        return 0;
    } else {
        return showMoney(cents);
    }
}
</script>
