import type { BookHighlight } from 'src/types';
import type { DictionaryWord, Language } from '../../types';
import { converterUtils } from 'src/utils';

export function getNewDictionaryWord(props: {
    bookId: string,
    highlight: BookHighlight,
    translation?: string,
    explanation?: string,
    pronunciation?: string,
    sourceLanguage: Language,
    targetLanguage: Language,
}): DictionaryWord {
    const contextId = converterUtils.stringToHash(props.highlight.context);
    
    return {
        id: Date.now().toString(),
        bookId: props.bookId,
        text: props.highlight.text,
        translation: props.translation,
        pronunciation: props.pronunciation,
        contexts: [{
            id: contextId,
            text: props.highlight.context,
        }],
        explanation: props.explanation,
        contextExplanations: [],
        contextImages: [],
        sourceLanguage: props.sourceLanguage,
        targetLanguage: props.targetLanguage,
        createdAt: new Date().toISOString(),
    };
}