import { fromPromise } from 'xstate';
import { getWordFromDB } from '../../../db-service';
import type { DictionaryWord } from '../../../types';

export const dbRetrieverActor = fromPromise(async (props: {
    input: {
        word: DictionaryWord,
    },
}): Promise<DictionaryWord | undefined> => {
    const { word } = props.input;

    return await getWordFromDB({
        text: word.text,
        sourceLanguage: word.sourceLanguage,
        targetLanguage: word.targetLanguage,
    });
});