import { fromPromise } from 'xstate';
import type { DatabaseController } from 'src/controllers';
import type { BookModel } from 'src/models';
import { updateHighlightsInDB } from '../../../db-service/actions';

export const highlightUpdaterActor = fromPromise(async (props: {
    input: {
        book: BookModel,
        dbController: DatabaseController,
    },
}): Promise<BookModel> => {
    const { book, dbController } = props.input;

    await updateHighlightsInDB(dbController, book.toOriginal());

    return book;
});
