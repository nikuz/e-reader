import { fromPromise } from 'xstate';
import { FileStorageController } from 'src/controllers';
import { converterUtils } from 'src/utils';
import type { BookHighlight } from 'src/types';
import { firebaseGetImage } from '../../../firebase-service';
import { DICTIONARY_IMAGES_DIRECTORY } from '../../../constants';
import type { DictionaryWord } from '../../../types';

export const imageActor = fromPromise(async (props: {
    input: {
        word: DictionaryWord,
        highlight: BookHighlight,
    },
}): Promise<string> => {
    const { word } = props.input;

    if (!word.explanations) {
        throw new Error('Word should have "aiExplanation" to generate an image');
    }

    const image = await firebaseGetImage({
        textExplanation: word.explanations[0].text,
        // style: 'ancient rome',
        // context: highlight.context,
    });
    
    if (!image) {
        throw new Error('Can\'t retrieve image');
    }

    // save image file
    const fileName = `${converterUtils.stringToHash(word.word)}-${Date.now()}`;
    const ext = image.mimeType.split('/')[1] ?? 'bin';
    const filePath = `${DICTIONARY_IMAGES_DIRECTORY}/${fileName}.${ext}`;

    await FileStorageController.writeFile({
        path: filePath,
        data: image.data,
        recursive: true,
    });

    // get file path URI
    const fileUri = await FileStorageController.getUri({ path: filePath });

    return fileUri.uri;
});
