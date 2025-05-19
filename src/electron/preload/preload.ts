// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

import { IPC_CHANNELS } from '@shared/ipc-channels';
import { IDbApi } from '@shared/types';
import { contextBridge, ipcRenderer } from 'electron';

const api: IDbApi = {
    getAvailableSettings: () => ipcRenderer.invoke(IPC_CHANNELS.GET_APP_SETUP_DATA),
    register:             () => ipcRenderer.invoke(IPC_CHANNELS.USER_REGISTER),
    login:                () => ipcRenderer.invoke(IPC_CHANNELS.USER_LOGIN),
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
