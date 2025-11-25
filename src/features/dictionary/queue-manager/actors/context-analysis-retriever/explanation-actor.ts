import { fromPromise } from 'xstate';
import { firebaseGetExplanation } from 'src/services';
import { getExplanationPrompt } from '../../../utils';
import type {
    DictionaryWord,
    DictionaryWordContext,
    DictionaryWordContextExplanation,
} from '../../../types';

export const explanationActor = fromPromise(async (props: {
    input: {
        word: DictionaryWord,
        context: DictionaryWordContext,
    },
}): Promise<DictionaryWordContextExplanation> => {
    const { word, context } = props.input;

    const prompt = getExplanationPrompt({
        word: word.text,
        sourceLanguage: word.sourceLanguage,
        targetLanguage: word.targetLanguage,
        context: context.text,
    });
    const explanation = await firebaseGetExplanation(prompt);

    return {
        contextId: context.id,
        text: explanation,
    };
});