import type { BookFrameStateContext, BookFrameStateEvents } from '../../types';

export function pageTurnNextAction(props: {
    context: BookFrameStateContext,
    enqueue: {
        assign: (context: Partial<BookFrameStateContext>) => void,
        raise: (context: BookFrameStateEvents) => void,
    },
}) {
    const iframeEl = props.context.iframeEl;
    const iframeWindow = iframeEl?.contentWindow;
    const book = props.context.book;
    
    if (!iframeWindow || !book) {
        return;
    }
    
    const contextUpdate: Partial<BookFrameStateContext> = {};
    const readProgress = props.context.readProgress;
    const screenRect = props.context.screenRect;
    const chapterRect = props.context.chapterRect;
    const pagesAmount = Math.round(chapterRect.width / screenRect.width);
    const scrollStep = Math.ceil(chapterRect.width / pagesAmount);
    const nextPage = readProgress.page + 1;
    const nextScrollPosition = scrollStep * nextPage;

    // scroll within the chapter
    if (nextScrollPosition < chapterRect.width) {
        iframeWindow.scrollTo({ left: nextScrollPosition });
        contextUpdate.readProgress = {
            ...readProgress,
            page: nextPage,
        };
        contextUpdate.scrollPosition = nextScrollPosition;
    }
    // change the chapter
    else {
        const nextChapter = Math.min(readProgress.chapter + 1, book.spine.length - 1);

        contextUpdate.readProgress = {
            page: 0,
            chapter: nextChapter,
        };
        contextUpdate.chapterUrl = book.spine[nextChapter].url;
        contextUpdate.prevChapter = readProgress.chapter;
        contextUpdate.scrollPosition = 0;

        if (props.context.deferredRevokeChapterUrl) {
            URL.revokeObjectURL(props.context.deferredRevokeChapterUrl);
            contextUpdate.deferredRevokeChapterUrl = undefined;
        }
    }

    props.enqueue.assign(contextUpdate);
    props.enqueue.raise({
        type: 'SAVE_READ_PROGRESS',
        progress: contextUpdate.readProgress,
    });
}