import { fromPromise } from 'xstate';
import type { DatabaseController } from 'src/controllers';
import { addWordContextImageInDB, getWordByIdFromDB } from '../../../db-service';
import type { DictionaryWord, DictionaryWordContextImage } from '../../../types';

export const imageSaverActor = fromPromise(async (props: {
    input: {
        dbController: DatabaseController,
        word: DictionaryWord,
        contextImage?: DictionaryWordContextImage,
    },
}): Promise<DictionaryWord> => {
    const {
        dbController,
        word,
        contextImage,
    } = props.input;

    if (!contextImage) {
        throw new Error('Can\'t update dictionary word context image without "contextImage" parameter.');
    }

    await addWordContextImageInDB({
        db: dbController,
        word,
        contextImage,
    });

    const storedWord = await getWordByIdFromDB({
        db: dbController,
        id: word.id,
    });

    if (!storedWord) {
        throw new Error('Can\'t retrieve just updated word from local DB');
    }

    return storedWord;
});