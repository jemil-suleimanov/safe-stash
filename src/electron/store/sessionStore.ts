import type { User } from '@shared/domain/User'; // Assuming User domain object
import Store from 'electron-store';

interface RememberedSession {
    userId:            number;
    userObject?:       Omit<User, 'passwordHash'>; // Store some user details for quick UI update
    rememberMeEnabled: boolean;
}

// Schema for electron-store to provide some type safety if desired
const schema = {
    rememberedSession: {
        type:       'object',
        properties: {
            userId:            { type: ['number', 'null'] },
            userObject:        { type: ['object', 'null'] },
            rememberMeEnabled: { type: 'boolean' },
        },
        default: {
            userId:            null,
            userObject:        null,
            rememberMeEnabled: false,
        },
    },
} as const; // Use 'as const' for stricter schema typing if you expand it


class PersistentSessionManager {
    private store:             Store<typeof schema>;
    private currentUserId:     number | null = null;
    private currentUserObject: Omit<User, 'passwordHash'> | null = null;

    constructor() {
        this.store = new Store({ schema, name: 'user_session_data' });
        this._loadSessionFromStore();
    }

    private _loadSessionFromStore(): void {
        const session = this.store.get('rememberedSession');
        if (session && session.userId && session.rememberMeEnabled) {
            this.currentUserId = session.userId;
            this.currentUserObject = session.userObject || null;
            console.log(`PersistentSessionManager: Loaded remembered session for userId: ${this.currentUserId}`);
        } else {
            console.log('PersistentSessionManager: No remembered session found or rememberMe not enabled.');
        }
    }

    public setAuthenticatedUser(user: User, rememberMe: boolean): void {
        this.currentUserId = user.id;
        this.currentUserObject = { ...user }; // Store a copy

        if (rememberMe) {
            this.store.set('rememberedSession', {
                userId:            user.id,
                userObject:        { ...user }, // Store a copy of the user object (no hash)
                rememberMeEnabled: true,
            });
            console.log(`PersistentSessionManager: Session for userId ${user.id} saved with rememberMe.`);
        } else {
            // If not "remember me", ensure any previously stored session is cleared
            this.store.set('rememberedSession', {
                userId:            null,
                userObject:        null,
                rememberMeEnabled: false,
            });
            console.log(`PersistentSessionManager: Session for userId ${user.id} set without rememberMe (cleared persistent).`);
        }
    }

    public getUserID(): number | null {
        return this.currentUserId;
    }

    public getRememberedUser(): Omit<User, 'passwordHash'> | null {
        // If only currentUserId is set (not from persistent store initially), return null or fetch
        if (this.currentUserId && this.currentUserObject) {
            return this.currentUserObject;
        }
        // Check persistent store again if needed (though _loadSessionFromStore does it on init)
        const session = this.store.get('rememberedSession');
        if (session && session.userId && session.rememberMeEnabled) {
            return session.userObject || null;
        }
        return null;
    }

    public clearSession(): void {
        this.currentUserId = null;
        this.currentUserObject = null;
        this.store.set('rememberedSession', {
            userId:            null,
            userObject:        null,
            rememberMeEnabled: false,
        });
        console.log('PersistentSessionManager: Session cleared.');
    }

    public isAuthenticated(): boolean {
        return this.currentUserId !== null;
    }

    public wasRememberMeEnabled(): boolean {
        const session = this.store.get('rememberedSession');
        return session?.rememberMeEnabled || false;
    }
}

// Singleton instance
export const persistentSessionManager = new PersistentSessionManager();
