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

        <!--
        <div class="mt-4 p-4 border border-[var(--n-border-color)] rounded-md bg-[var(--n-card-color)] text-[var(--n-text-color-2)]">
            Account list will appear here.
            <div v-if="accountStore.accounts.length > 0">
                <p v-for="acc in accountStore.accounts" :key="acc.id">
                    {{ acc.name }} - {{ acc.startBalanceCents / 100 }}
                </p>
            </div>
            <p v-else>
                No accounts yet. Click "New Account" to add one!
            </p>
        </div>
        -->
    </div>
</template>

  <script setup lang="ts">
import type { CreateAccountPayload } from '@shared/dtos/account.dto';
import { AddOutline as AddIcon } from '@vicons/ionicons5';
import { NButton, NCard,NIcon, NModal } from 'naive-ui';
import { ref } from 'vue';

import AccountForm from '../components/AccountForm.vue';

const showCreateModal = ref(false);

async function handleCreateAccount(payload: CreateAccountPayload) {
    console.log('create');
}
  </script>
