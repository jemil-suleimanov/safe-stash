import { Currency } from '@shared/domain/Currency'

export interface ICurrencyRepository {
    findAll(): Currency[]

    findByCode(_code: string): Currency | null
}
