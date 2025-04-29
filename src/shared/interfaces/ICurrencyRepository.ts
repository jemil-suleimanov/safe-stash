import { Currency } from '@shared/domain/Currency';

export interface ICurrencyRepository {
    findAll(): Promise<Currency[]>

    findByCode(_code: string): Promise<Currency | null>
}
