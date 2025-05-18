import { Currency } from './Currency';
import { Language } from './Language';

export class User {
    constructor(
        public readonly id: string | number,
        public readonly username: string,
        public readonly firstName: string,
        public readonly lastName: string,
        public readonly email: string | null,
        public readonly image: string | null,
        public readonly language: Language['code'],
        public readonly currency: Currency['code'],
        public readonly theme: string,
        public readonly createdAt: string,
        public readonly updatedAt: string,
    ) {}
}
