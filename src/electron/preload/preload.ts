// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

import { IDbApi } from '@shared/types'
import { contextBridge, ipcRenderer } from 'electron'

const api: IDbApi = {
    getAvailableSettings: () => ipcRenderer.invoke('app:get-available-settings')
}

contextBridge.exposeInMainWorld('dbApi', api)
