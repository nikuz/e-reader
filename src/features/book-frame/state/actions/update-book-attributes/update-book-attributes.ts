import type { BookFrameStateContext, UpdateBookAttributesEvent } from '../../types';

export function updateBookAttributesAction(props: {
    event: UpdateBookAttributesEvent,
    context: BookFrameStateContext,
    enqueue: { assign: (context: Partial<BookFrameStateContext>) => void },
}) {
    const bookAttributes = props.event.bookAttributes;
    const readProgress = props.context.readProgress;

    props.enqueue.assign({
        bookAttributes,
        chapterUrl: bookAttributes.spine[readProgress.chapter].url,
    });
}