import { fromPromise } from 'xstate';
import type { DatabaseController } from 'src/controllers';
import { updateWordPronunciationInDB, getWordByIdFromDB } from '../../../db-service';
import type { DictionaryWord } from '../../../types';

export const dbSaverActor = fromPromise(async (props: {
    input: {
        dbController: DatabaseController,
        word: DictionaryWord,
        pronunciation?: string,
    },
}): Promise<DictionaryWord> => {
    const {
        dbController,
        word,
        pronunciation,
    } = props.input;

    if (!pronunciation) {
        throw new Error('Can\'t update dictionary word pronunciation without "pronunciation" parameter.');
    }

    await updateWordPronunciationInDB({
        db: dbController,
        word,
        pronunciation,
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