import path from 'node:path';

import { AccountRepository } from '@electron/database/repositories/accountRepository';
import { CurrencyRepository } from '@electron/database/repositories/currencyRepository';
import { LanguageRepository } from '@electron/database/repositories/languageRepository';
import { UserRepository } from '@electron/database/repositories/userRepository';
import { setupIpcHandlers } from '@electron/ipc/index';
import { AccountService } from '@electron/services/accountService';
import { AppSettingsService } from '@electron/services/appSettingsService';
import { UserService } from '@electron/services/userService';
import { app, BrowserWindow, Menu, MenuItem } from 'electron';
import { dialog } from 'electron';
import squirrelStartup from 'electron-squirrel-startup';

import { closeDatabase, initializeDatabase } from '../database/connection';

if (squirrelStartup) {
    app.quit();
}

const createWindow = () => {
    const mainWindow = new BrowserWindow({
        width:          1280,
        height:         992,
        icon:           path.join(__dirname, 'safe-stash-icon.png'),
        webPreferences: {
            nodeIntegration:  false,
            contextIsolation: true,
            sandbox:          false,
            preload:          path.join(__dirname, 'preload.js'),
        },
    });

    if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
        mainWindow.webContents.on('context-menu', (event, params) => {
            const menu = new Menu();
            if (params.isEditable || (params.selectionText && params.selectionText.trim() !== '')) {
                menu.append(new MenuItem({ label: 'Cut', role: 'cut', enabled: params.editFlags.canCut }));
                menu.append(new MenuItem({ label: 'Copy', role: 'copy', enabled: params.editFlags.canCopy }));
                menu.append(new MenuItem({ label: 'Paste', role: 'paste', enabled: params.editFlags.canPaste }));
                menu.append(new MenuItem({ type: 'separator' }));
            }
            menu.append(new MenuItem({
                label: 'Inspect Element',
                click: () => { mainWindow!.webContents.inspectElement(params.x, params.y); },
            }));
            menu.append(new MenuItem({ type: 'separator' }));
            menu.append(new MenuItem({ label: 'Reload', role: 'reload' }));
            menu.append(new MenuItem({ label: 'Force Reload', role: 'forceReload' }));
            menu.append(new MenuItem({ label: 'Toggle Developer Tools', role: 'toggleDevTools' }));
            menu.popup({ window: mainWindow! });

            mainWindow.webContents.on('did-navigate', (event, url) => {
                console.log(`Electron Window Navigated To: ${url}`);
            });
            mainWindow.webContents.on('did-navigate-in-page', (event, url, isMainFrame) => {
                if (isMainFrame) {
                    console.log(`Electron Window In-Page Navigation: ${url}`);
                }
            });
        });
        mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
        mainWindow.webContents.openDevTools();
    }
    else {
        mainWindow.loadFile(path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`));
    }
};

app.whenReady().then(async () => {
    console.log('App is ready...');
    try {
        await initializeBackend();
        createWindow();
        console.log('Window created.');
    }
    catch (error) {
        console.error('Failed during app initialization:', error);
        app.quit();
    }
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('will-quit', () => {
    closeDatabase(); // Close DB connection
    console.log('Electron App is quitting.');
});

app.on('activate', () => {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});

async function initializeBackend() {
    try {
        const db = initializeDatabase();
        const currencyRepo = new CurrencyRepository(db);
        const languageRepo = new LanguageRepository(db);
        const userRepo = new UserRepository(db);
        const accountRepo = new AccountRepository(db);

        const appSettingsService = new AppSettingsService(currencyRepo, languageRepo);
        const userService = new UserService(userRepo);
        const accountService = new AccountService(accountRepo);

        setupIpcHandlers({ appSettingsService, userService, accountService });
    } catch (error) {
        console.error('FATAL: Application backend initialization failed:', error);
        dialog.showErrorBox('Initialization Error', `Failed to initialize application services: ${error}`);
        app.quit();
        throw error;
    }
}
