import { Currency } from '@shared/domain/Currency'
import { ICurrencyRepository } from '@shared/interfaces/ICurrencyRepository'

import { SqliteDB } from '../connection'

interface CurrencyRow { code: string, symbol: string, name: string }

export class CurrencyRepository implements ICurrencyRepository {
    constructor(private db: SqliteDB) {}

    findAll(): Currency[] {
        try {
            const statement = this.db.prepare(`
                SELECT code, symbol, name FROM currencies
                ORDER BY name ASC
            `)

            const rows = statement.all() as CurrencyRow[]
            return rows.map(row => new Currency(row.code, row.symbol, row.name))
        }
        catch (error) {
            console.error('Error fetching currencies:', error)
            return []
        }
    }

    findByCode(code: string): Currency | null {
        try {
            const statement = this.db.prepare(`
                    SELECT code, symbol, name FROM currencies
                    WHERE code = ${code}
            `)

            const row = statement.get() as CurrencyRow
            return new Currency(row.code, row.symbol, row.name)
        }
        catch (error) {
            console.error('Error fetching currency by code: ', error)
            return null
        }
    }
}
