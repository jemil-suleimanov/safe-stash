import { UserService } from '@electron/services/userService';
import { UserPayloadData } from '@shared/dtos/auth.dto';
import { IPC_CHANNELS } from '@shared/ipc-channels';
import { ipcMain } from 'electron';

import { handleServiceCall } from './handlers/handler-utils';

export function registerAuthHandlers(
    userService: UserService,
) {
    ipcMain.handle(IPC_CHANNELS.USER_REGISTER, async (
        _event,
        userData: UserPayloadData,
    ) => {
        return handleServiceCall(() => userService.registerUser(
            userData,
        ));
    });

    ipcMain.handle(IPC_CHANNELS.USER_LOGIN, async (
        _event,
        username: string,
        password: string,
    ) => {
        return handleServiceCall(() => userService.login(
            username, password,
        ));
    });
};
