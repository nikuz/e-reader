import { fromPromise } from 'xstate';
import type { DatabaseController } from 'src/controllers';
import type { BookHighlight } from 'src/types';
import { firebaseGetExplanation } from '../../../firebase-service';
import { Languages } from '../../../constants';
import type { DictionaryWord } from '../../../types';

export const explanationRetrieverActor = fromPromise(async (props: {
    input: {
        dbController: DatabaseController<DictionaryWord>,
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