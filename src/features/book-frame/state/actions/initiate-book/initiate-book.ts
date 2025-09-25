import type { BookFrameStateContext, BookLoadSuccessEvent } from '../../types';

export function initiateBookAction(props: {
    event: BookLoadSuccessEvent,
    context: BookFrameStateContext,
    enqueue: { assign: (context: Partial<BookFrameStateContext>) => void },
}) {
    const book = props.event.book;
    const initialChapter = 0;
    const key = Array.from(book.spine.keys())[initialChapter];

    props.enqueue.assign({
        book,
        settings: {
            ...props.context.settings,
            chapter: initialChapter,
        },
        chapterContent: book.spine.get(key),
    });
}