export interface UserCreatePayload {
    username:     string;
    firstName:    string | null;
    lastName:     string | null;
    email?:       string | null;
    password:     string;
    passwordHint: string;
    image?:       string | null;
    languageCode: string;
    currencyCode: string;
}

export interface UserLoginPayload {
    username: string;
    password: string;
}
