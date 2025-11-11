import { fromPromise } from 'xstate';
import type { DatabaseController } from 'src/controllers';
import { getWordsListFromDB } from '../../../db-service';
import type { DictionaryWord } from '../../../types';

export const wordsListChunkRetrievalActor = fromPromise(async (props: {
    input: {
        dbController: DatabaseController,
        from: number,
        to: number,
    },
}): Promise<DictionaryWord[]> => {
    const { dbController, from, to } = props.input;

    const words = await getWordsListFromDB({
        db: dbController,
        from,
        to,
    });

    return words;
});
