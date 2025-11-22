import type { BookFrameStateContext } from '../../types';

export function suspendBookViewAction(props: {
    context: BookFrameStateContext,
    enqueue: { assign: (context: Partial<BookFrameStateContext>) => void },
}) {
    if (!props.context.book) {
        return;
    }

    const contextUpdate: Partial<BookFrameStateContext> = {
        chapterUrl: undefined,
        prevChapter: undefined,
        chapterRect: {
            width: 0,
            height: 0,
        },
        chapterHadBeenInteracted: false,
    };

    if (props.context.deferredRevokeChapterUrl) {
        URL.revokeObjectURL(props.context.deferredRevokeChapterUrl);
        contextUpdate.deferredRevokeChapterUrl = undefined;
    }

    props.enqueue.assign(contextUpdate);
}