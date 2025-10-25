import { fromPromise } from 'xstate';
import { Preferences } from '@capacitor/preferences';
import { FileStorageController } from 'src/controllers';
import type { DatabaseController } from 'src/controllers';
import { Book } from 'src/models';
import type { BookAttributes } from 'src/types';
import { initializeDBService, getAllBooksFromDB } from '../../../db-service';
import { getBookCoverObjectUrl } from '../../../utils';
import {
    LIBRARY_DIRECTORY,
    LIBRARY_LAST_SELECTED_BOOK_STORAGE_KEY,
} from '../../../constants';

export const initializerActor = fromPromise(async (props: {
    input: {
        dbController: DatabaseController<BookAttributes>,
    },
}): Promise<{
    books: Book[],
    lastSelectedBook?: Book,
}> => {
    try {
        await FileStorageController.stat({ path: LIBRARY_DIRECTORY });
    } catch {
        await FileStorageController.mkdir({ path: LIBRARY_DIRECTORY });    
    }

    const dbController = props.input.dbController;
    await initializeDBService(dbController);

    const storedBooks = (await getAllBooksFromDB(dbController)).map((item) => new Book(item));
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
    let lastSelectedBook: Book | undefined;

    if (lastSelectedBookEisbn.value) {
        lastSelectedBook = storedBooks.find(item => item.eisbn === lastSelectedBookEisbn.value);
    }

    return {
        books: storedBooks,
        lastSelectedBook,
    };
});
