<template>
    <n-select
        v-model="currentLocale"
        placeholder="Choose language"
        :options="languageOptions"
        filterable
        @update:value="onChange"
    />
</template>

<script setup lang="ts">
import { useSettingsStore } from '@app/features/settings/store';
import { i18n, SupportedLocales } from '@app/shared/plugins/i18n';
import { storeToRefs } from 'pinia';
import { computed, onMounted, ref } from 'vue';

const { languages } = storeToRefs(useSettingsStore());

const { getLanguages, setLanguage } = useSettingsStore();

const currentLocale = ref(i18n.global.locale);

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

function onChange(value: SupportedLocales) {
    setLanguage(value);
}
</script>
