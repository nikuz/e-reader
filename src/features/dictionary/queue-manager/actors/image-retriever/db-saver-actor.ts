import { fromPromise } from 'xstate';
import type { DatabaseController } from 'src/controllers';
import { updateWordImageInDB } from '../../../db-service';
import type { DictionaryWord } from '../../../types';

export const dbSaverActor = fromPromise(async (props: {
    input: {
        dbController: DatabaseController,
        word: DictionaryWord,
        image?: string,
    },
}): Promise<string> => {
    const {
        dbController,
        word,
        image,
    } = props.input;

    if (!image) {
        throw new Error('Can\'t update dictionary word image without "image" parameter.');
    }

    await updateWordImageInDB({
        db: dbController,
        word,
        image,
    });

    return image;
});