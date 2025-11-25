import { fromPromise } from 'xstate';
import { FileStorageController } from 'src/controllers';
import { firebaseGetPronunciation } from 'src/services';
import { audioUtils, converterUtils } from 'src/utils';
import { getPronunciationPrompt } from '../../../utils';
import { DICTIONARY_PRONUNCIATIONS_DIRECTORY } from '../../../constants';
import type { DictionaryWord } from '../../../types';

export const pronunciationActor = fromPromise(async (props: {
    input: { word: DictionaryWord },
}): Promise<string> => {
    const { word } = props.input;

    const prompt = getPronunciationPrompt({
        word: word.text,
        sourceLanguage: word.sourceLanguage,
    });
    const pronunciation = await firebaseGetPronunciation(prompt);

    if (!pronunciation) {
        throw new Error('Can\'t retrieve pronunciation');
    }

    // save pronunciation file
    const wavBase64 = audioUtils.pcm16ToWavBase64(pronunciation.data);
    const fileName = converterUtils.stringToHash(word.text);
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