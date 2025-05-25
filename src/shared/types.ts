import { Currency } from './domain/Currency';
import { Language } from './domain/Language';
import { User } from './domain/User';
import { UserCreatePayload, UserLoginPayload } from './dtos/auth.dto';

export interface AppSetupData {
    availableCurrencies: Currency[]
    availableLanguages:  Language[]
}

export interface IDbApi {
    getAvailableSettings(): Promise<DbApiResponse<AppSetupData>>;
    register(userData: UserCreatePayload): Promise<DbApiResponse<User>>;
    login(userLoginData: UserLoginPayload): Promise<DbApiResponse<User>>;
}

export interface DbApiResponse<T> {
    success: boolean
    data?:   T
    error?:  { message: string, code?: number, name?: string }
}

type ExtractDataFromResponse<T> = T extends DbApiResponse<infer U> ? U : T;

export type ExtractApiMethodData<F extends (...args: any[]) => Promise<DbApiResponse<any>>> =
    ExtractDataFromResponse<Awaited<ReturnType<F>>>;
