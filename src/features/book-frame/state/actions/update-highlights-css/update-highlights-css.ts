import { generateChapterHighlightsCss } from '../../../utils';
import { HIGHLIGHTS_CSS_ID } from '../../../constants';
import type { BookFrameStateContext, UpdateHighlightsCSSEvent } from '../../types';

export function updateHighlightsCSSAction(props: {
    event: UpdateHighlightsCSSEvent,
    context: BookFrameStateContext,
    enqueue: { assign: (context: Partial<BookFrameStateContext>) => void },
}) {
    const bookAttributes = props.context.bookAttributes;
    const readProgress = props.context.readProgress;
    const iframeEl = props.context.iframeEl;
    const iframeDocument = iframeEl?.contentDocument;
    const highlightsCSSNode = iframeDocument?.getElementById(HIGHLIGHTS_CSS_ID);

    if (!bookAttributes || !highlightsCSSNode) {
        return;
    }
    
    highlightsCSSNode.textContent = generateChapterHighlightsCss(
        bookAttributes.highlights[readProgress.chapter],
        props.event.highlightsCSSValue
    );
}