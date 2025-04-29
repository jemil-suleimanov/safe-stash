import { Currency } from './domain/Currency';
import { Language } from './domain/Language';

export interface AppSetupData {
    availableCurrencies: Currency[]
    availableLanguages:  Language[]
}

export interface IDbApi {
    getAvailableSettings: () => Promise<DbApiResponse<AppSetupData>>;
}

export interface DbApiResponse<T> {
    success: boolean
    data?:   T
    error?:  { message: string, code?: number, name?: string }
}
