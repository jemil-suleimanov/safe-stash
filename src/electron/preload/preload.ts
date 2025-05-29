// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

import { UserCreatePayload, UserLoginPayload } from '@shared/dtos/auth.dto';
import { IPC_CHANNELS } from '@shared/ipc-channels';
import { IDbApi } from '@shared/types';
import { contextBridge, ipcRenderer } from 'electron';

const api: IDbApi = {
    getAvailableSettings: () => ipcRenderer.invoke(IPC_CHANNELS.GET_APP_SETUP_DATA),
    register:             (userRegisterPayload: UserCreatePayload) => ipcRenderer.invoke(IPC_CHANNELS.USER_REGISTER, userRegisterPayload),
    login:                (userLoginPayload: UserLoginPayload) => ipcRenderer.invoke(IPC_CHANNELS.USER_LOGIN, userLoginPayload),
    getAccountTypes:      () => ipcRenderer.invoke(IPC_CHANNELS.ACCOUNT_GET_TYPES),
};

try {
    contextBridge.exposeInMainWorld('dbApi', api);
    console.log('Preload: dbApi exposed successfully.');
} catch (error) {
    console.error('Preload Error: Failed to expose APIs via contextBridge:', error);
}

contextBridge.exposeInMainWorld('__electron_context__', {
    onContextInvalidated: (callback: () => void) => {
        // Clean up listeners or resources if necessary when the context is destroyed
        // For now, just log it.
        console.log('Preload: Context invalidated.');
        callback();
    },
});
