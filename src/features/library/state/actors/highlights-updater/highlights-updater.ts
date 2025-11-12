import { fromPromise } from 'xstate';
import type { BookModel } from 'src/models';
import { updateHighlightsInDB } from '../../../db-service';

export const highlightUpdaterActor = fromPromise(async (props: {
    input: {
        book: BookModel,
    },
}): Promise<BookModel> => {
    const { book } = props.input;

    await updateHighlightsInDB(book.toOriginal());

    return book;
});
