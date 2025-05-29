import { sessionStore } from '@electron/store/sessionStore';
import { Account } from '@shared/domain/Account';
import { CreateAccountPayload } from '@shared/dtos/account.dto';
import { DatabaseError } from '@shared/errors/AppError';
import { IAccountRepository } from '@shared/interfaces/IAccountRepository';
import { AccountType, AccountTypeCode } from '@shared/types/account';

import { SqliteDB } from '../connection';

interface AccountRow {
    id:                  number;
    user_id:             string;
    icon_path?:          string;
    account_type_code:   AccountTypeCode;
    name:                string;
    start_balance_cents: number;
    is_active:           boolean;
    created_at:          string;
    updated_at:          string;
    description?:        string;
}

const rowToAccount = (row: AccountRow): Account => {
    return new Account(
        row.id,
        row.account_type_code,
        row.name,
        row.start_balance_cents,
        row.is_active,
        new Date(row.created_at),
        new Date(row.updated_at),
        row.description,
    );
};

export class AccountRepository implements IAccountRepository {
    constructor(private db: SqliteDB) {
    }

    public async create(accountPayload: CreateAccountPayload): Promise<Account | null> {
        try {
            const userId = sessionStore.getUserID();

            if (!userId) {
                throw new DatabaseError('User is not logged in');
            }

            const stmt = this.db.prepare(`
                INSERT INTO accounts (
                    user_id, icon_path, account_type_code, name, start_balance_cents, description
                )
                VALUES (
                    @userId, @icon, @type, @name, @balance, @description
                ) RETURNING ID
            `);

            const accountData = {
                userId,
                ...accountPayload,
            };

            const result = stmt.run(accountData);

            if (result.changes === 0 || !result.lastInsertRowid) {
                throw new DatabaseError('Error while creating account');
            }

            const newAccountId = Number(result.lastInsertRowid);
            const newAccount = await this.findById(newAccountId);

            if (!newAccount) {
                throw new DatabaseError('Account created but could not be retrieved immediately.');
            }

            return newAccount;
        } catch(error) {
            console.error('Error creating user by ID:', error);
            throw new DatabaseError('Failed to create account', error);
        }
    }

    public async findById(id: number): Promise<Account | null> {
        try {
            const stmt = this.db.prepare(`
                SELECT id, account_type_code, name, start_balance_cents, is_active, description, created_at, updated_at, user_id
                FROM accounts
                WHERE ID = ?
            `);

            const account = stmt.get(id) as AccountRow | undefined;

            if (!account) {
                return null;
            }

            return rowToAccount(account);
        } catch (error) {
            console.error('Error fetching account by ID:', error);
            throw new DatabaseError('Failed to retrieve account', error);
        }
    }

    public async findAllType(): Promise<AccountType[]> {
        try {
            const stmt = this.db.prepare('SELECT code, name, description FROM account_types');
            const accountTypes = stmt.all() as AccountType[];
            return accountTypes;
        } catch (error) {
            console.error('Error fetching account by ID:', error);
            throw new DatabaseError('Failed to retrieve account', error);
        }
    }
}
