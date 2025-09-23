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

    const settings = props.context.settings;

    window.scrollTo({
        left: window.innerWidth * settings.page,
    });
}