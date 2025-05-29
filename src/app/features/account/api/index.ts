import { BaseApi } from '@app/api';
import { handleApiError, handleApiResponse } from '@app/shared/utils/apiUtils';

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
}

const accountApi = new AccountApi();
export default accountApi;
