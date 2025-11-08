import { Languages } from './constants';

export interface DictionaryWord {
    id: number,
    cloudId?: number,
    word: string,
    contexts: DictionaryWordContext[],
    translation?: string,
    explanations: DictionaryWordExplanation[],
    pronunciation?: string,
    images: DictionaryWordImage[],
    createdAt: string,
    updatedAt?: string,
}

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