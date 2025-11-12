import { fromPromise } from 'xstate';
import { Preferences } from '@capacitor/preferences';
import { BookModel } from 'src/models';
import { getBookById } from '../../../db-service';
import { LIBRARY_LAST_SELECTED_BOOK_STORAGE_KEY } from '../../../constants';

export const lastSelectedBookLoaderActor = fromPromise(async (): Promise<BookModel | undefined> => {
    const lastSelectedBookEisbn = await Preferences.get({
        key: LIBRARY_LAST_SELECTED_BOOK_STORAGE_KEY,
    });
    let lastSelectedBook: BookModel | undefined;

    if (lastSelectedBookEisbn.value) {
        const storedBook = await getBookById(lastSelectedBookEisbn.value);
        if (storedBook) {
            lastSelectedBook = new BookModel(storedBook);
        }
    }

    return lastSelectedBook;
});
