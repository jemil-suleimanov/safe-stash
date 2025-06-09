export const IPC_CHANNELS = {
    GET_APP_SETUP_DATA:       'app:get-setup-data',
    USER_REGISTER:            'user:register',
    USER_LOGIN:               'user:login',
    AUTH_GET_INITIAL_SESSION: 'auth:get-initial-session',
    ACCOUNT_GET_TYPES:        'account:get-account-types',
    ACCOUNT_GET_TYPE_BY_CODE: 'account:get-account-types-by-code',
    ACCOUNT_CREATE:           'account:create',
    ACCOUNT_GET_BY_ID:        'account:get-by-id',
    ACCOUNT_GET_ALL_FOR_USER: 'account:get-all-for-user',
} as const;
