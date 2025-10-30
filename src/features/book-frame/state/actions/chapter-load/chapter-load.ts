import type {
    BookFrameStateContext,
    BookFrameStateEvents,
    ChapterLoadEvent,
} from '../../types';

export function chapterLoadAction(props: {
    event: ChapterLoadEvent,
    context: BookFrameStateContext,
    enqueue: {
        assign: (context: Partial<BookFrameStateContext>) => void,
        raise: (context: BookFrameStateEvents) => void,
    },
}) {
    const iframeEl = props.event.iframeEl;
    const readProgress = props.context.readProgress;
    const prevChapter = props.context.prevChapter;
    const iframeWindow = iframeEl?.contentWindow;
    const iframeBodyEl = iframeEl?.contentDocument?.body;

    if (!iframeWindow || !iframeBodyEl) {
        return;
    }

    const contextUpdate: Partial<BookFrameStateContext> = {
        iframeEl,
        scrollPosition: 0,
        chapterHadBeenInteracted: false,
        chapterScrolledToEnd: false,
        screenRect: {
            width: iframeWindow.innerWidth,
            height: iframeWindow.innerHeight,
        },
        chapterRect: {
            width: iframeBodyEl.scrollWidth,
            height: iframeWindow.innerHeight,
        },
    };

    const lastChapterPageScrollPosition = iframeBodyEl.scrollWidth - iframeWindow.innerWidth;
    if (prevChapter !== undefined && readProgress.chapter < prevChapter) {
        const newScrollPosition = lastChapterPageScrollPosition;

        iframeWindow.scrollTo({ left: newScrollPosition });

        contextUpdate.readProgress = {
            ...readProgress,
            page: Math.round(newScrollPosition / iframeWindow.innerWidth),
        };
        contextUpdate.scrollPosition = newScrollPosition;
        contextUpdate.chapterScrolledToEnd = true;
        props.enqueue.raise({
            type: 'SAVE_READ_PROGRESS',
            progress: contextUpdate.readProgress,
        });
    } else if (readProgress.page > 0 && iframeWindow && iframeBodyEl) {
        const newScrollPosition = iframeWindow.innerWidth * readProgress.page;
        contextUpdate.scrollPosition = newScrollPosition;
        contextUpdate.chapterScrolledToEnd = newScrollPosition >= lastChapterPageScrollPosition;
        iframeWindow.scrollTo({ left: newScrollPosition });
    }

    props.enqueue.assign(contextUpdate);
    props.enqueue.raise({ type: 'RESTORE_HIGHLIGHTS' });
}