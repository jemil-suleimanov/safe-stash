import { IAccountRepository } from '@shared/interfaces/IAccountRepository';

export class AccountService {
    constructor(
        private accountRepo: IAccountRepository,
    ) {}

    public async getAllAccountTypes() {
        try {
            const accountTypes = this.accountRepo.findAllType();

            const types = (await accountTypes).map((type) => type.code);

            return types;
        } catch (error) {
            console.error('Error fetching account types: ', error);
            throw new Error('Account types fetching failed: ' + error);
        }
    }
}
