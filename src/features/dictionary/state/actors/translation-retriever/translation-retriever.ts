import { fromPromise } from 'xstate';
import type { DatabaseController } from 'src/controllers';
import type { BookHighlight } from 'src/types';
import type { DictionaryWord } from '../../../types';

export const translationRetrieverActor = fromPromise(async (props: {
    input: {
        dbController: DatabaseController<DictionaryWord>,
        highlight: BookHighlight,
    },
}): Promise<void> => {
    const { highlight } = props.input;

    console.log(highlight);
});
