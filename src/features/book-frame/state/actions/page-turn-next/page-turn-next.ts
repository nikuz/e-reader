import type { BookFrameStateContext, BookFrameStateEvents } from '../../types';

export function pageTurnNextAction(props: {
    context: BookFrameStateContext,
    enqueue: {
        assign: (context: Partial<BookFrameStateContext>) => void,
        raise: (context: BookFrameStateEvents) => void,
    },
}) {
    const iframeEl = props.context.iframeEl;
    const window = iframeEl?.contentWindow;
    const bookAttributes = props.context.bookAttributes;
    
    if (!window || !bookAttributes) {
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
        window.scrollTo({ left: nextScrollPosition });
        contextUpdate.readProgress = {
            ...readProgress,
            page: nextPage,
        };
        contextUpdate.scrollPosition = nextScrollPosition;
    }
    // change the chapter
    else {
        const nextChapter = Math.min(readProgress.chapter + 1, bookAttributes.spine.length - 1);

        contextUpdate.readProgress = {
            page: 0,
            chapter: nextChapter,
        };
        contextUpdate.chapterUrl = bookAttributes.spine[nextChapter].url;
        contextUpdate.prevChapter = readProgress.chapter;
        contextUpdate.scrollPosition = 0;
    }

    props.enqueue.assign(contextUpdate);
    props.enqueue.raise({
        type: 'SAVE_READ_PROGRESS',
        progress: contextUpdate.readProgress,
    });
}