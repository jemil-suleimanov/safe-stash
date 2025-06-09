import { Account } from './domain/Account';
import { Currency } from './domain/Currency';
import { Language } from './domain/Language';
import { User } from './domain/User';
import { CreateAccountPayload } from './dtos/account.dto';
import { UserCreatePayload, UserLoginPayload } from './dtos/auth.dto';
import { AccountType, AccountTypeCode } from './types/account';

export interface AppSetupData {
    availableCurrencies: Currency[]
    availableLanguages:  Language[]
}

export interface IDbApi {
    getAvailableSettings(): Promise<DbApiResponse<AppSetupData>>;
    register(userData: UserCreatePayload): Promise<DbApiResponse<User>>;
    login(userLoginData: UserLoginPayload): Promise<DbApiResponse<User>>;
    getAccountTypes(): Promise<DbApiResponse<AccountTypeCode[]>>;
    getAccountTypeByCode(code: AccountTypeCode): Promise<DbApiResponse<AccountType>>;
    createAccount(payload: CreateAccountPayload): Promise<DbApiResponse<Account>>;
    getAccountById(accountId: number): Promise<DbApiResponse<Account>>;
    getAllAccountsForUser(): Promise<DbApiResponse<Account[]>>;
    authGetInitialSession(): Promise<DbApiResponse<User | null>>;
}

export interface DbApiResponse<T> {
    success: boolean
    data?:   T
    error?:  { message: string, code?: number, name?: string }
}

type ExtractDataFromResponse<T> = T extends DbApiResponse<infer U> ? U : T;

export type ExtractApiMethodData<F extends (...args: any[]) => Promise<DbApiResponse<any>>> =
    ExtractDataFromResponse<Awaited<ReturnType<F>>>;
