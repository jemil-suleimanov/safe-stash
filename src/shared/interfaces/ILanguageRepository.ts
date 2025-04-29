import { Language } from '@shared/domain/Language';

export interface ILanguageRepository {
    findAll(): Promise<Language[]>

    findByCode(_code: string): Promise<Language | null>
}
