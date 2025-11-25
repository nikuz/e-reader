import { fromPromise } from 'xstate';
import { firebaseGetExplanation } from 'src/services';
import { getExplanationPrompt } from '../../../utils';
import type { DictionaryWord } from '../../../types';

export const explanationActor = fromPromise(async (props: {
    input: { word: DictionaryWord },
}): Promise<string> => {
    const { word } = props.input;

    const prompt = getExplanationPrompt({
        word: word.text,
        sourceLanguage: word.sourceLanguage,
        targetLanguage: word.targetLanguage,
    });
    
    return await firebaseGetExplanation(prompt);
});