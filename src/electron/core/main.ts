import path from 'node:path'

import { CurrencyRepository } from '@electron/database/repositories/currencyRepository'
import { setupIpcHandlers } from '@electron/ipc/index'
import { AppSettingsService } from '@electron/services/appSettingsService'
import { app, BrowserWindow } from 'electron'
import started from 'electron-squirrel-startup'

import { closeDatabase, initializeDatabase } from '../database/connection'
import { LanguageRepository } from '@electron/database/repositories/languageRepository'

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (started) {
    app.quit()
}

const createWindow = () => {
    // Create the browser window.
    const mainWindow = new BrowserWindow({
        width:          800,
        height:         600,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
        },
    })

    // and load the index.html of the app.
    if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
        mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL)
        // Open the DevTools.
        mainWindow.webContents.openDevTools()
    }
    else {
        mainWindow.loadFile(path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`))
    }
}

app.whenReady().then(async () => {
    console.log('App is ready...')
    try {
        const db = initializeDatabase()
        const currencyRepo = new CurrencyRepository(db)
        const languageRepo = new LanguageRepository(db)

        const appSettingsService = new AppSettingsService(currencyRepo, languageRepo)

        setupIpcHandlers({ appSettingsService })

        console.log('Database initialized.')
        createWindow()
        console.log('Window created.')
    }
    catch (error) {
        console.error('Failed during app initialization:', error)
        app.quit() // Quit if critical init fails (like DB)
    }
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('will-quit', () => {
    closeDatabase() // Close DB connection
    console.log('Electron App is quitting.')
})

app.on('activate', () => {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow()
    }
})
