import { AppSettingsService } from '@electron/services/appSettingsService'
import { ipcMain } from 'electron'

export function setupSettingsHandlers(appSettingsService: AppSettingsService) {
    ipcMain.handle('app:get-available-settings', async () => {
        console.log('IPC Handler: app:get-available-settings')

        try {
            const settings = await appSettingsService.getAvailableSettings()
            return settings
        }
        catch (error) {
            console.error('IPC Error getting available settings:', error)
            // Throwing here sends error back to renderer invoke promise
            throw new Error('Failed to load setup data.')
        }
    })
}
