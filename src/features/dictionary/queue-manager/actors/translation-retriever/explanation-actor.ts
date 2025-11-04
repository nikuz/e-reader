import { fromPromise } from 'xstate';
import type { BookHighlight } from 'src/types';
import { firebaseGetExplanation } from '../../../firebase-service';
import { Languages } from '../../../constants';

export const explanationActor = fromPromise(async (props: {
    input: {
        highlight: BookHighlight,
    },
}): Promise<string> => {
    const { highlight } = props.input;

    return await firebaseGetExplanation({
        word: highlight.text,
        sourceLanguage: Languages.ENGLISH,
        targetLanguage: Languages.RUSSIAN,
        // context: highlight.context,
    });
});