import { AppSettingsService } from '@electron/services/appSettingsService'

import { setupSettingsHandlers } from './settingsHandler'

interface Services {
    appSettingsService: AppSettingsService
}

export function setupIpcHandlers(services: Services) {
    console.log('Setting app IPC handlers')
    setupSettingsHandlers(services.appSettingsService)
}
