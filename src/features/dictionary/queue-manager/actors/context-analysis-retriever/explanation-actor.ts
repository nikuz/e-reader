import { fromPromise } from 'xstate';
import type { BookHighlight } from 'src/types';
import { firebaseGetExplanation } from '../../../firebase-service';
import type {
    DictionaryWord,
    DictionaryWordContext,
    DictionaryWordContextExplanation,
} from '../../../types';

export const explanationActor = fromPromise(async (props: {
    input: {
        word: DictionaryWord,
        highlight: BookHighlight,
        newContext: DictionaryWordContext,
    },
}): Promise<DictionaryWordContextExplanation> => {
    const { word, highlight, newContext } = props.input;

    const explanation = await firebaseGetExplanation({
        word: word.text,
        sourceLanguage: word.sourceLanguage,
        targetLanguage: word.targetLanguage,
        context: highlight.context,
    });

    return {
        contextId: newContext.id,
        text: explanation,
    };
});