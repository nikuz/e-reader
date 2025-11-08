import { fromPromise } from 'xstate';
import type { BookHighlight } from 'src/types';
import { getTranslation } from '../../../translation-service';
import type { Language } from '../../../types';

export const translationActor = fromPromise(async (props: {
    input: {
        highlight: BookHighlight,
        sourceLanguage: Language,
        targetLanguage: Language,
    },
}): Promise<string> => {
    const { highlight, sourceLanguage, targetLanguage } = props.input;

    return getTranslation({
        word: highlight.text,
        sourceLanguage,
        targetLanguage,
    });
});