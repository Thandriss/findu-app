import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import translationRUS from './pages/locales/rus/translation.json';
import translationEN from './pages/locales/en/translation.json';
import Backend from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  rus: {
    translation: translationRUS
  },
  en: {
    translation: translationEN
  }
};

i18n
// detect user language
  .use(Backend)
// pass the i18n instance to react-i18next
  .use(LanguageDetector)
// init i18next
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    debug: true,
    interpolation: {
      escapeValue: false, 
    }
  });

export default i18n;