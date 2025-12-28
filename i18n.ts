
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import HttpBackend from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n
  .use(HttpBackend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'fa',
    debug: false,
    defaultNS: 'common',
    ns: ['common'],
    backend: {
      loadPath: '/locales/{{lng}}/{{ns}}.json',
    },
    interpolation: {
      escapeValue: false, // React already protects from xss
    },
  });

export default i18n;
