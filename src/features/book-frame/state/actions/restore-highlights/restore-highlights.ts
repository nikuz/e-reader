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
    const contentDocument = iframeEl?.contentDocument;
    const chapterHighlights = book?.highlights[readProgress.chapter];

    if (!book || !iframeWindow || !contentDocument || !chapterHighlights) {
        return;
    }

    const chapterHighlightsClone = [...chapterHighlights];

    for (let i = 0, l = chapterHighlightsClone.length; i < l; i++) {
        const highlight = chapterHighlightsClone[i];
        const range = deserializeTextSelection(highlight, contentDocument);
        chapterHighlightsClone[i] = {
            ...highlight,
            range,
        };
        if (range) {
            iframeWindow.CSS?.highlights.set(highlight.id, new Highlight(range));
        }
    }

    const highlightsClone = [...book.highlights];
    highlightsClone[readProgress.chapter] = chapterHighlightsClone;
    
    const bookClone = book.clone();
    bookClone.highlights = highlightsClone;

    props.enqueue.assign({
        book: bookClone,
    });
}