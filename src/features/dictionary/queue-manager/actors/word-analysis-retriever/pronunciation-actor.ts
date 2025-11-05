import { fromPromise } from 'xstate';
import type { BookHighlight } from 'src/types';
import { firebaseGetPronunciation } from '../../../firebase-service';

export const pronunciationActor = fromPromise(async (props: {
    input: {
        highlight: BookHighlight,
    },
}): Promise<string> => {
    const { highlight } = props.input;

    const pronunciation = await firebaseGetPronunciation({
        word: highlight.text,
    });

    if (!pronunciation) {
        throw new Error('Can\'t retrieve pronunciation');
    }

    return `data:${pronunciation.mimeType};base64,${pronunciation.data}`;
});