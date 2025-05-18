import { AppSettingsService } from '@electron/services/appSettingsService';
import { IPC_CHANNELS } from '@shared/ipc-channels';
import { ipcMain } from 'electron';

import { handleServiceCall } from './handlers/handler-utils';

export function registerAppSettingsHandlers(appSettingsService: AppSettingsService) {
    ipcMain.handle(IPC_CHANNELS.GET_APP_SETUP_DATA, async () => {
        return handleServiceCall(() => appSettingsService.getAvailableSettings());
    });
}
