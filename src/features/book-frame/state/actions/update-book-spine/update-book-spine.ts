import type { BookFrameStateContext, UpdateBookAttributesEvent } from '../../types';

export function updateBookSpineAction(props: {
    event: UpdateBookAttributesEvent,
    context: BookFrameStateContext,
    enqueue: { assign: (context: Partial<BookFrameStateContext>) => void },
}) {
    const book = props.context.book;
    const newSpine = props.event.spine;

    if (!book) {
        return;
    }

    const bookClone = book.clone();
    bookClone.spine = newSpine;

    props.enqueue.assign({
        book: bookClone,
        deferredRevokeChapterUrl: props.context.chapterUrl,
    });
}