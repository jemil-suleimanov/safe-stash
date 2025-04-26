import { ILanguageRepository } from '@shared/interfaces/ILanguageRepository'

import { SqliteDB } from '../connection'
import { Language } from '@shared/domain/Language'

interface LanguageRow {
    code: string
    icon: string
    name: string
}

export class LanguageRepository implements ILanguageRepository {
    constructor(private db: SqliteDB) {}

    findAll(): Language[] {
        try {
            const statement = this.db.prepare(`
                SELECT code, icon, name FROM languages
                ORDER BY name ASC
            `)

            const rows = statement.all() as LanguageRow[]
            return rows.map(row => new Language(row.code, row.icon, row.name))
        } catch (error) {
            console.error('Error fetching languages:', error)
            return []
        }
    }

    findByCode(code: string): Language | null {
        try {
            const statement = this.db.prepare(`
                SELECT code, icon, name FROM languages
                WHERE code = ${code}
            `)
            const row = statement.get() as LanguageRow
            return new Language(row.code, row.icon, row.name)
        } catch (error) {
            console.error('Error fetching language by code: ', error)
            return null
        }
    }
}
