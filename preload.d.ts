import type { IDbApi } from './src/shared/types';

declare global {
    interface Window { dbApi: IDbApi; }
}

export {};
