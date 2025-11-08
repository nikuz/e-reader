import type { BookHighlight } from 'src/types';
import type { DictionaryWord, Language } from '../../types';
import { converterUtils } from 'src/utils';

export function getNewDictionaryWord(props: {
    highlight: BookHighlight,
    translation?: string,
    explanation?: string,
    pronunciation?: string,
    sourceLanguage: Language,
    targetLanguage: Language,
}): DictionaryWord {
    const contextId = converterUtils.stringToHash(props.highlight.context);
    const explanations = [];

    if (props.explanation) {
        explanations.push({ text: props.explanation });
    }

    return {
        id: Date.now(),
        word: props.highlight.text,
        translation: props.translation,
        contexts: [{
            id: contextId,
            text: props.highlight.context,
        }],
        explanations,
        pronunciation: props.pronunciation,
        images: [],
        sourceLanguage: props.sourceLanguage.code,
        targetLanguage: props.targetLanguage.code,
        createdAt: new Date().toISOString(),
    };
}