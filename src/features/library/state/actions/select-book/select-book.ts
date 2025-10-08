import type { DoneActorEvent } from 'xstate';
import { bookFrameStateMachineActor } from 'src/features/book-frame/state';
import { Routes } from 'src/types';
import type { BookAttributes } from 'src/types';
import type { LibraryStateContext, SelectBookEvent } from '../../types';

export function selectBookAction(props: {
    event: SelectBookEvent | DoneActorEvent<BookAttributes | undefined>,
    context: LibraryStateContext,
    enqueue: { assign: (context: Partial<LibraryStateContext>) => void },
}) {
    let newBook: BookAttributes | undefined;
    if (props.event.type === 'SELECT_BOOK') {
        newBook = props.event.bookAttributes;
    } else {
        newBook = props.event.output;
    }
    
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
    props.context.navigator?.(Routes.BOOK);

}