import { fromPromise } from 'xstate';
import type { DatabaseController } from 'src/controllers';
import { updateWordImageInDB, getWordByIdFromDB } from '../../../db-service';
import type { DictionaryWord } from '../../../types';

export const dbSaverActor = fromPromise(async (props: {
    input: {
        dbController: DatabaseController,
        word: DictionaryWord,
        image?: string,
    },
}): Promise<DictionaryWord> => {
    const {
        dbController,
        word,
        image,
    } = props.input;

    if (!image) {
        throw new Error('Can\'t update dictionary word image without "image" parameter.');
    }

    await updateWordImageInDB({
        db: dbController,
        word,
        image,
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