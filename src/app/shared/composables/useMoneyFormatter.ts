import { useSettingsStore } from '@app/features/settings';
import { storeToRefs } from 'pinia';

import { centsToWhole } from '../utils/moneyFormatter';

export function useMoneyFormatter() {
    const { defaultCurrency } = storeToRefs(useSettingsStore());

    return (cents: number) => `${centsToWhole(cents)} ${defaultCurrency.value?.symbol}`;
}
