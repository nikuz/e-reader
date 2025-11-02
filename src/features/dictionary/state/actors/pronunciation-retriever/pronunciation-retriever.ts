import { fromPromise } from 'xstate';
import type { DatabaseController } from 'src/controllers';
import type { BookHighlight } from 'src/types';
import { firebaseGetPronunciation } from '../../../firebase-service';
import type { DictionaryWord } from '../../../types';

export const pronunciationRetrieverActor = fromPromise(async (props: {
    input: {
        dbController: DatabaseController<DictionaryWord>,
        highlight: BookHighlight,
    },
}): Promise<string | undefined> => {
    const { highlight } = props.input;

    const pronunciation = await firebaseGetPronunciation({
        word: highlight.text,
    });

    if (pronunciation) {
        return `data:${pronunciation.mimeType};base64,${pronunciation.data}`;
    }

    return undefined;
});