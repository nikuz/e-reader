import { fromPromise } from 'xstate';
import { Preferences } from '@capacitor/preferences';
import type { Book } from 'src/models';
import { LIBRARY_LAST_SELECTED_BOOK_STORAGE_KEY } from '../../../constants';

export const bookSelectorActor = fromPromise(async (props: {
    input: {
        book: Book,
    },
}): Promise<Book> => {
    const { book } = props.input;

    await Preferences.set({
        key: LIBRARY_LAST_SELECTED_BOOK_STORAGE_KEY,
        value: book.eisbn,
    });

    return book;
});
