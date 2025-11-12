import { fromPromise } from 'xstate';
import { updateWordImageInDB, getWordByIdFromDB } from '../../../db-service';
import type { DictionaryWord } from '../../../types';

export const dbSaverActor = fromPromise(async (props: {
    input: {
        word: DictionaryWord,
        image?: string,
    },
}): Promise<DictionaryWord> => {
    const {
        word,
        image,
    } = props.input;

    if (!image) {
        throw new Error('Can\'t update dictionary word image without "image" parameter.');
    }

    await updateWordImageInDB({
        word,
        image,
    });

    const storedWord = await getWordByIdFromDB({
        id: word.id,
    });

    if (!storedWord) {
        throw new Error('Can\'t retrieve just updated word from local DB');
    }

    return storedWord;
});