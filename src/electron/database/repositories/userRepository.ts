import { User } from '@shared/domain/User';
import { DatabaseError } from '@shared/errors/AppError';
import { IUserRepository } from '@shared/interfaces/IUserRepository';
import { UserDataForCreation } from '@shared/types/user.types';
import { Statement } from 'better-sqlite3';

import { SqliteDB } from '../connection';

export interface UserRow {
    id:            number;
    username:      string;
    first_name:    string | null;
    last_name:     string | null;
    email:         string | null;
    password_hash: string;
    password_hint: string | null;
    image:         string | null;
    currency_code: string;
    language_code: string;
    theme:         'light' | 'dark';
    created_at:    string;
    updated_at:    string;
}

export function rowToUser(row: UserRow) {
    return new User(
        row.id,
        row.username,
        row.first_name,
        row.last_name,
        row.email,
        row.image,
        row.language_code,
        row.currency_code,
        row.theme,
        new Date(row.created_at),
        new Date(row.updated_at),
    );
}

export class UserRepository implements IUserRepository {
    private db:                 SqliteDB;
    private findByIdStmt:       Statement;
    private findByUsernameStmt: Statement;
    private findByEmailStmt:    Statement;
    private createUserStmt:     Statement;

    constructor(db: SqliteDB) {
        this.db = db;
        this.findByIdStmt = this.db.prepare(`
            SELECT id, username, first_name, last_name, email, password_hash, password_hint, image, language_code, currency_code, theme, created_at, updated_at
            FROM users
            WHERE id = ?
        `);
        this.findByUsernameStmt = this.db.prepare(`
            SELECT id, username, first_name, last_name, email, password_hash, password_hint, image, language_code, currency_code, theme, created_at, updated_at
            FROM users
            WHERE username = ?
        `);
        this.findByEmailStmt = this.db.prepare(`
            SELECT id, username, first_name, last_name, email, password_hash, password_hint, image, language_code, currency_code, theme, created_at, updated_at
            FROM users
            WHERE email = ?
        `);
        this.createUserStmt = this.db.prepare(`
            INSERT INTO users (
                username, first_name, last_name, email, password_hash, password_hint,
                image, language_code, currency_code, theme
            ) VALUES (
                @username, @firstName, @lastName, @email, @passwordHash, @passwordHint,
                @image, @languageCode, @currencyCode, @theme
            ) RETURNING id;
        `);
    }

    public async findById(id: number | bigint): Promise<User | null> {
        try {
            const row = this.findByIdStmt.get(id) as UserRow | undefined;

            if (!row) {
                return null;
            }

            return rowToUser(row);
        } catch (error) {
            console.error('Error fetching user by ID:', error);
            throw new DatabaseError('Failed to retrieve user', error);
        }
    }

    public async findByEmail(email: string): Promise<User | null> {
        try {
            const row = this.findByEmailStmt.get(email) as UserRow | undefined;

            if (!row) {
                return null;
            }

            return rowToUser(row);
        } catch (error) {
            console.error('Error fetching user by email:', error);
            throw new DatabaseError('Failed to retrieve user', error);
        }
    }

    public async findByUsername(username: string): Promise<User | null> {
        try {
            const row = this.findByUsernameStmt.get(username) as UserRow | undefined;

            if (!row) {
                return null;
            }

            return rowToUser(row);
        } catch (error) {
            console.error('Error fetching user by username:', error);
            throw new DatabaseError('Failed to retrieve user', error);
        }
    }

    public async findUserRowByUsername(username: string): Promise<UserRow | null> {
        const row = this.findByUsernameStmt.get(username) as UserRow | undefined;

        return row || null;
    }

    public async create(
        userData: UserDataForCreation,
        passwordHash: string,
        passwordHint: string,
    ): Promise<User> {
        try {
            const result = this.createUserStmt.run({
                username:     userData.username,
                firstName:    userData.firstName,
                lastName:     userData.lastName,
                email:        userData.email ?? null,
                passwordHash,
                passwordHint,
                image:        userData.image ?? null,
                languageCode: userData.languageCode,
                currencyCode: userData.currencyCode,
                theme:        'light', // Default theme for now
            });

            if (result.changes === 0 || !result.lastInsertRowid) {
                throw new DatabaseError('User creation failed, no rows inserted or ID not returned.');
            }

            const newUserId = Number(result.lastInsertRowid);
            const newUser = await this.findById(newUserId);
            if (!newUser) {
                throw new DatabaseError('User created but could not be retrieved immediately.');
            }
            return newUser;
        } catch (error) {
            console.error('Error creating user:', error);
            throw new DatabaseError('Failed to create user', error);
        }
    }
}
