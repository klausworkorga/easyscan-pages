import de from './de.json';
import en from './en.json';

export const languages = ['en', 'de'] as const;

export type Lang = (typeof languages)[number];
export type TranslationDictionary = typeof en;

const dictionaries: Record<Lang, TranslationDictionary> = {
  en,
  de,
};

export function isLang(value: string | undefined): value is Lang {
  return typeof value === 'string' && (languages as readonly string[]).includes(value);
}

export function getLangFromUrl(url: URL): Lang {
  const [, maybeLang] = url.pathname.split('/');
  return isLang(maybeLang) ? maybeLang : 'en';
}

export function getDictionary(lang: Lang): TranslationDictionary {
  return dictionaries[lang];
}

function lookupValue(dictionary: unknown, key: string): string | undefined {
  const value = key.split('.').reduce<unknown>((current, part) => {
    if (current && typeof current === 'object' && part in (current as Record<string, unknown>)) {
      return (current as Record<string, unknown>)[part];
    }

    return undefined;
  }, dictionary);

  return typeof value === 'string' ? value : undefined;
}

export function useTranslations(lang: Lang) {
  return (key: string): string => {
    return lookupValue(dictionaries[lang], key) ?? lookupValue(dictionaries.en, key) ?? key;
  };
}
