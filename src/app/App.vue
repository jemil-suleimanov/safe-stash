<template>
    <div>
        <h1>Welcome to Safe Stash!</h1>

        <p>Testing Naive UI integration:</p>
        <n-space justify="center">
            <n-button type="primary">
                Click Me!
            </n-button>
            <n-button type="info">
                <template #icon>
                    <n-icon> <information-circle-outline /> </n-icon>
                </template>
                Info
            </n-button>
        </n-space>
        <n-divider />
        <p>Icon Example:</p>
        <n-icon
            size="40"
            color="#4CAF50"
        >
            <cash-outline />
        </n-icon>
    </div>
</template>

<script setup lang="ts">

import { CashOutline, InformationCircleOutline } from '@vicons/ionicons5';
import { NButton, NDivider, NIcon, NSpace } from 'naive-ui';



</script>

<style scoped>
div { padding: 20px; text-align: center; }
</style>