import { BaseApi } from '@app/api';

export class SettingsApi extends BaseApi {
    constructor() {
        super();
    }

    async getAvailableSettings() {
        try {
            console.log(this.api, 'settings');
            const settings = await this.api.getAvailableSettings();
            return settings;
        } catch (error) {
            console.log('Error while fetching settings: ', error);
            throw new Error('Error while fetching settings');
        }
    }
}

const settingsApi = new SettingsApi();
export default settingsApi;
