import type { BookFrameStateContext } from '../../types';

export function resumeBookViewAction(props: {
    context: BookFrameStateContext,
    enqueue: { assign: (context: Partial<BookFrameStateContext>) => void },
}) {
    const book = props.context.book;
    const readProgress = props.context.readProgress;

    if (!book || !readProgress) {
        return;
    }

    props.enqueue.assign({
        chapterUrl: book.spine[readProgress.chapter].url,
    });
}