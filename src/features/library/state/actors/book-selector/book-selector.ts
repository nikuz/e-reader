import { fromPromise } from 'xstate';
import { Preferences } from '@capacitor/preferences';
import { LIBRARY_LAST_SELECTED_BOOK_STORAGE_KEY } from '../../../constants';
import type { BookAttributes } from '../../../types';

export const bookSelectorActor = fromPromise(async (props: {
    input: {
        bookAttributes: BookAttributes,
    },
}): Promise<BookAttributes> => {
    const { bookAttributes } = props.input;

    await Preferences.set({
        key: LIBRARY_LAST_SELECTED_BOOK_STORAGE_KEY,
        value: bookAttributes.eisbn,
    });

    return bookAttributes;
});
