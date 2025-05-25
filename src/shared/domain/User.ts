import { Currency } from './Currency';
import { Language } from './Language';

export type Email = string | null;

export class User {
    constructor(
        public readonly id: number,
        public readonly username: string,
        public readonly firstName: string | null,
        public readonly lastName: string | null,
        public readonly languageCode: Language['code'],
        public readonly currencyCode: Currency['code'],
        public readonly theme: 'light' | 'dark',
        public readonly createdAt: Date,
        public readonly updatedAt: Date,
        public readonly email?: Email,
        public readonly image?: string | null,
    ) {}
}
