import { Preferences } from '@capacitor/preferences';
import { fromPromise } from 'xstate';
import type { Book } from 'src/models';
import { getReadProgressStorageKey } from '../../../utils';
import type { BookReadProgress } from '../../../types';

export const readProgressSaverActor = fromPromise(async (props: {
    input: {
        book?: Book,
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
