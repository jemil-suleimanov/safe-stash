import { sessionStore } from '@electron/store/sessionStore';
import { CreateAccountPayload } from '@shared/dtos/account.dto';
import { AppError, ValidationError } from '@shared/errors/AppError';
import { IAccountRepository } from '@shared/interfaces/IAccountRepository';
import { AccountTypeCode } from '@shared/types/account';

export class AccountService {
    constructor(
        private accountRepo: IAccountRepository,
    ) {}

    public async create(payload: CreateAccountPayload) {
        try {
            const userId = this._getAuthenticatedUserId();

            if (!payload.name || payload.name.trim().length < 1) {
                throw new ValidationError('Account name is required.', null);
            }
            if (!payload.type) {
                throw new ValidationError('Account type is required.', null);
            }

            if (typeof payload.startBalanceCents !== 'number') {
                throw new ValidationError('Initial balance must be a valid number.', null);
            }

            const createdAccount = this.accountRepo.create(userId, payload);

            return createdAccount;
        } catch (error) {
            console.error('Error creating user account: ', error);
            throw new Error('User account creating failed: ' + error);
        }
    }

    public async getAllAccountTypes() {
        try {
            const accountTypes = this.accountRepo.findAllAccountTypes();

            const types = (await accountTypes).map((type) => type.code);

            return types;
        } catch (error) {
            console.error('Error fetching account types: ', error);
            throw new Error('Account types fetching failed: ' + error);
        }
    }

    public async getAccountTypeByCode(code: AccountTypeCode) {;
        try {
            const accountCode = this.accountRepo.findAccountTypeByCode(code);
            return accountCode;
        } catch (error) {
            console.error('Error fetching account type by code;: ', error);
            throw new Error('Account type fetching failed: ' + error);
        }
    }

    public async getAccountById(id: number) {
        try {
            const userId = this._getAuthenticatedUserId();
            const account = this.accountRepo.findById(id, userId);
            return account;
        } catch (error) {
            console.error('Error fetching account types: ', error);
            throw new Error('Account types fetching failed: ' + error);
        }
    }

    public async getAllAccountsForUser() {
        try {
            const userId = this._getAuthenticatedUserId();

            return await this.accountRepo.findAllByUserId(userId);
        } catch (error) {
            console.error('Error fetching user accounts: ', error);
            throw new Error('User accounts fetching failed: ' + error);
        }
    }

    private _getAuthenticatedUserId(): number { // Helper
        const userId = sessionStore.getUserID();
        if (!userId) {
            throw new AppError('User not authenticated.');
        }
        return userId;
    }

}
