import { fromPromise } from 'xstate';
import type { DatabaseController } from 'src/controllers';
import { addWordContextInDB, getWordByIdFromDB } from '../../../db-service';
import type {
    DictionaryWord,
    DictionaryWordContext,
    DictionaryWordContextExplanation,
} from '../../../types';

export const explanationSaverActor = fromPromise(async (props: {
    input: {
        dbController: DatabaseController,
        word: DictionaryWord,
        context: DictionaryWordContext,
        contextExplanation?: DictionaryWordContextExplanation,
    },
}): Promise<DictionaryWord> => {
    const {
        dbController,
        word,
        context,
        contextExplanation,
    } = props.input;

    if (!contextExplanation) {
        throw new Error('Can\'t update dictionary word context without "contextExplanation" parameter.');
    }

    await addWordContextInDB({
        db: dbController,
        word,
        newContext: context,
        contextExplanation,
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