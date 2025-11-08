import { fromPromise } from 'xstate';
import type { DatabaseController } from 'src/controllers';
import type { BookHighlight } from 'src/types';
import { getWordFromDB } from '../../../db-service';
import type { DictionaryWord, Language } from '../../../types';

export const dbRetrieverActor = fromPromise(async (props: {
    input: {
        dbController: DatabaseController,
        highlight: BookHighlight,
        sourceLanguage: Language,
        targetLanguage: Language,
    },
}): Promise<DictionaryWord | undefined> => {
    const { dbController, highlight, sourceLanguage, targetLanguage } = props.input;

    return await getWordFromDB({
        db: dbController,
        word: highlight.text,
        sourceLanguage,
        targetLanguage,
    });
});