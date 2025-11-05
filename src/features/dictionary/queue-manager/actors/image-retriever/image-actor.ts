import { fromPromise } from 'xstate';
import { firebaseGetImage } from '../../../firebase-service';
import type { DictionaryWord } from '../../../types';

export const imageActor = fromPromise(async (props: {
    input: {
        word: DictionaryWord,
    },
}): Promise<string> => {
    const { word } = props.input;

    if (!word.aiExplanation) {
        throw new Error('Word should have "aiExplanation" to generate an image');
    }

    const image = await firebaseGetImage({
        textExplanation: word.aiExplanation,
        // style: 'ancient rome',
        // context: highlight.context,
    });
    
    if (!image) {
        throw new Error('Can\'t retrieve image');
    }

    return `data:${image.mimeType};base64,${image.data}`;
});
