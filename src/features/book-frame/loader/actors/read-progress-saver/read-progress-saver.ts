import { Preferences } from '@capacitor/preferences';
import { fromPromise } from 'xstate';
import type { BookModel } from 'src/models';
import { getReadProgressStorageKey } from '../../../utils';
import type { BookReadProgress } from '../../../types';

export const readProgressSaverActor = fromPromise(async (props: {
    input: {
        book?: BookModel,
        readProgress: BookReadProgress,
    },
}): Promise<void> => {
    const book = props.input.book;
    const readProgress = props.input.readProgress;
    
    if (!book) {
        return;
    }

    await Preferences.set({
        key: getReadProgressStorageKey(book),
        value: JSON.stringify(readProgress),
    });
});
