import { Currency } from "./domain/Currency"
import { Language } from "./domain/Language"

export interface AppSetupData {
    availableCurrencies: Currency[]
    availableLanguages:  Language[]
}

export interface IDbApi {
    getAvailableSettings: () => Promise<AppSetupData>;
}
