import { Currency } from '@shared/domain/Currency';
import { DatabaseError } from '@shared/errors/AppError';
import { ICurrencyRepository } from '@shared/interfaces/ICurrencyRepository';

import { SqliteDB } from '../connection';

interface CurrencyRow { code: string, symbol: string, name: string }

export class CurrencyRepository implements ICurrencyRepository {
    constructor(private db: SqliteDB) {}

    public async findAll(): Promise<Currency[]> {
        try {
            const statement = this.db.prepare(`
                SELECT code, symbol, name FROM currencies
                ORDER BY name ASC
            `);

            const rows = statement.all() as CurrencyRow[];
            return rows.map(row => new Currency(row.code, row.symbol, row.name));
        }
        catch (error) {
            console.error('Error fetching currencies:', error);
            throw new DatabaseError('Failed to retrieve currencies', error);
        }
    }

    public async findByCode(code: string): Promise<Currency | null> {
        try {
            const statement = this.db.prepare(`
                    SELECT code, symbol, name FROM currencies
                    WHERE code = ?
            `);

            const row = statement.get(code) as CurrencyRow | undefined;

            if (!row) {
                return null;
            }

            return new Currency(row.code, row.symbol, row.name);
        }
        catch (error) {
            console.error('Error fetching currency by code: ', error);
            throw new DatabaseError(`Failed to retrieve currency with code ${code}`, error);
        }
    }
}
