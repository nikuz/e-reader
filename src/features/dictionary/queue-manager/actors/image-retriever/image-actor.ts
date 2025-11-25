import { fromPromise } from 'xstate';
import { FileStorageController } from 'src/controllers';
import { firebaseGetImage } from 'src/services';
import { converterUtils } from 'src/utils';
import { getImagePrompt } from '../../../utils';
import { DICTIONARY_IMAGES_DIRECTORY } from '../../../constants';
import type { DictionaryWord } from '../../../types';

export const imageActor = fromPromise(async (props: {
    input: {
        word: DictionaryWord,
        style?: string,
    },
}): Promise<string> => {
    const { word, style } = props.input;

    if (!word.explanation) {
        throw new Error('Word should have "explanation" to generate an image');
    }

    const prompt = getImagePrompt({
        textExplanation: word.explanation,
        style,
    });
    const image = await firebaseGetImage(prompt);
    
    if (!image) {
        throw new Error('Can\'t retrieve image');
    }

    // save image file
    const fileName = `${converterUtils.stringToHash(word.text)}-${Date.now()}`;
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
