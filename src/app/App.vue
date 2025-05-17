<template>
    <n-config-provider :theme="naiveTheme" :locale="naiveLocale" :date-locale="naiveDateLocale">
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
import { setMessageApi } from '@app/stores/notificationStore';
import { dateEnUS, enUS, useMessage  } from 'naive-ui';
import { computed, h, onMounted } from 'vue';

import MainContent from './MainContent.vue';

const naiveTheme = computed(() => null);
const naiveLocale = computed(() => enUS);
const naiveDateLocale = computed(() => dateEnUS);

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
