import { fromPromise } from 'xstate';
import { getWordsListFromDB } from '../../../db-service';
import type { DictionaryWord } from '../../../types';

export const wordsListChunkRetrievalActor = fromPromise(async (props: {
    input: {
        from: number,
        to: number,
    },
}): Promise<{
    words: DictionaryWord[],
    counter: number,
}> => {
    const { from, to } = props.input;

    return await getWordsListFromDB({
        from,
        to,
    });
});
