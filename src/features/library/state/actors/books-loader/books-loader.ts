import { fromPromise } from 'xstate';
import { BookModel } from 'src/models';
import { getAllBooksFromDB } from '../../../db-service';
import { getBookCoverObjectUrl } from '../../../utils';

export const booksLoaderActor = fromPromise(async (): Promise<BookModel[]> => {
    const storedBooks = (await getAllBooksFromDB()).map((item) => new BookModel(item));
    storedBooks.sort((a, b) => b.addedAt - a.addedAt);

    for (const book of storedBooks) {
        const cover = await getBookCoverObjectUrl(book);
        if (cover) {
            book.cover = cover;
        }
    }

    return storedBooks;
});
