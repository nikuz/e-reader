import { fromPromise } from 'xstate';
import type { BookHighlight } from 'src/types';
import { firebaseGetExplanation } from '../../../firebase-service';
import type { Language } from '../../../types';

export const explanationActor = fromPromise(async (props: {
    input: {
        highlight: BookHighlight,
        sourceLanguage: Language,
        targetLanguage: Language,
    },
}): Promise<string> => {
    const { highlight, sourceLanguage, targetLanguage } = props.input;

    return await firebaseGetExplanation({
        word: highlight.text,
        sourceLanguage,
        targetLanguage,
        // context: highlight.context,
    });
});