import { Currency } from './domain/Currency';
import { Language } from './domain/Language';

export interface AppSetupData {
    availableCurrencies: Currency[]
    availableLanguages:  Language[]
}

export interface DummyResponseData {
    message: string;
}

export interface IDbApi {
    getAvailableSettings(): Promise<DbApiResponse<AppSetupData>>;
    getUser(someArg: number): Promise<DbApiResponse<DummyResponseData>>;
    getById(id: string): Promise<DbApiResponse<string>>;
}

export interface DbApiResponse<T> {
    success: boolean
    data?:   T
    error?:  { message: string, code?: number, name?: string }
}

type ExtractDataFromResponse<T> = T extends DbApiResponse<infer U> ? U : T;

export type ExtractApiMethodData<F extends (...args: any[]) => Promise<DbApiResponse<any>>> =
    ExtractDataFromResponse<Awaited<ReturnType<F>>>;
