import type { BookHighlight } from 'src/types';
import type { DictionaryWord } from '../../types';

export function getNewWord(props: {
    highlight: BookHighlight,
    translation: string,
    explanation: string,
    pronunciation?: string,
}): DictionaryWord {
    return {
        id: Date.now(),
        word: props.highlight.text,
        translation: props.translation,
        contexts: [props.highlight.context],
        aiExplanation: props.explanation,
        aiPronunciation: props.pronunciation,
        createdAt: new Date().toISOString(),
    };
}