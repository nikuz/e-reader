import { settingsStateMachineActor } from 'src/features/settings/state';
import { setChapterHighlights } from '../../../utils';
import { HIGHLIGHTS_CSS_ID } from '../../../constants';
import type { BookFrameStateContext, UpdateHighlightsCSSEvent } from '../../types';

export function updateHighlightsCSSAction(props: {
    event: UpdateHighlightsCSSEvent,
    context: BookFrameStateContext,
    enqueue: { assign: (context: Partial<BookFrameStateContext>) => void },
}) {
    const book = props.context.book;
    const iframeEl = props.context.iframeEl;
    const iframeWindow = iframeEl?.contentWindow;
    const iframeDocument = iframeEl?.contentDocument;
    const highlightsCSSNode = iframeDocument?.getElementById(HIGHLIGHTS_CSS_ID);

    if (!book || !highlightsCSSNode) {
        return;
    }
    
    highlightsCSSNode.textContent = props.event.highlightsCSS;

    const bookHighlights = book.highlights;
    const readProgress = props.context.readProgress;
    const chapterHighlights = bookHighlights[readProgress.chapter];

    if (chapterHighlights && iframeWindow) {
        const settingsSnapshot = settingsStateMachineActor.getSnapshot().context;
        setChapterHighlights({
            iframeWindow,
            chapterHighlights,
            selectedHighlightType: settingsSnapshot.highlight.selectedHighlightType,
        });
    }
}