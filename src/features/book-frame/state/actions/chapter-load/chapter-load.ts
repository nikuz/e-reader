import type { BookFrameStateContext, ChapterLoadEvent } from '../../types';

export function chapterLoadAction(props: {
    event: ChapterLoadEvent,
    context: BookFrameStateContext,
    enqueue: { assign: (context: Partial<BookFrameStateContext>) => void },
}) {
    const iframeEl = props.event.iframeEl;
    const settings = props.context.settings;
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

    if (prevChapter !== undefined && settings.chapter < prevChapter && window && bodyEl) {
        const newScrollPosition = bodyEl.scrollWidth - window.innerWidth;

        window.scrollTo({ left: newScrollPosition });

        contextUpdate.settings = {
            ...settings,
            page: Math.round(newScrollPosition / window.innerWidth),
        };
        contextUpdate.scrollPosition = newScrollPosition;
    }

    props.enqueue.assign(contextUpdate);
}