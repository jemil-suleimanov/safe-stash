import { User } from '@shared/domain/User';

export type UserData = Omit<User, 'id' | 'createdAt' | 'updatedAt' | 'email' | 'image' | 'theme'> & {
    email?: string | null;
    image?: string | null;
};

export interface IUserRepository {
    findById(_id: string | number | bigint): Promise<User | null>
    findByEmail(_email: string): Promise<User | null>
    findByUsername(_username: string): Promise<User | null>

    create(
        _userData: UserData,
        passwordHash: string,
        passwordHint: string,
    ): Promise<User>
}
