import { fromPromise } from 'xstate';
import { FileStorageController } from 'src/controllers';
import { firebaseGetImage } from 'src/services';
import { converterUtils } from 'src/utils';
import { getImagePrompt } from '../../../utils';
import { DICTIONARY_IMAGES_DIRECTORY } from '../../../constants';
import type {
    DictionaryWord,
    DictionaryWordContext,
    DictionaryWordContextImage,
    DictionaryWordContextExplanation,
} from '../../../types';

export const imageActor = fromPromise(async (props: {
    input: {
        word: DictionaryWord,
        contextExplanation?: DictionaryWordContextExplanation,
        context: DictionaryWordContext,
        style?: string,
    },
}): Promise<DictionaryWordContextImage> => {
    const {
        word,
        context,
        style,
        contextExplanation,
    } = props.input;

    if (!contextExplanation) {
        throw new Error('"contextExplanation" should be provided to generate a context image');
    }

    const prompt = getImagePrompt({
        textExplanation: contextExplanation.text,
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

    return {
        contextId: context.id,
        src: fileUri.uri,
    };
});
