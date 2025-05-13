import { MessageApiInjection } from 'naive-ui/es/message/src/MessageProvider';
import { defineStore } from 'pinia';

let globalMessageApi: MessageApiInjection | null = null;

export function setMessageApi(messageApi: MessageApiInjection) {
    globalMessageApi = messageApi;
};

export type NotificationType = 'success' | 'info' | 'warning' | 'error';

export interface AppNotification {
    id:        number;
    type:      NotificationType;
    message:   string;
    duration?: number;
}

export const useNotificationStore = defineStore('notifications', () => {
    function showMessage(
        type: NotificationType,
        messageContent: string,
        duration = 5000,
    ): void {
        if (!globalMessageApi) {
            console.warn('Naive UI Message API not installed globally. Cannot show message:', type, messageContent);
            if (type === 'error') {
                console.error(`Notification (fallback): ${messageContent}`);
            } else {
                console.log(`Notification (fallback - ${type}): ${messageContent}`);
            }
            return;
        }

        switch (type) {
            case 'success':
                globalMessageApi.success(messageContent, { duration, closable: true });
                break;
            case 'info':
                globalMessageApi.info(messageContent, { duration, closable: true });
                break;
            case 'warning':
                globalMessageApi.warning(messageContent, { duration, closable: true });
                break;
            case 'error':
                // Errors often deserve longer default duration or no auto-dismiss
                globalMessageApi.error(messageContent, { duration: duration > 0 ? duration : undefined, closable: true, keepAliveOnHover: true });
                break;
            default:
                globalMessageApi.info(messageContent, { duration, closable: true });
        }

    }


    function success(message: string, duration?: number) {
        showMessage('success', message, duration);
    }

    function error(message: string, duration = 20000) {
        showMessage('error', message, duration);
    }

    function info(message: string, duration?: number) {
        showMessage('info', message, duration);
    }

    function warning(message: string, duration?: number) {
        showMessage('warning', message, duration);
    }

    return {
        success,
        error,
        info,
        warning,
    };
});
