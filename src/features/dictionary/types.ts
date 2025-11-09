import { Languages } from './constants';

export interface DictionaryWord {
    id: string,
    cloudId?: string,
    bookId: string,
    text: string,
    translation?: string,
    pronunciation?: string,
    contexts: DictionaryWordContext[],
    explanation?: string,
    contextExplanations: DictionaryWordExplanation[],
    image?: string,
    contextImages: DictionaryWordImage[],
    sourceLanguage: Language,
    targetLanguage: Language,
    createdAt: string,
    updatedAt?: string,
}

export type DictionaryWordDBInstance = Record<keyof DictionaryWord, string>;

export interface DictionaryWordContext {
    id: string,
    text: string,
}

export interface DictionaryWordExplanation {
    contextId?: string,
    text: string,
}

export interface DictionaryWordImage {
    contextId?: string,
    src: string,
}

export type LanguageKey = keyof typeof Languages;
export type Language = typeof Languages[LanguageKey];
export type LanguageCode = (typeof Languages)[keyof typeof Languages]['code'];