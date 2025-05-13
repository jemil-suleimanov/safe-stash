import { defineStore } from 'pinia';
import { ref } from 'vue';


export type NotificationType = 'success' | 'info' | 'warning' | 'error';

export interface AppNotification {
    id:        number;
    type:      NotificationType;
    message:   string;
    duration?: number;
}

export const useNotificationStore = defineStore('notifications', () => {
    const notifications = ref<AppNotification[]>([]);
    const nextId = 0;

    function addNotification(type: NotificationType, message: string, duration = 500) {
        const id = nextId + 1;
        const newNotification: AppNotification = { id, type, message, duration };
        notifications.value.push(newNotification);

        if (duration > 0) {
            setTimeout(() => {
                removeNotification(id);
            }, duration);
        }
    }

    function removeNotification(id: number) {
        notifications.value = notifications.value.filter(n => n.id !== id);
    }

    function success(message: string, duration?: number) {
        addNotification('success', message, duration);
    }

    function error(message: string, duration?: number) {
        addNotification('error', message, duration);
    }

    function info(message: string, duration?: number) {
        addNotification('info', message, duration);
    }

    function warning(message: string, duration?: number) {
        addNotification('warning', message, duration);
    }

    return {
        notifications,
        addNotification,
        removeNotification,
        success,
        error,
        info,
        warning,
    };
});
