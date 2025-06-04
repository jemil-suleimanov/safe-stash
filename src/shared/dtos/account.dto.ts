import { AccountTypeCode } from '@shared/types/account';

export interface CreateAccountPayload {
    name:              string;
    type:              AccountTypeCode;
    startBalanceCents: number;
    iconPath?:         string | null;
    description?:      string | null;
};
