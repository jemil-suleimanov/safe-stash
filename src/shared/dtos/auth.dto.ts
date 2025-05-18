export interface UserPayloadData {
    username:     string;
    firstName:    string | null;
    lastName:     string | null;
    email?:       string | null;
    password:     string;
    passwordHint: string;
    image?:       string | null;
    language:     string;
    currency:     string;
}
