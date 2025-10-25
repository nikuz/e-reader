import { fromPromise } from 'xstate';
import type { DatabaseController } from 'src/controllers';
import type { Book } from 'src/models';
import type { BookAttributes } from 'src/types';
import { updateHighlightsInDB } from '../../../db-service/actions';

export const highlightUpdaterActor = fromPromise(async (props: {
    input: {
        book: Book,
        dbController: DatabaseController<BookAttributes>,
    },
}): Promise<Book> => {
    const { book, dbController } = props.input;

    await updateHighlightsInDB(dbController, book.toOriginal());

    return book;
});
