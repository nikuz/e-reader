import { fromPromise } from 'xstate';
import type { DatabaseController } from 'src/controllers';
import type { BookAttributes } from 'src/types';
import { updateHighlightsInDB } from '../../../db-service/actions';

export const highlightUpdaterActor = fromPromise(async (props: {
    input: {
        bookAttributes: BookAttributes,
        rawStoredBooks: BookAttributes[],
        dbController: DatabaseController<BookAttributes>,
    },
}): Promise<void> => {
    const { bookAttributes, rawStoredBooks, dbController } = props.input;

    const rawBookAttributes = rawStoredBooks.find(item => item.eisbn === bookAttributes.eisbn);
    if (rawBookAttributes) {
        await updateHighlightsInDB(dbController, {
            ...rawBookAttributes,
            highlights: bookAttributes.highlights,
        });
    }
});
