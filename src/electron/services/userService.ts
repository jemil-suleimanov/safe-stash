import { User } from '@shared/domain/User';
import { UserPayloadData } from '@shared/dtos/auth.dto';
import { ValidationError } from '@shared/errors/AppError';
import { IUserRepository } from '@shared/interfaces/IUserRepository';
import bcrypt from 'bcryptjs';

import { AppSettingsService } from './appSettingsService';

const SALT_ROUNDS = 10;

export class UserService {
    constructor(
        private userRepository: IUserRepository,
        private appSettingsService: AppSettingsService,
    ) {}

    public async registerUser(registrationData: UserPayloadData): Promise<User> {
        try {

            if (!registrationData.username || registrationData.username.length < 3) {
                throw new ValidationError('Username must be at least 3 characters long.', null);
            }
            if (!registrationData.password || registrationData.password.length < 6) {
                throw new ValidationError('Password must be at least 6 characters long.', null);
            }

            if (!['light', 'dark'].includes(registrationData.theme)) {
                throw new ValidationError('Theme must be \'light\' or \'dark\'.', null);
            }

            const existingUser = await this.userRepository.findByUsername(registrationData.username);
            if (existingUser) {
                throw new ValidationError('Username already exists.', null);
            }

            if (registrationData.email) {
                const existingEmail = await this.userRepository.findByEmail(registrationData.email);
                if (existingEmail) {
                    throw new ValidationError('Email already exists.', null);
                }
            }

            const passwordHash = await bcrypt.hash(registrationData.password, SALT_ROUNDS);

            const user = await this.userRepository.create(
                registrationData,
                passwordHash,
                registrationData.passwordHint,
            );
            return user;
        } catch (error) {
            console.error('Error during registration:', error);
            throw new Error('Registration failed: ' + error);
        }
    }
}
