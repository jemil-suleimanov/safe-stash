// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

import { CreateAccountPayload } from '@shared/dtos/account.dto';
import { UserCreatePayload, UserLoginPayload } from '@shared/dtos/auth.dto';
import { IPC_CHANNELS } from '@shared/ipc-channels';
import { IDbApi } from '@shared/types';
import { AccountTypeCode } from '@shared/types/account';
import { contextBridge, ipcRenderer } from 'electron';

const api: IDbApi = {
    getAvailableSettings:  () => ipcRenderer.invoke(IPC_CHANNELS.GET_APP_SETUP_DATA),
    register:              (userRegisterPayload: UserCreatePayload) => ipcRenderer.invoke(IPC_CHANNELS.USER_REGISTER, userRegisterPayload),
    login:                 (userLoginPayload: UserLoginPayload) => ipcRenderer.invoke(IPC_CHANNELS.USER_LOGIN, userLoginPayload),
    getAccountTypes:       () => ipcRenderer.invoke(IPC_CHANNELS.ACCOUNT_GET_TYPES),
    getAccountTypeByCode:  (code: AccountTypeCode) => ipcRenderer.invoke(IPC_CHANNELS.ACCOUNT_GET_TYPE_BY_CODE, code),
    createAccount:         (payload: CreateAccountPayload) => ipcRenderer.invoke(IPC_CHANNELS.ACCOUNT_CREATE, payload),
    getAccountById:        (id: number) => ipcRenderer.invoke(IPC_CHANNELS.ACCOUNT_GET_BY_ID, id),
    getAllAccountsForUser: () => ipcRenderer.invoke(IPC_CHANNELS.ACCOUNT_GET_ALL_FOR_USER),
    authGetInitialSession: () => ipcRenderer.invoke(IPC_CHANNELS.AUTH_GET_INITIAL_SESSION),
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
