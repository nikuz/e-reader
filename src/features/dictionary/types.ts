import { Languages } from './constants';

export interface DictionaryWord {
    id: string,
    cloudId?: string,
    word: string,
    contexts: DictionaryWordContext[],
    translation?: string,
    explanations: DictionaryWordExplanation[],
    pronunciation?: string,
    images: DictionaryWordImage[],
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