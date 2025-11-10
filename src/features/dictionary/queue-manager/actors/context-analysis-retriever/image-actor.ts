import { fromPromise } from 'xstate';
import { FileStorageController } from 'src/controllers';
import { converterUtils } from 'src/utils';
import { firebaseGetImage } from '../../../firebase-service';
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
        newContext: DictionaryWordContext,
        style?: string,
    },
}): Promise<DictionaryWordContextImage> => {
    const {
        word,
        newContext,
        style,
        contextExplanation,
    } = props.input;

    if (!contextExplanation) {
        throw new Error('"contextExplanation" should be provided to generate a context image');
    }

    console.log(contextExplanation);
    const image = await firebaseGetImage({
        textExplanation: contextExplanation.text,
        style,
    });
    
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
        contextId: newContext.id,
        src: fileUri.uri,
    };
});
