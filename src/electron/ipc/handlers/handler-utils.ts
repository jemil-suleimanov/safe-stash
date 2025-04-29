import { AppError } from '@shared/errors/AppError';
import { DbApiResponse } from '@shared/types';

export async function handleServiceCall<T>(
    serviceCall: () => Promise<T>,
): Promise<DbApiResponse<T>> {
    try {
        const data = await serviceCall();
        return { success: true, data };
    } catch (error) {
        console.error('IPC Handler Error: ', error);

        if (error instanceof AppError) {
            return {
                success: false,
                error:   {
                    message: error.message,
                    code:    error.statusCode,
                    name:    error.name,
                },
            };
        }

        const message = error instanceof Error ? error.message : 'An unknown error occurred on the server';
        return {
            success: false,
            error:   {
                message,
                code: 500,
                name: error instanceof Error ? error.name : 'Error',
            },
        };
    }
}
