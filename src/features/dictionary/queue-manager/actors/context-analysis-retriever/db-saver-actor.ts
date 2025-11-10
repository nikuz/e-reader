import { fromPromise } from 'xstate';
import type { DatabaseController } from 'src/controllers';
import { updateWordContextInDB, getWordByIdFromDB } from '../../../db-service';
import type {
    DictionaryWord,
    DictionaryWordContext,
    DictionaryWordContextExplanation,
    DictionaryWordContextImage,
} from '../../../types';

export const dbSaverActor = fromPromise(async (props: {
    input: {
        dbController: DatabaseController,
        word: DictionaryWord,
        newContext: DictionaryWordContext,
        contextExplanation?: DictionaryWordContextExplanation,
        contextImage?: DictionaryWordContextImage,
    },
}): Promise<DictionaryWord> => {
    const {
        dbController,
        word,
        newContext,
        contextExplanation,
        contextImage,
    } = props.input;

    if (!contextExplanation || !contextImage) {
        throw new Error('Can\'t update dictionary word context without "contextExplanation" and "contextImage" parameters.');
    }

    await updateWordContextInDB({
        db: dbController,
        word,
        newContext,
        contextExplanation,
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