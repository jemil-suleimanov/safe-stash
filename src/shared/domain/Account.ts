export class Account {
    constructor(
        public readonly id: number,
        public readonly accountTypeCode: string,
        public readonly name: string,
        public readonly balance: number,
        public readonly isActive: boolean,
        public readonly createdAt: Date,
        public readonly updatedAt: Date,
        public readonly description?: string,
        public readonly icon?: string,
    ) {}
}
