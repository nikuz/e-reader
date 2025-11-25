import { fromPromise } from 'xstate';
import { getTextTranslation } from 'src/services';
import type { DictionaryWord } from '../../../types';

export const translationActor = fromPromise(async (props: {
    input: { word: DictionaryWord },
}): Promise<string> => {
    const { word } = props.input;

    return getTextTranslation({
        word: word.text,
        sourceLanguage: word.sourceLanguage,
        targetLanguage: word.targetLanguage,
    });
});