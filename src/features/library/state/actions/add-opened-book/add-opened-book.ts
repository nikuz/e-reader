import type { DoneActorEvent } from 'xstate';
import type { BookModel } from 'src/models';
import type { LibraryStateContext } from '../../types';

export function addOpenedBookAction(props: {
    event: DoneActorEvent<BookModel | undefined>,
    context: LibraryStateContext,
    enqueue: { assign: (context: Partial<LibraryStateContext>) => void },
}) {
    const newBook = props.event.output;
    if (!newBook) {
        return;
    }
    
    const storedBooks = [...props.context.storedBooks];
    const existingBookIndex = storedBooks.findIndex(item => item.eisbn === newBook.eisbn);

    if (existingBookIndex !== -1) {
        storedBooks.splice(existingBookIndex, 1);
    }

    storedBooks.unshift(newBook);

    props.enqueue.assign({ storedBooks });
}