import { fromPromise } from 'xstate';
import { BookModel } from 'src/models';
import { getAllBooksFromDB } from '../../../db-service';

export const booksLoaderActor = fromPromise(async (): Promise<BookModel[]> => {
    const books = await getAllBooksFromDB();

    return books.map((item) => new BookModel(item));
});
