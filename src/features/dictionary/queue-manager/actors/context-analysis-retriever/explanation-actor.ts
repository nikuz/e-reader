import { fromPromise } from 'xstate';
import { firebaseGetExplanation } from '../../../firebase-service';
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

    const explanation = await firebaseGetExplanation({
        word: word.text,
        sourceLanguage: word.sourceLanguage,
        targetLanguage: word.targetLanguage,
        context: context.text,
    });

    return {
        contextId: context.id,
        text: explanation,
    };
});