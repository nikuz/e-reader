import { fromPromise } from 'xstate';
import { getWordsListFromDB } from '../../../db-service';
import type { DictionaryWord } from '../../../types';

export const wordsListChunkRetrievalActor = fromPromise(async (props: {
    input: {
        from: number,
        to: number,
    },
}): Promise<DictionaryWord[]> => {
    const { from, to } = props.input;

    const words = await getWordsListFromDB({
        from,
        to,
    });

    return words;
});
