import { fromPromise } from 'xstate';
import { FileStorageController } from 'src/controllers';
import type { DatabaseController } from 'src/controllers';
import { getBookCoverObjectUrl } from 'src/features/library/utils';
import { initializeDBService, getAllBooksFromDB } from '../../../db-service';
import { LIBRARY_DIRECTORY } from '../../../constants';
import type { BookAttributes } from '../../../types';

export const initializerActor = fromPromise(async (props: {
    input: {
        dbController: DatabaseController<BookAttributes>,
    },
}): Promise<BookAttributes[]> => {
    try {
        await FileStorageController.stat({ path: LIBRARY_DIRECTORY });
    } catch {
        await FileStorageController.mkdir({ path: LIBRARY_DIRECTORY });    
    }

    const dbController = props.input.dbController;
    await initializeDBService(dbController);

    const storedBooks = await getAllBooksFromDB(dbController);
    storedBooks.sort((a, b) => b.addedAt - a.addedAt);

    for (const book of storedBooks) {
        const cover = await getBookCoverObjectUrl(book);
        if (cover) {
            book.cover = cover;
        }
    }

    console.log('Library initialized');

    return storedBooks;
});
