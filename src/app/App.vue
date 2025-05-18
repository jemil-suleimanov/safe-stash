<template>
    <n-config-provider
        :theme="naiveTheme"
        :locale="naiveLocale"
        :date-locale="naiveDateLocale"
        class="h-screen"
    >
        <n-message-provider>
            <n-dialog-provider>
                <n-notification-provider>
                    <AppContent />
                </n-notification-provider>
            </n-dialog-provider>
        </n-message-provider>
    </n-config-provider>
</template>

<script setup lang="ts">
import { useSettingsStore } from '@app/features/settings';
import { setMessageApi } from '@app/stores/notificationStore';
import { darkTheme, dateEnUS, enUS, lightTheme, useMessage } from 'naive-ui';
import { storeToRefs } from 'pinia';
import { computed, h, onMounted, ref, watch } from 'vue';

import MainContent from './MainContent.vue';

const { theme } = storeToRefs(useSettingsStore());

const naiveLocale = computed(() => enUS);
const naiveDateLocale = computed(() => dateEnUS);
const naiveTheme = ref(lightTheme);

watch(
    theme,
    (newTheme) => {
        console.log('Theme changed:', newTheme);
        if (newTheme === 'dark') {
            naiveTheme.value = darkTheme;
        } else {
            naiveTheme.value = lightTheme;
        }
    },
    { immediate: true },
);

const AppContent = {
    setup() {
        const message = useMessage();
        onMounted(() => {
            setMessageApi(message);
            console.log('Naive UI Message API installed globally.');
        });
        return () => h(MainContent);
    },
};
</script>
