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
    const window = iframeEl?.contentWindow;
    const bodyEl = iframeEl?.contentDocument?.body;

    const contextUpdate: Partial<BookFrameStateContext> = {
        iframeEl,
        scrollPosition: 0,
    };

    if (window && bodyEl) {
        contextUpdate.screenRect = {
            width: window.innerWidth,
            height: window.innerHeight,
        };
        contextUpdate.chapterRect = {
            width: bodyEl.scrollWidth,
            height: window.innerHeight,
        };
    }

    if (prevChapter !== undefined && readProgress.chapter < prevChapter && window && bodyEl) {
        const newScrollPosition = bodyEl.scrollWidth - window.innerWidth;

        window.scrollTo({ left: newScrollPosition });

        contextUpdate.readProgress = {
            ...readProgress,
            page: Math.round(newScrollPosition / window.innerWidth),
        };
        contextUpdate.scrollPosition = newScrollPosition;
        props.enqueue.raise({
            type: 'SAVE_READ_PROGRESS',
            progress: contextUpdate.readProgress,
        });
    } else if (readProgress.page > 0 && window && bodyEl) {
        window.scrollTo({
            left: window.innerWidth * readProgress.page,
        });
    }

    props.enqueue.assign(contextUpdate);
    props.enqueue.raise({ type: 'RESTORE_HIGHLIGHTS' });
}