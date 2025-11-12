import { settingsStateMachineActor } from 'src/features/settings/state';
import { deserializeTextSelection } from 'src/features/book-frame/utils';
import type { BookFrameStateContext } from '../../types';

export function restoreHighlightsAction(props: {
    context: BookFrameStateContext,
    enqueue: {
        assign: (context: Partial<BookFrameStateContext>) => void,
    },
}) {
    const book = props.context.book;
    const readProgress = props.context.readProgress;
    const iframeEl = props.context.iframeEl;
    const iframeWindow = iframeEl?.contentWindow;
    const iframeDocument = iframeEl?.contentDocument;
    const chapterHighlights = book?.highlights[readProgress.chapter];

    if (!book || !iframeWindow || !iframeDocument || !chapterHighlights) {
        return;
    }

    const chapterHighlightsClone = [...chapterHighlights];
    const settingsSnapshot = settingsStateMachineActor.getSnapshot().context;
    const cssHighlight = new Highlight();

    for (let i = 0, l = chapterHighlightsClone.length; i < l; i++) {
        const highlight = chapterHighlightsClone[i];
        const range = deserializeTextSelection(highlight, iframeDocument);
        chapterHighlightsClone[i] = {
            ...highlight,
            range,
        };
        if (range) {
            cssHighlight.add(range);
        }
    }
    iframeWindow.CSS?.highlights.set(settingsSnapshot.highlight.selectedHighlightType, cssHighlight);

    const highlightsClone = [...book.highlights];
    highlightsClone[readProgress.chapter] = chapterHighlightsClone;
    
    const bookClone = book.clone();
    bookClone.highlights = highlightsClone;

    props.enqueue.assign({
        book: bookClone,
    });
}