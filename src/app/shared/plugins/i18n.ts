import { createI18n } from 'vue-i18n';

const messages = {
    en: await import('@app/shared/locales/en.json'),
    de: await import('@app/shared/locales/de.json'),
    ua: await import('@app/shared/locales/ua.json'),
    cr: await import('@app/shared/locales/cr.json'),
};

export type SupportedLocales = keyof typeof messages;


export const i18n = createI18n({
    locale:         'en',
    messages,
    legacy:         false,
    fallbackLocale: 'en',
});


export function updateLocale(locale: SupportedLocales) {
    i18n.global.locale.value = locale;
}
