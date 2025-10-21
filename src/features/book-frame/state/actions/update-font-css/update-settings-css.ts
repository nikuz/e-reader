import { FONT_CSS_ID } from '../../../constants';
import type { BookFrameStateContext, UpdateFontCSSEvent } from '../../types';

export function updateFontCSSAction(props: {
    event: UpdateFontCSSEvent,
    context: BookFrameStateContext,
    enqueue: { assign: (context: Partial<BookFrameStateContext>) => void },
}) {
    const iframeEl = props.context.iframeEl;
    const iframeDocument = iframeEl?.contentDocument;
    const fontCSSNode = iframeDocument?.getElementById(FONT_CSS_ID);

    if (fontCSSNode) {
        const injectedCSS = props.event.fontCSS;
        fontCSSNode.textContent = injectedCSS;
    }
}