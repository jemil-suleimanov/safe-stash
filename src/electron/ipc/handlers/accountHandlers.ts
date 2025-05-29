import { AccountService } from '@electron/services/accountService';
import { IPC_CHANNELS } from '@shared/ipc-channels';
import { ipcMain } from 'electron';

import { handleServiceCall } from './handler-utils';

export function registerAccountHandler(accountService: AccountService  ) {
    ipcMain.handle(IPC_CHANNELS.ACCOUNT_GET_TYPES, async () => {
        return handleServiceCall(() => accountService.getAllAccountTypes());
    });
}
