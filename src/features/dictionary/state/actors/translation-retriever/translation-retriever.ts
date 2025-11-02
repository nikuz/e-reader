import { fromPromise } from 'xstate';
import type { DatabaseController } from 'src/controllers';
import { converterUtils } from 'src/utils';
import type { BookHighlight } from 'src/types';
import { firebaseExplainText, firebaseGenerateImage } from '../../../firebase-service';
import { Languages } from '../../../constants';
import type { DictionaryWord } from '../../../types';

export const translationRetrieverActor = fromPromise(async (props: {
    input: {
        dbController: DatabaseController<DictionaryWord>,
        highlight: BookHighlight,
    },
}): Promise<void> => {
    const { highlight } = props.input;
    console.log(highlight);

    const textExplanation = await firebaseExplainText({
        word: highlight.text,
        sourceLanguage: Languages.ENGLISH,
        targetLanguage: Languages.RUSSIAN,
        // context: highlight.context,
    });
    console.log(textExplanation);

    const image = await firebaseGenerateImage({
        textExplanation,
        style: 'ancient rome',
        // context: highlight.context,
    });
    console.log(image);

    if (image) {
        const blob = converterUtils.base64ToBlob(image.data, image.mimeType);
        const blobUrl = URL.createObjectURL(blob);
        console.log(blobUrl);
    }
});