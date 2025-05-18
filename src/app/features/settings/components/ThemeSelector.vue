<template>
    <n-radio-group v-model:value="theme" name="theme-group">
        <n-space>
            <n-radio value="light" label="Light" />
            <n-radio value="dark" label="Dark" />
        </n-space>
    </n-radio-group>
</template>

<script setup lang="ts">
import { useSettingsStore } from '@app/features/settings/store';
import { storeToRefs } from 'pinia';

const { theme } = storeToRefs(useSettingsStore());
</script>
