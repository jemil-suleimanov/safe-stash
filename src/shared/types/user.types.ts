import { User } from '@shared/domain/User';

export type UserDataForCreation = Omit<User, 'id' | 'createdAt' | 'updatedAt' | 'theme'>;
