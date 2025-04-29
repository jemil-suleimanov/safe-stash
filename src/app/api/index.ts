export class BaseApi {
    protected readonly api: typeof window.dbApi;
    constructor() {
        this.api = window.dbApi;
    }
}
