<template>
    <n-select
        v-model:value="selectedLanguage"
        placeholder="Choose language"
        :options="languageOptions"
        filterable
    />
</template>

<script setup lang="ts">
import { useSettingsStore } from '@app/features/settings/store';
import { storeToRefs } from 'pinia';
import { computed, onMounted, ref } from 'vue';

const { languages } = storeToRefs(useSettingsStore());

const { getLanguages } = useSettingsStore();

const selectedLanguage = ref<string>('');

const languageOptions = computed(() => {
    return languages.value.map(language => {
        return {
            value: language.code,
            label: `${language.name} ${language.icon}`,
        };
    });
});

onMounted(() => {
    getLanguages();
});
</script>
