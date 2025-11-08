import { fromPromise } from 'xstate';
import type { BookHighlight } from 'src/types';
import { getTranslation } from '../../../translation-service';
import { Languages } from '../../../constants';

export const dbRetrieverActor = fromPromise(async (props: {
    input: {
        highlight: BookHighlight,
    },
}): Promise<string> => {
    const { highlight } = props.input;

    return getTranslation({
        word: highlight.text,
        sourceLanguage: Languages.ENGLISH,
        targetLanguage: Languages.RUSSIAN,
    });
});