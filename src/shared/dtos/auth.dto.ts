export interface UserPayloadData {
    username:     string;
    firstName:    string;
    lastName:     string;
    email?:       string | null;
    password:     string;
    passwordHint: string;
    image?:       string | null;
    language:     string;
    currency:     string;
    theme:        'light' | 'dark';
}
