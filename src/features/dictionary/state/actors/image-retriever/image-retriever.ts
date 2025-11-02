import { fromPromise } from 'xstate';
import type { DatabaseController } from 'src/controllers';
import { firebaseGetImage } from '../../../firebase-service';
import type { DictionaryWord } from '../../../types';

export const imageRetrieverActor = fromPromise(async (props: {
    input: {
        dbController: DatabaseController<DictionaryWord>,
        word: DictionaryWord,
    },
}): Promise<string | undefined> => {
    const { word } = props.input;

    if (!word.aiExplanation) {
        throw new Error('Word should have "aiExplanation" to generate an image');
    }

    const image = await firebaseGetImage({
        textExplanation: word.aiExplanation,
        // style: 'ancient rome',
        // context: highlight.context,
    });
    
    if (image) {
        return `data:${image.mimeType};base64,${image.data}`;
    }

    return undefined;
});
