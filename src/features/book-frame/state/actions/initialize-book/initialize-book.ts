import type { BookFrameStateContext, BookLoadSuccessEvent } from '../../types';

export function initializeBookAction(props: {
    event: BookLoadSuccessEvent,
    context: BookFrameStateContext,
    enqueue: { assign: (context: Partial<BookFrameStateContext>) => void },
}) {
    const bookAttributes = props.event.bookAttributes;
    const readProgress = props.event.readProgress ?? props.context.readProgress;

    props.enqueue.assign({
        bookAttributes,
        readProgress,
        chapterUrl: bookAttributes.spine[readProgress.chapter].url,
    });
}