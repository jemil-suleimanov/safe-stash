import { AppSettingsService } from '@electron/services/appSettingsService';
import { UserService } from '@electron/services/userService';

import { registerAuthHandlers } from './authHandler';
import { registerAppSettingsHandlers } from './settingsHandler';

interface Services {
    appSettingsService: AppSettingsService;
    userService:        UserService;
}

export function setupIpcHandlers(services: Services) {
    console.log('Setting app IPC handlers');
    registerAppSettingsHandlers(services.appSettingsService);
    registerAuthHandlers(services.userService);
}
