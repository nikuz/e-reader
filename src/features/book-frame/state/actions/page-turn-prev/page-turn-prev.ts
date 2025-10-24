import type { BookFrameStateContext, BookFrameStateEvents } from '../../types';

export function pageTurnPrevAction(props: {
    context: BookFrameStateContext,
    enqueue: {
        assign: (context: Partial<BookFrameStateContext>) => void,
        raise: (context: BookFrameStateEvents) => void,
    },
}) {
    const iframeEl = props.context.iframeEl;
    const iframeWindow = iframeEl?.contentWindow;
    const bookAttributes = props.context.bookAttributes;

    if (!iframeWindow || !bookAttributes) {
        return;
    }

    const contextUpdate: Partial<BookFrameStateContext> = {};
    const readProgress = props.context.readProgress;
    const screenRect = props.context.screenRect;
    const chapterRect = props.context.chapterRect;
    const pagesAmount = Math.round(chapterRect.width / screenRect.width);
    const scrollStep = Math.ceil(chapterRect.width / pagesAmount);
    const prevPage = readProgress.page - 1;
    const prevScrollPosition = scrollStep * prevPage;
    
    // scroll within the chapter
    if (prevScrollPosition >= 0) {
        iframeWindow.scrollTo({ left: prevScrollPosition });
        contextUpdate.readProgress = {
            ...readProgress,
            page: prevPage,
        };
        contextUpdate.scrollPosition = prevScrollPosition;
    }
    // change the chapter
    else {
        const prevChapter = Math.max(readProgress.chapter - 1, 0);

        contextUpdate.readProgress = {
            ...props.context.readProgress,
            chapter: prevChapter,
        };
        contextUpdate.chapterUrl = bookAttributes.spine[prevChapter].url;
        contextUpdate.prevChapter = readProgress.chapter;
        
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