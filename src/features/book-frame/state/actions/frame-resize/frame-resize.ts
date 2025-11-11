import type {
    BookFrameStateContext,
    BookFrameStateEvents,
    FrameBodyResizeEvent,
} from '../../types';

export function frameResizeAction(props: {
    event: FrameBodyResizeEvent,
    context: BookFrameStateContext,
    enqueue: {
        assign: (context: Partial<BookFrameStateContext>) => void,
        raise: (context: BookFrameStateEvents) => void,
    },
}) {
    const iframeEl = props.context.iframeEl;
    const iframeWindow = iframeEl?.contentWindow;
    const iframeBodyEl = iframeEl?.contentDocument?.body;
    const screenRect = props.context.screenRect;
    const chapterRect = props.context.chapterRect;
    const newChapterRect = props.event.rect;

    if (!iframeWindow || !iframeBodyEl) {
        return;
    }

    const newScreenRect = {
        width: iframeWindow.innerWidth,
        height: iframeWindow.innerHeight,
    };
    const readProgress = props.context.readProgress;
    const chapterHadBeenInteracted = props.context.chapterHadBeenInteracted;
    const chapterScrolledToEnd = props.context.chapterScrolledToEnd;
    const contextUpdate: Partial<BookFrameStateContext> = {
        screenRect: newScreenRect,
        chapterRect: newChapterRect,
    };
    const scrollPosition = props.context.scrollPosition;
    let newScrollPosition = scrollPosition;

    if (!chapterHadBeenInteracted && chapterScrolledToEnd) {
        newScrollPosition = iframeBodyEl.scrollWidth - iframeWindow.innerWidth;
    } else {
        const scrollPositionPercent = scrollPosition / ((chapterRect.width - screenRect.width) / 100);
        const pagesAmount = Math.max(Math.round(newChapterRect.width / newScreenRect.width) - 1, 0);
        if (pagesAmount === 0) {
            newScrollPosition = 0;
        } else {
            newScrollPosition = Math.round(pagesAmount / 100 * scrollPositionPercent) * newScreenRect.width;
        }
    }

    // always set newScrollPosition without comparing it to previous value
    // because browser might not set the scrollPosition properly during page load and reflow caused by fonts loading
    iframeWindow.scrollTo({ left: newScrollPosition });
    contextUpdate.scrollPosition = newScrollPosition;
    contextUpdate.readProgress = {
        ...readProgress,
        page: Math.round(newScrollPosition / iframeWindow.innerWidth),
    };
    props.enqueue.raise({
        type: 'SAVE_READ_PROGRESS',
        progress: contextUpdate.readProgress,
    });

    props.enqueue.assign(contextUpdate);
}
