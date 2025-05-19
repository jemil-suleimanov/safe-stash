import { UserRow } from '@electron/database/repositories/userRepository';
import { User } from '@shared/domain/User';
import { UserDataForCreation } from '@shared/types/user.types';

export interface IUserRepository {
    findById(_id: string | number | bigint): Promise<User | null>
    findByEmail(_email: string): Promise<User | null>
    findByUsername(_username: string): Promise<User | null>

    findUserRowByUsername(_username: string): Promise<UserRow | null>

    create(
        _userData: UserDataForCreation,
        passwordHash: string,
        passwordHint: string,
    ): Promise<User>
}
