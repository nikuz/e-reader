export const Languages = {
    ENGLISH: { code: 'en', name: 'English' },
    RUSSIAN: { code: 'ru', name: 'Russian' },
} as const;

export type LanguageKey = keyof typeof Languages;
export type Language = typeof Languages[LanguageKey];
export type LanguageCode = (typeof Languages)[keyof typeof Languages]['code'];