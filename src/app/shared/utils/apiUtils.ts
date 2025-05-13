import { useNotificationStore } from '@app/stores/notificationStore';
import { DbApiResponse } from '@shared/types';

export function handleApiResponse<T>(response: DbApiResponse<T>): T | null {
    if (response.success) {
        return response.data ? response.data : null;
    } else {
        const notificationStore = useNotificationStore();
        const errorMessage = response.error?.message || 'An unknown backend error occurred.';

        notificationStore.error(errorMessage);

        throw new Error(errorMessage);
    }
}

export function handleApiError(err: unknown, context: string = 'API call') {
    const notificationStore = useNotificationStore();
    let displayMessage: string;

    console.error(`Error during ${context}:`, err);

    if (err instanceof Error) {
        displayMessage = err.message; // Use the error's own message
    } else {
        displayMessage = `An unexpected error occurred during ${context}.`;
    }

    if (!notificationStore.notifications.some(n => n.message === displayMessage && n.type === 'error')) {
        notificationStore.error(displayMessage);
    }

    if (err instanceof Error) {
        throw err;
    } else {
        throw new Error(displayMessage);
    }
}
