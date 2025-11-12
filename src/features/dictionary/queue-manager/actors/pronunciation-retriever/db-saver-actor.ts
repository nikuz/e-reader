import { fromPromise } from 'xstate';
import { updateWordPronunciationInDB, getWordByIdFromDB } from '../../../db-service';
import type { DictionaryWord } from '../../../types';

export const dbSaverActor = fromPromise(async (props: {
    input: {
        word: DictionaryWord,
        pronunciation?: string,
    },
}): Promise<DictionaryWord> => {
    const {
        word,
        pronunciation,
    } = props.input;

    if (!pronunciation) {
        throw new Error('Can\'t update dictionary word pronunciation without "pronunciation" parameter.');
    }

    await updateWordPronunciationInDB({
        word,
        pronunciation,
    });

    const storedWord = await getWordByIdFromDB({
        id: word.id,
    });

    if (!storedWord) {
        throw new Error('Can\'t retrieve just updated word from local DB');
    }

    return storedWord;
});