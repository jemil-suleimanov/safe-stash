import { AppSettingsService } from '@electron/services/appSettingsService';

import { registerAppSettingsHandlers } from './settingsHandler';

interface Services {
    appSettingsService: AppSettingsService
}

export function setupIpcHandlers(services: Services) {
    console.log('Setting app IPC handlers');
    registerAppSettingsHandlers(services.appSettingsService);
}
