import type { BookFrameStateContext, UpdateBookAttributesEvent } from '../../types';

export function updateBookAttributesAction(props: {
    event: UpdateBookAttributesEvent,
    context: BookFrameStateContext,
    enqueue: { assign: (context: Partial<BookFrameStateContext>) => void },
}) {
    const bookAttributes = props.event.bookAttributes;

    props.enqueue.assign({
        bookAttributes,
        deferredRevokeChapterUrl: props.context.chapterUrl,
    });
}