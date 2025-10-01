import type { BookFrameStateContext, BookLoadSuccessEvent } from '../../types';

export function initiateBookAction(props: {
    event: BookLoadSuccessEvent,
    context: BookFrameStateContext,
    enqueue: { assign: (context: Partial<BookFrameStateContext>) => void },
}) {
    const bookAttributes = props.event.bookAttributes;
    const initialChapter = 0;
    const key = Object.keys(bookAttributes.spine)[initialChapter];

    props.enqueue.assign({
        bookAttributes,
        settings: {
            ...props.context.settings,
            chapter: initialChapter,
        },
        chapterContent: bookAttributes.spine[key],
    });
}