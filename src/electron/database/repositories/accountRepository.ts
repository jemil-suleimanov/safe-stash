import { Account } from '@shared/domain/Account';
import { CreateAccountPayload } from '@shared/dtos/account.dto';
import { DatabaseError } from '@shared/errors/AppError';
import { IAccountRepository } from '@shared/interfaces/IAccountRepository';
import { AccountType, AccountTypeCode } from '@shared/types/account';
import { Statement } from 'better-sqlite3';

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
        row.description ?? null,
        row.icon_path ?? null,
        new Date(row.created_at),
        new Date(row.updated_at),
    );
};

export class AccountRepository implements IAccountRepository {
    private db:                          SqliteDB;
    private createAccountStmt:           Statement;
    private findAccountByIdStmt:         Statement;
    private findAllAccountsByUserIdStmt: Statement;
    private findAllAccountTypesStmt:     Statement;
    private findAccountTypeByCodeStmt:   Statement;

    constructor(db: SqliteDB) {
        this.db = db;
        this.createAccountStmt = this.db.prepare(`
            INSERT INTO accounts (
                user_id, name, account_type_code, start_balance_cents, icon_path, description, is_active
            )
            VALUES (
                @userId, @name, @accountTypeCode, @startBalance, @iconPath, @description, 1
            ) RETURNING ID
        `);

        this.findAccountByIdStmt = this.db.prepare(`
            SELECT id, user_id, account_type_code, name, start_balance_cents, is_active, description, created_at, updated_at
            FROM accounts
            WHERE id = ? AND user_id = ?
        `);

        this.findAllAccountsByUserIdStmt = this.db.prepare(`
            SELECT id, user_id, account_type_code, name, start_balance_cents, is_active, description, created_at, updated_at
            FROM accounts
            WHERE user_id = ? ORDER BY name ASC
        `);

        this.findAllAccountTypesStmt = this.db.prepare(`
            SELECT code, name, description FROM account_types ORDER BY name ASC;
        `);

        this.findAccountTypeByCodeStmt = this.db.prepare(`
            SELECT code, name, description
            FROM account_types
            WHERE code = ?
        `);
    }

    public async create(userId: number, accountPayload: CreateAccountPayload): Promise<Account | null> {
        try {
            const result = this.createAccountStmt.run({
                userId,
                name:            accountPayload.name,
                accountTypeCode: accountPayload.type,
                startBalance:    accountPayload.startBalanceCents,
                iconPath:        accountPayload.iconPath ?? null,
                description:     accountPayload.description ?? null,
            });

            if (!result.lastInsertRowid) {
                throw new DatabaseError('Account creation failed, no ID returned.');
            }

            const newAccountId = Number(result.lastInsertRowid);
            const newAccount = await this.findById(newAccountId, userId);

            if (!newAccount) {
                throw new DatabaseError('Account created but could not be retrieved immediately.');
            }
            return newAccount;
        } catch(error) {
            console.error('Error creating account: ', error);
            throw new DatabaseError('Failed to create account', error);
        }
    }

    public async findById(id: number, userId: number): Promise<Account | null> {
        try {
            const result = this.findAccountByIdStmt.get(id,userId) as AccountRow | undefined;

            if (!result) {
                return null;
            }

            return rowToAccount(result);
        } catch (error) {
            console.error('Error fetching account by ID:', error);
            throw new DatabaseError('Failed to retrieve account', error);
        }
    }

    public async findAllByUserId(userId: number): Promise<Account[]> {
        try {
            const result = this.findAllAccountsByUserIdStmt.all(userId) as AccountRow[];
            return result.map(rowToAccount);
        } catch (error) {
            console.error(`Error fetching accounts for user (${userId}):`, error);
            throw new DatabaseError('Failed to retrieve accounts.', error);
        }
    }

    public async findAllAccountTypes(): Promise<AccountType[]> {
        try {
            const result = this.findAllAccountTypesStmt.all() as AccountType[];
            return result.map(row => ({
                code:        row.code,
                name:        row.name,
                description: row.description,
            }));
        } catch (error) {
            console.error('Error fetching account by ID:', error);
            throw new DatabaseError('Failed to retrieve account', error);
        }
    }

    public async findAccountTypeByCode(code: AccountTypeCode): Promise<AccountType | null> {
        try {
            const result = this.findAccountTypeByCodeStmt.get(code) as AccountType | undefined;

            if (!result) {
                return null;
            }

            return {
                code:        result.code,
                name:        result.name,
                description: result.description,
            };
        } catch (error) {
            console.error(`Error fetching account type by code (${code}):`, error);
            throw new DatabaseError('Failed to retrieve account type.', error);
        }
    }
}
