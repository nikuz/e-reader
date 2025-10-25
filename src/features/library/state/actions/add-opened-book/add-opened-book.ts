import type { DoneActorEvent } from 'xstate';
import { bookFrameStateMachineActor } from 'src/features/book-frame/state';
import { RouterPath } from 'src/router/constants';
import type { BookAttributes } from 'src/types';
import type { LibraryStateContext } from '../../types';

export function addOpenedBookAction(props: {
    event: DoneActorEvent<BookAttributes | undefined>,
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

    bookFrameStateMachineActor.send({
        type: 'LOAD_BOOK',
        bookAttributes: newBook,
    });
    props.context.navigator?.(RouterPath.BOOK);
}