import { AccountTypeCode } from '@shared/types/account';

export class Account {
    constructor(
        public readonly id: number,
        public readonly accountTypeCode: AccountTypeCode,
        public readonly name: string,
        public readonly startBalanceCents: number,
        public readonly isActive: boolean,
        public readonly description: string | null,
        public readonly iconPath: string | null,
        public readonly createdAt: Date,
        public readonly updatedAt: Date,
    ) {}
}
