import { fromPromise } from 'xstate';
import type { DatabaseController } from 'src/controllers';
import { getWordFromDB } from '../../../db-service';
import type { DictionaryWord } from '../../../types';

export const dbRetrieverActor = fromPromise(async (props: {
    input: {
        dbController: DatabaseController,
        word: DictionaryWord,
    },
}): Promise<DictionaryWord | undefined> => {
    const { dbController, word } = props.input;

    return await getWordFromDB({
        db: dbController,
        text: word.text,
        sourceLanguage: word.sourceLanguage,
        targetLanguage: word.targetLanguage,
    });
});