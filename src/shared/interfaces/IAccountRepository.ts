import { Account } from '@shared/domain/Account';
import { CreateAccountPayload } from '@shared/dtos/account.dto';
import { AccountType, AccountTypeCode } from '@shared/types/account';

export interface IAccountRepository {
    create(userId: number, data: CreateAccountPayload): Promise<Account | null>

    findById(id: number, userId: number): Promise<Account | null>
    findAllByUserId(userId: number): Promise<Account[]>

    findAllAccountTypes(): Promise<AccountType[]>
    findAccountTypeByCode(code: AccountTypeCode): Promise<AccountType | null>
}
