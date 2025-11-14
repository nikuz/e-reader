import { fromPromise } from 'xstate';
import { searchInDB } from '../../../db-service';
import type { DictionaryWord } from '../../../types';

export const wordSearcherActor = fromPromise(async (props: {
    input: {
        searchText: string,
    },
}): Promise<{
    words: DictionaryWord[],
    counter: number,
}> => {
    const { searchText } = props.input;

    if (!searchText.trim()) {
        return {
            words: [],
            counter: 0,
        };
    }

    return await searchInDB({
        searchText,
        from: 0,
        to: 100, // Limit search results to 100 items
    });
});
