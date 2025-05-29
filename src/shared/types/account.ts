export enum ACCOUNT_TYPE {
    'CASH'     = 'Cash',
    'BANK_CHK' = 'Checking Account',
    'BANK_SAV' = 'Savings Account',
    'CARD_CR'  = 'Credit Card',
    'CARD_DB'  = 'Debit Card',
    'INVEST'   = 'Investments account',
    'LOAN'     = 'Loan Account',
    'EWALLET'  = 'E-Wallet',
}

export type AccountTypeCode = keyof typeof ACCOUNT_TYPE;

export interface AccountType {
    code:         AccountTypeCode
    name:         string;
    description?: string;
}
