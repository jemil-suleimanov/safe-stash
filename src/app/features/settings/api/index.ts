import { BaseApi } from '@app/api';
import { handleApiError, handleApiResponse } from '@app/shared/utils/apiUtils';


export class SettingsApi extends BaseApi {
    constructor() {
        super();
    }

    async getAvailableSettings() {
        try {
            const response = await this.rawApi.getAvailableSettings();
            return handleApiResponse(response);
        } catch (error) {
            handleApiError(error);
            return null;
        }
    }
}

const settingsApi = new SettingsApi();
export default settingsApi;
