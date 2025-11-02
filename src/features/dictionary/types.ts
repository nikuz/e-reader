import { Languages } from './constants';

export interface DictionaryWord {
    id: number,
    word: string,
    translation: string,
    aiResponse?: string,
    createdAt: string,
}

export type LanguageKey = keyof typeof Languages;
export type Language = typeof Languages[LanguageKey];