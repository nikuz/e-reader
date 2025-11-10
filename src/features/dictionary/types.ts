import { Languages } from './constants';

export interface DictionaryWord {
    id: number,
    cloudId?: string,
    bookId: string,
    text: string,
    translation?: string,
    pronunciation?: string,
    contexts: DictionaryWordContext[],
    explanation?: string,
    contextExplanations: DictionaryWordContextExplanation[],
    image?: string,
    contextImages: DictionaryWordContextImage[],
    sourceLanguage: Language,
    targetLanguage: Language,
    createdAt: string,
    updatedAt?: string,
}

export type DictionaryWordDBInstance = Record<keyof DictionaryWord, string> & { id: number };

export interface DictionaryWordContext {
    id: string,
    text: string,
}

export interface DictionaryWordContextExplanation {
    contextId?: string,
    text: string,
}

export interface DictionaryWordContextImage {
    contextId?: string,
    src: string,
}

export type LanguageKey = keyof typeof Languages;
export type Language = typeof Languages[LanguageKey];
export type LanguageCode = (typeof Languages)[keyof typeof Languages]['code'];