import { BaseApi } from '@app/api';
import { handleApiError, handleApiResponse } from '@app/shared/utils/apiUtils';
import { UserPayloadData } from '@shared/dtos/auth.dto';

class AuthApi extends BaseApi {
    constructor() {
        super();
    }

    public async register(userData: UserPayloadData) {
        try {
            const response = await this.rawApi.register(userData);
            return handleApiResponse(response);
        } catch (error) {
            handleApiError(error);
            return null;
        }
    }
}

const authApi = new AuthApi();
export default authApi;
