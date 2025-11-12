import { fromPromise } from 'xstate';
import { addWordContextInDB, getWordByIdFromDB } from '../../../db-service';
import type {
    DictionaryWord,
    DictionaryWordContext,
    DictionaryWordContextExplanation,
} from '../../../types';

export const explanationSaverActor = fromPromise(async (props: {
    input: {
        word: DictionaryWord,
        context: DictionaryWordContext,
        contextExplanation?: DictionaryWordContextExplanation,
    },
}): Promise<DictionaryWord> => {
    const {
        word,
        context,
        contextExplanation,
    } = props.input;

    if (!contextExplanation) {
        throw new Error('Can\'t update dictionary word context without "contextExplanation" parameter.');
    }

    await addWordContextInDB({
        word,
        newContext: context,
        contextExplanation,
    });

    const storedWord = await getWordByIdFromDB({
        id: word.id,
    });

    if (!storedWord) {
        throw new Error('Can\'t retrieve just updated word from local DB');
    }

    return storedWord;
});