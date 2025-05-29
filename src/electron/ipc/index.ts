import { AccountService } from '@electron/services/accountService';
import { AppSettingsService } from '@electron/services/appSettingsService';
import { UserService } from '@electron/services/userService';

import { registerAccountHandler } from './handlers/accountHandlers';
import { registerAuthHandlers } from './handlers/authHandler';
import { registerAppSettingsHandlers } from './handlers/settingsHandler';

interface Services {
    appSettingsService: AppSettingsService;
    userService:        UserService;
    accountService:     AccountService;
}

export function setupIpcHandlers(services: Services) {
    console.log('Setting app IPC handlers');
    registerAppSettingsHandlers(services.appSettingsService);
    registerAuthHandlers(services.userService);
    registerAccountHandler(services.accountService);
}
