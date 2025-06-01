import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as en from './locales/en.json';
import * as ja from './locales/ja.json';
import * as cn from './locales/cn.json';
import * as kr from './locales/kr.json';
import * as de from './locales/de.json';
import * as fr from './locales/fr.json';
import * as pt from './locales/pt.json';
import * as es from './locales/es.json';
import * as nl from './locales/nl.json';

const resources = {
  en: { translation: en },
  ja: { translation: ja },
  cn: { translation: cn },
  kr: { translation: kr },
  de: { translation: de },
  fr: { translation: fr },
  pt: { translation: pt },
  es: { translation: es },
  nl: { translation: nl },
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en', // default language
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
