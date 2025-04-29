import type { IDbApi } from '../shared/types';

declare global {
    interface Window { dbApi: IDbApi; }
}

export {};
