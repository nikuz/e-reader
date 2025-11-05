import { Languages } from './constants';

export interface DictionaryWord {
    id: number,
    cloudId?: number,
    word: string,
    translation?: string,
    contexts?: string[],
    aiExplanation?: string,
    aiPronunciation?: string,
    aiImage?: string,
    createdAt: string,
    updatedAt?: string,
}

export type LanguageKey = keyof typeof Languages;
export type Language = typeof Languages[LanguageKey];