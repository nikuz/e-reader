import type { DoneActorEvent } from 'xstate';
import { bookFrameStateMachineActor } from 'src/features/book-frame/state';
import { RouterPath } from 'src/router/constants';
import type { BookModel } from 'src/models';
import type { LibraryStateContext } from '../../types';

export function selectBookAction(props: {
    event: DoneActorEvent<BookModel>,
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
        book: selectedBook,
    });
    props.context.navigator?.(RouterPath.BOOK);
}