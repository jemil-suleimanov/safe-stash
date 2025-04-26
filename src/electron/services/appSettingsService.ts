import { ICurrencyRepository } from '@shared/interfaces/ICurrencyRepository'
import { ILanguageRepository } from '@shared/interfaces/ILanguageRepository'
import { AppSetupData } from '@shared/types'

export class AppSettingsService {
    constructor(
        private currencyRepo: ICurrencyRepository,
        private languages: ILanguageRepository,
    ) {}

    getAvailableSettings(): AppSetupData {
        try {
            const currencies = this.currencyRepo.findAll()
            const languages = this.languages.findAll()

            return {
                availableCurrencies: currencies,
                availableLanguages:  languages,
            }
        }
        catch (error) {
            console.error('Error getting available settings in services', error)
            return { availableCurrencies: [], availableLanguages: [] }
        }
    }
}
