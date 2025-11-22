import { fromPromise } from 'xstate';
import { BookModel } from 'src/models';
import { getAllBooksFromDB } from '../../../db-service';

export const booksLoaderActor = fromPromise(async (props: {
    input: {
        lastSelectedBook?: BookModel,
    },
}): Promise<BookModel[]> => {
    const books = await getAllBooksFromDB();

    return books.map((item) => new BookModel(item)).toSorted((a, b) => {
        const lastBookEisbn = props.input.lastSelectedBook?.eisbn;
        if (a.eisbn === lastBookEisbn && b.eisbn !== lastBookEisbn) {
            return - 1;
        } else if (a.eisbn !== lastBookEisbn && b.eisbn === lastBookEisbn) {
            return 1;
        }
        return 0;
    });
});
