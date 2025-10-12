import type { BookFrameStateContext } from '../../types';

export function frameResizeAction(props: {
    context: BookFrameStateContext,
    enqueue: { assign: (context: Partial<BookFrameStateContext>) => void },
}) {
    const iframeEl = props.context.iframeEl;
    const window = iframeEl?.contentWindow;
    const bodyEl = iframeEl?.contentDocument?.body;

    if (!window || !bodyEl) {
        return;
    }

    const readProgress = props.context.readProgress;
    const newScrollPosition = window.innerWidth * readProgress.page;

    window.scrollTo({ left: newScrollPosition });

    props.enqueue.assign({
        screenRect: {
            width: window.innerWidth,
            height: window.innerHeight,
        },
        chapterRect: {
            width: bodyEl.scrollWidth,
            height: window.innerHeight,
        },
        scrollPosition: newScrollPosition,
    });
}