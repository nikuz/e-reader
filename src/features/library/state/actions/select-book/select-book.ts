import type { DoneActorEvent } from 'xstate';
import { bookFrameStateMachineActor } from 'src/features/book-frame/state';
import { RouterPath } from 'src/router/constants';
import type { LibraryStateContext } from '../../types';
import type { BookAttributes } from 'src/features/library/types';

export function selectBookAction(props: {
    event: DoneActorEvent<BookAttributes>,
    context: LibraryStateContext,
    enqueue: { assign: (context: Partial<LibraryStateContext>) => void },
}) {
    const selectedBook = props.event.output;
    if (!selectedBook) {
        return;
    }

    props.enqueue.assign({
        lastSelectedBook: selectedBook,
    });

    bookFrameStateMachineActor.send({
        type: 'LOAD_BOOK',
        bookAttributes: selectedBook,
    });
    props.context.navigator?.(RouterPath.BOOK);
}