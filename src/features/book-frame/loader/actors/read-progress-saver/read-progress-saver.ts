import { Preferences } from '@capacitor/preferences';
import type { BookAttributes } from 'src/features/library/types';
import { fromPromise } from 'xstate';
import { getReadProgressStorageKey } from '../../../utils';
import type { BookReadProgress } from '../../../types';

export const readProgressSaverActor = fromPromise(async (props: {
    input: {
        bookAttributes?: BookAttributes,
        readProgress: BookReadProgress,
    },
}): Promise<void> => {
    const bookAttributes = props.input.bookAttributes;
    const readProgress = props.input.readProgress;
    
    if (!bookAttributes) {
        return;
    }

    await Preferences.set({
        key: getReadProgressStorageKey(bookAttributes),
        value: JSON.stringify(readProgress),
    });
});
