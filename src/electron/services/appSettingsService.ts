import { ICurrencyRepository } from '@shared/interfaces/ICurrencyRepository';
import { ILanguageRepository } from '@shared/interfaces/ILanguageRepository';
import { AppSetupData } from '@shared/types';

export class AppSettingsService {
    constructor(
        private currencyRepository: ICurrencyRepository,
        private languageRepository: ILanguageRepository,
    ) {}

    public async getAvailableSettings(): Promise<AppSetupData> {
        const [currencies, languages] = await Promise.all([
            this.currencyRepository.findAll(),
            this.languageRepository.findAll(),
        ]);

        return {
            availableCurrencies: currencies,
            availableLanguages:  languages,
        };
    }
}
