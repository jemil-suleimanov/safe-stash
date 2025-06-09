import { AccountService } from '@electron/services/accountService';
import { CreateAccountPayload } from '@shared/dtos/account.dto';
import { IPC_CHANNELS } from '@shared/ipc-channels';
import { AccountTypeCode } from '@shared/types/account';
import { ipcMain } from 'electron';

import { handleServiceCall } from './handler-utils';

export function registerAccountHandler(accountService: AccountService  ) {
    ipcMain.handle(IPC_CHANNELS.ACCOUNT_GET_TYPES, async () => {
        return handleServiceCall(() => accountService.getAllAccountTypes());
    });
    ipcMain.handle( IPC_CHANNELS.ACCOUNT_GET_TYPE_BY_CODE, async (_event, code: AccountTypeCode) => {
        return handleServiceCall(() => accountService.getAccountTypeByCode(code));
    });
    ipcMain.handle(IPC_CHANNELS.ACCOUNT_CREATE, async (_event, payload: CreateAccountPayload) => {
        return handleServiceCall(() => accountService.create(payload));
    });
    ipcMain.handle(IPC_CHANNELS.ACCOUNT_GET_BY_ID, async (_event, id: number) => {
        return handleServiceCall(() => accountService.getAccountById(id));
    });
    ipcMain.handle(IPC_CHANNELS.ACCOUNT_GET_ALL_FOR_USER, async () => {
        return handleServiceCall(() => accountService.getAllAccountsForUser());
    });
}
