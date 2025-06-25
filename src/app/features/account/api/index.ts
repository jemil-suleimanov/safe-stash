import { BaseApi } from '@app/api';
import { handleApiError, handleApiResponse } from '@app/shared/utils/apiUtils';
import { CreateAccountPayload } from '@shared/dtos/account.dto';

class AccountApi extends BaseApi {
    constructor() {
        super();
    }

    public async getAccountTypes() {
        try {
            const response = await this.rawApi.getAccountTypes();
            return handleApiResponse(response);
        } catch (error) {
            handleApiError(error);
            return null;
        }
    }

    public async getAccountsList() {
        try {
            const response = await this.rawApi.getAllAccountsForUser();
            return handleApiResponse(response);
        } catch (error) {
            handleApiError(error);
            return null;
        }
    }

    public async createAccount(payload: CreateAccountPayload) {
        try {
            const response = await this.rawApi.createAccount(payload);
            return handleApiResponse(response);
        } catch(error) {
            handleApiError(error);
            return null;
        }
    }
}

const accountApi = new AccountApi();
export default accountApi;
