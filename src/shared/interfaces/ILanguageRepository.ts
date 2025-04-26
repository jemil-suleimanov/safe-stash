import { Language } from '@shared/domain/Language'

export interface ILanguageRepository {
    findAll(): Language[]

    findByCode(_code: string): Language | null
}
