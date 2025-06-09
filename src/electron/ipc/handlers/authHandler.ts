import { UserService } from '@electron/services/userService';
import { persistentSessionManager } from '@electron/store/sessionStore';
import { User } from '@shared/domain/User';
import { UserCreatePayload, UserLoginPayload } from '@shared/dtos/auth.dto';
import { IPC_CHANNELS } from '@shared/ipc-channels';
import { ipcMain } from 'electron';

import { handleServiceCall } from './handler-utils';

export function registerAuthHandlers(
    userService: UserService,
) {
    ipcMain.handle(IPC_CHANNELS.USER_REGISTER, async (
        _event,
        userData: UserCreatePayload,
    ) => {
        return handleServiceCall(() => userService.registerUser(
            userData,
        ));
    });

    ipcMain.handle(IPC_CHANNELS.USER_LOGIN, async (
        _event,
        userLoginData: UserLoginPayload,
    ) => {
        return handleServiceCall(() => userService.login(
            userLoginData,
        ));
    });

    ipcMain.handle(IPC_CHANNELS.AUTH_GET_INITIAL_SESSION, async () => {
        const rememberedUser = persistentSessionManager.getRememberedUser();
        if (rememberedUser && persistentSessionManager.wasRememberMeEnabled()) {
            // Re-establish in-memory session if it wasn't already loaded by constructor
            // (Constructor of PersistentSessionManager already does this loading part)
            // No need to call setAuthenticatedUser again here, just return what was loaded/remembered.
            return { success: true, data: rememberedUser as User };
        }
        return { success: true, data: null };
    });
};
