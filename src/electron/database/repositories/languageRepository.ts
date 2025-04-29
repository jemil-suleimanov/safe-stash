import { Language } from '@shared/domain/Language';
import { DatabaseError } from '@shared/errors/AppError';
import { ILanguageRepository } from '@shared/interfaces/ILanguageRepository';

import { SqliteDB } from '../connection';

interface LanguageRow {
    code: string
    icon: string
    name: string
}

export class LanguageRepository implements ILanguageRepository {
    constructor(private db: SqliteDB) {}

    public async findAll(): Promise<Language[]> {
        try {
            const statement = this.db.prepare(`
                SELECT code, icon, name FROM languages
                ORDER BY name ASC
            `);

            const rows = statement.all() as LanguageRow[];
            return rows.map(row => new Language(row.code, row.icon, row.name));
        } catch (error) {
            console.error('Error fetching languages:', error);
            throw new DatabaseError('Failed to retrieve languages', error);
        }
    }

    public async findByCode(code: string): Promise<Language | null> {
        try {
            const statement = this.db.prepare(`
                SELECT code, icon, name FROM languages
                WHERE code = ?
            `);
            const row = statement.get(code) as LanguageRow | undefined;

            if (!row) {
                return null;
            }

            return new Language(row.code, row.icon, row.name);
        } catch (error) {
            console.error('Error fetching language by code: ', error);
            throw new DatabaseError(`Failed to retrieve language with code ${code}`, error);
        }
    }
}
