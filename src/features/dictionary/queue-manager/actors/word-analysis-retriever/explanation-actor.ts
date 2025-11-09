import { fromPromise } from 'xstate';
import { firebaseGetExplanation } from '../../../firebase-service';
import type { DictionaryWord } from '../../../types';

export const explanationActor = fromPromise(async (props: {
    input: { word: DictionaryWord },
}): Promise<string> => {
    const { word } = props.input;

    return await firebaseGetExplanation({
        word: word.text,
        sourceLanguage: word.sourceLanguage,
        targetLanguage: word.targetLanguage,
    });
});