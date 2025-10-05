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
    const storedBooks = props.context.storedBooks;
    let bookAttributes: BookAttributes | undefined;
    if (props.event.type === 'SELECT_BOOK') {
        bookAttributes = props.event.bookAttributes;
    } else {
        bookAttributes = props.event.output;
    }

    if (!bookAttributes) {
        return;
    }

    bookFrameStateMachineActor.send({
        type: 'LOAD_BOOK',
        bookAttributes,
    });
    props.context.navigator?.(Routes.BOOK);

    props.enqueue.assign({
        storedBooks: [
            ...storedBooks,
            bookAttributes,
        ],
    });
}