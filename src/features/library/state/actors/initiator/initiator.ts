import { fromPromise } from 'xstate';
import { FileStorageController } from 'src/controllers';
import type { DatabaseController } from 'src/controllers';
import { getBookCoverObjectUrl } from 'src/features/library/utils';
import type { BookAttributes } from 'src/types';
import { libraryDirectory } from '../../../constants';

export const initiatorActor = fromPromise(async (props: {
    input: {
        dbController: DatabaseController<BookAttributes>,
    },
}): Promise<BookAttributes[]> => {
    // create libraryDirectory if it doesn't exist yet
    try {
        await FileStorageController.stat({ path: libraryDirectory });
    } catch {
        await FileStorageController.mkdir({ path: libraryDirectory });    
    }

    await props.input.dbController.init();
    const storedBooks = await props.input.dbController.readAll();

    for (const book of storedBooks) {
        const cover = await getBookCoverObjectUrl(book);
        if (cover) {
            book.cover = cover;
        }
    }

    return storedBooks;
});
