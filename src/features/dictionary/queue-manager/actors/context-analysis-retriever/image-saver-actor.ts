import { fromPromise } from 'xstate';
import { addWordContextImageInDB, getWordByIdFromDB } from '../../../db-service';
import type { DictionaryWord, DictionaryWordContextImage } from '../../../types';

export const imageSaverActor = fromPromise(async (props: {
    input: {
        word: DictionaryWord,
        contextImage?: DictionaryWordContextImage,
    },
}): Promise<DictionaryWord> => {
    const {
        word,
        contextImage,
    } = props.input;

    if (!contextImage) {
        throw new Error('Can\'t update dictionary word context image without "contextImage" parameter.');
    }

    await addWordContextImageInDB({
        word,
        contextImage,
    });

    const storedWord = await getWordByIdFromDB({
        id: word.id,
    });

    if (!storedWord) {
        throw new Error('Can\'t retrieve just updated word from local DB');
    }

    return storedWord;
});