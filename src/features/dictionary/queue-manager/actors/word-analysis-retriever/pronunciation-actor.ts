import { fromPromise } from 'xstate';
import { FileStorageController } from 'src/controllers';
import { audioUtils, converterUtils } from 'src/utils';
import type { BookHighlight } from 'src/types';
import { firebaseGetPronunciation } from '../../../firebase-service';
import { DICTIONARY_PRONUNCIATIONS_DIRECTORY } from '../../../constants';
import type { Language } from '../../../types';

export const pronunciationActor = fromPromise(async (props: {
    input: {
        highlight: BookHighlight,
        sourceLanguage: Language,
    },
}): Promise<string> => {
    const { highlight, sourceLanguage } = props.input;

    const pronunciation = await firebaseGetPronunciation({
        word: highlight.text,
        sourceLanguage,
    });

    if (!pronunciation) {
        throw new Error('Can\'t retrieve pronunciation');
    }

    // save pronunciation file
    const wavBase64 = audioUtils.pcm16ToWavBase64(pronunciation.data);
    const fileName = converterUtils.stringToHash(highlight.text);
    const filePath = `${DICTIONARY_PRONUNCIATIONS_DIRECTORY}/${fileName}.wav`;

    await FileStorageController.writeFile({
        path: filePath,
        data: wavBase64,
        recursive: true,
    });

    // get file path URI
    const fileUri = await FileStorageController.getUri({ path: filePath });

    return fileUri.uri;
});