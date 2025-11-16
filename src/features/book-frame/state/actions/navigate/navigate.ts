import type {
    BookFrameStateContext,
    BookFrameStateEvents,
    NavigateEvent,
} from '../../types';

export function navigateAction(props: {
    event: NavigateEvent,
    context: BookFrameStateContext,
    enqueue: {
        assign: (context: Partial<BookFrameStateContext>) => void,
        raise: (context: BookFrameStateEvents) => void,
    },
}) {
    const book = props.context.book;
    
    if (!book) {
        return;
    }
    
    const contextUpdate: Partial<BookFrameStateContext> = {};
    const nextChapter = book.spine.findIndex(item => item === props.event.chapter);

    contextUpdate.readProgress = {
        page: 0,
        chapter: nextChapter,
    };
    contextUpdate.chapterUrl = book.spine[nextChapter].url;
    contextUpdate.prevChapter = undefined;
    contextUpdate.scrollPosition = 0;

    if (props.context.deferredRevokeChapterUrl) {
        URL.revokeObjectURL(props.context.deferredRevokeChapterUrl);
        contextUpdate.deferredRevokeChapterUrl = undefined;
    }

    props.enqueue.assign(contextUpdate);
    props.enqueue.raise({
        type: 'SAVE_READ_PROGRESS',
        progress: contextUpdate.readProgress,
    });
}