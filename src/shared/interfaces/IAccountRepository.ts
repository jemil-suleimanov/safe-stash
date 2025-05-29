import { Account } from '@shared/domain/Account';
import { CreateAccountPayload } from '@shared/dtos/account.dto';
import { AccountType } from '@shared/types/account';

export interface IAccountRepository {
    create(account: CreateAccountPayload): Promise<Account | null>
    findById(id: number): Promise<Account | null>
    findAllType(): Promise<AccountType[]>
}
