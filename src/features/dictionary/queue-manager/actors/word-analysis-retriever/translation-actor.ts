import { fromPromise } from 'xstate';
import { getTranslation } from '../../../translation-service';
import type { DictionaryWord } from '../../../types';

export const translationActor = fromPromise(async (props: {
    input: { word: DictionaryWord },
}): Promise<string> => {
    const { word } = props.input;

    return getTranslation({
        word: word.word,
        sourceLanguage: word.sourceLanguage,
        targetLanguage: word.targetLanguage,
    });
});