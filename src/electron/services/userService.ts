import { rowToUser } from '@electron/database/repositories/userRepository';
import { sessionStore } from '@electron/store/sessionStore';
import { User } from '@shared/domain/User';
import { UserCreatePayload, UserLoginPayload } from '@shared/dtos/auth.dto';
import { ValidationError } from '@shared/errors/AppError';
import { IUserRepository } from '@shared/interfaces/IUserRepository';
import bcrypt from 'bcryptjs';

const SALT_ROUNDS = 10;

export class UserService {
    constructor(
        private userRepository: IUserRepository,
    ) {}

    public async registerUser(registrationData: UserCreatePayload): Promise<User> {
        try {

            if (!registrationData.username || registrationData.username.length < 3) {
                throw new ValidationError('Username must be at least 3 characters long.', null);
            }
            if (!registrationData.password || registrationData.password.length < 6) {
                throw new ValidationError('Password must be at least 6 characters long.', null);
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

            const passwordHash = await this.encryptPassword(registrationData.password);

            const user = await this.userRepository.create(
                registrationData,
                passwordHash,
                registrationData.passwordHint,
            );
            return user;
        } catch (error) {
            console.error('Error during registration: ', error);
            throw new Error('Registration failed: ' + error);
        }
    }

    public async login(loginData: UserLoginPayload): Promise<User | null> {
        try {
            // validation
            const { username, password } = loginData;
            if (!username || username === '' || !password || password === '') {
                throw new ValidationError('Incorrect username or password provided', null);
            }

            const user = await this.userRepository.findUserRowByUsername(username);

            if (!user) {
                throw new ValidationError('Invalid username or password.', null);
            }

            const passwordMatch = await bcrypt.compare(password, user.password_hash);

            if (!passwordMatch) {
                throw new ValidationError('Invalid username or password.', null);
            }

            sessionStore.setUserID(user.id);
            return rowToUser(user);
        } catch (error) {
            console.error('Error during login: ', error);
            throw new Error('Login failed: ' + error);
        }
    }

    private async encryptPassword(password: string): Promise<string> {
        const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
        return passwordHash;
    }
}
