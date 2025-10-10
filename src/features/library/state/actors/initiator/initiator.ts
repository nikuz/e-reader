import { fromPromise } from 'xstate';
import { FileStorageController } from 'src/controllers';
import type { DatabaseController } from 'src/controllers';
import { getBookCoverObjectUrl } from 'src/features/library/utils';
import type { BookAttributes } from 'src/types';
import { initializeDBService, getAllBooksFromDB } from '../../../db-service';
import { LIBRARY_DIRECTORY } from '../../../constants';

export const initiatorActor = fromPromise(async (props: {
    input: {
        dbController: DatabaseController<BookAttributes>,
    },
}): Promise<BookAttributes[]> => {
    // create LIBRARY_DIRECTORY if it doesn't exist yet
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

    return storedBooks;
});
