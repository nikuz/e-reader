import type { BookFrameStateContext, ChapterLoadEvent } from '../../types';

export function chapterLoadAction(props: {
    event: ChapterLoadEvent,
    context: BookFrameStateContext,
    enqueue: { assign: (context: Partial<BookFrameStateContext>) => void },
}) {
    const iframeEl = props.event.iframeEl;
    const settings = props.context.settings;
    const prevChapter = props.context.prevChapter;

    const contextUpdate: Partial<BookFrameStateContext> = {
        iframeEl,
    };

    if (prevChapter !== undefined && settings.chapter < prevChapter) {
        const window = iframeEl.contentWindow;
        const bodyEl = iframeEl?.contentDocument?.body;
        
        if (window && bodyEl) {
            window.scrollTo({ left: bodyEl.scrollWidth });

            contextUpdate.settings = {
                ...settings,
                page: Math.round(bodyEl.scrollWidth / window.innerWidth) - 1,
            };
        }
    }

    props.enqueue.assign(contextUpdate);
}