import { fromPromise } from 'xstate';
import { Preferences } from '@capacitor/preferences';
import { BookModel } from 'src/models';
import { getAllBooksFromDB } from '../../../db-service';
import { getBookCoverObjectUrl } from '../../../utils';
import { LIBRARY_LAST_SELECTED_BOOK_STORAGE_KEY } from '../../../constants';

export const booksLoaderActor = fromPromise(async (): Promise<{
    books: BookModel[],
    lastSelectedBook?: BookModel,
}> => {
    const storedBooks = (await getAllBooksFromDB()).map((item) => new BookModel(item));
    storedBooks.sort((a, b) => b.addedAt - a.addedAt);

    for (const book of storedBooks) {
        const cover = await getBookCoverObjectUrl(book);
        if (cover) {
            book.cover = cover;
        }
    }

    const lastSelectedBookEisbn = await Preferences.get({
        key: LIBRARY_LAST_SELECTED_BOOK_STORAGE_KEY,
    });
    let lastSelectedBook: BookModel | undefined;

    if (lastSelectedBookEisbn.value) {
        lastSelectedBook = storedBooks.find(item => item.eisbn === lastSelectedBookEisbn.value);
    }

    return {
        books: storedBooks,
        lastSelectedBook,
    };
});
