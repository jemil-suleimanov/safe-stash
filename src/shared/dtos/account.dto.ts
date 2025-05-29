import { AccountTypeCode } from '@shared/types/account';

export interface CreateAccountPayload {
    name:         string;
    type:         AccountTypeCode;
    balance:      number;
    icon?:        string;
    description?: string;
};
