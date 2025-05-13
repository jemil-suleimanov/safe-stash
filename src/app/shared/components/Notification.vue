<template>
    <div class="notification-container">
        <transition-group name="slide-fade">
            <NAlert
                v-for="notification in notifications"
                :key="notification.id"
                :type="notification.type"
                closable
                @close="removeNotification(notification.id)"
            >
                {{ notification.message }}
            </NAlert>
        </transition-group>
    </div>
</template>

<script setup lang="ts">
import { useNotificationStore } from '@app/stores/notificationStore';
import { NAlert } from 'naive-ui';
import { storeToRefs } from 'pinia';

const { notifications } = storeToRefs(useNotificationStore());
const { removeNotification } = useNotificationStore();
</script>
