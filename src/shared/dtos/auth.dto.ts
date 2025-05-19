export interface UserPayloadData {
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
