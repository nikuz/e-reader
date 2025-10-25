import { statusBarStateMachineActor } from 'src/features/status-bar/state';
import type { BookFrameStateContext, BookLoadSuccessEvent } from '../../types';

export function initializeBookAction(props: {
    event: BookLoadSuccessEvent,
    context: BookFrameStateContext,
    enqueue: { assign: (context: Partial<BookFrameStateContext>) => void },
}) {
    const book = props.event.book;
    const readProgress = props.event.readProgress ?? props.context.readProgress;

    props.enqueue.assign({
        book,
        readProgress,
        chapterUrl: book.spine[readProgress.chapter].url,
        menuPanelsVisible: false,
    });

    statusBarStateMachineActor.send({ type: 'HIDE' });
}