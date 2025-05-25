import { BaseApi } from '@app/api';
import { handleApiError, handleApiResponse } from '@app/shared/utils/apiUtils';
import { UserCreatePayload, UserLoginPayload } from '@shared/dtos/auth.dto';

class AuthApi extends BaseApi {
    constructor() {
        super();
    }

    public async register(userData: UserCreatePayload) {
        try {
            console.log(userData,'userData');
            const response = await this.rawApi.register(userData);
            return handleApiResponse(response);
        } catch (error) {
            handleApiError(error);
            return null;
        }
    }

    public async login(userLoginData: UserLoginPayload) {
        try {
            const response = await this.rawApi.login(userLoginData);
            return handleApiResponse(response);
        } catch (error) {
            handleApiError(error);
            return null;
        }
    }
}

const authApi = new AuthApi();
export default authApi;
