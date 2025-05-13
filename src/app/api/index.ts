export class BaseApi {
    protected readonly rawApi: typeof window.dbApi;
    constructor() {
        if (!window.dbApi) {
            console.error('FATAL: window.dbApi not found! Preload script likely failed.');
            throw new Error('Application backend API is not available.');
        }
        this.rawApi = window.dbApi;
    }
}
