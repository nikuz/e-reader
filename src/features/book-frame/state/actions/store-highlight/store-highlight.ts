import { settingsStateMachineActor } from 'src/features/settings/state';
import { libraryStateMachineActor } from 'src/features/library/state';
import type { BookHighlight } from 'src/types';
import { getXpathForNode, generateChapterHighlightsCss } from '../../../utils';
import { HIGHLIGHTS_CSS_ID, HIGHLIGHTS_SELECTOR_PREFIX } from '../../../constants';
import type { BookFrameStateContext } from '../../types';

export function storeHighlightAction(props: {
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
    const textSelection = props.context.textSelection;
    const selectionRange = textSelection?.getRangeAt(0);

    if (!book || !iframeDocument || !iframeWindow || !selectionRange) {
        return;
    }

    const settingsSnapshot = settingsStateMachineActor.getSnapshot().context;
    const highlightsCSSValue = settingsSnapshot.highlightsCSSValue;
    const bookHighlights = [...book.highlights];
    const newHighlight: BookHighlight = {
        id: `${HIGHLIGHTS_SELECTOR_PREFIX}${Date.now()}`,
        startXPath: getXpathForNode(selectionRange.startContainer, iframeDocument),
        startOffset: selectionRange.startOffset,
        endXPath: getXpathForNode(selectionRange.endContainer, iframeDocument),
        endOffset: selectionRange.endOffset,
    };
    const chapterHighlights = [...(bookHighlights[readProgress.chapter] ?? [])];
    chapterHighlights.push(newHighlight);
    bookHighlights[readProgress.chapter] = chapterHighlights;

    const highlightsCSSNode = iframeDocument?.getElementById(HIGHLIGHTS_CSS_ID);
    if (highlightsCSSNode) {
        highlightsCSSNode.textContent = generateChapterHighlightsCss(chapterHighlights, highlightsCSSValue);
    }

    iframeWindow.CSS?.highlights.set(newHighlight.id, new Highlight(selectionRange));

    const bookClone = book.clone();
    bookClone.highlights = bookHighlights;

    props.enqueue.assign({
        book: bookClone,
    });

    libraryStateMachineActor.send({
        type: 'UPDATE_BOOK_HIGHLIGHTS',
        book: bookClone,
    });
}