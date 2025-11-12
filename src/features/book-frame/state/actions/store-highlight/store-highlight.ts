import { settingsStateMachineActor } from 'src/features/settings/state';
import { libraryStateMachineActor } from 'src/features/library/state';
import type { BookHighlight } from 'src/types';
import {
    getXpathForNode,
    extractContextFromTextSelection,
    setChapterHighlights,
} from '../../../utils';
import { HIGHLIGHTS_SELECTOR_PREFIX } from '../../../constants';
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

    if (!book || !iframeDocument || !iframeWindow || !textSelection || !selectionRange) {
        return;
    }

    const contextUpdate: Partial<BookFrameStateContext> = {};
    const settingsSnapshot = settingsStateMachineActor.getSnapshot().context;
    const bookHighlights = [...book.highlights];
    const chapterHighlights = [...(bookHighlights[readProgress.chapter] ?? [])];
    const newHighlight: BookHighlight = {
        id: `${HIGHLIGHTS_SELECTOR_PREFIX}_${Date.now()}`,
        startXPath: getXpathForNode(selectionRange.startContainer, iframeDocument),
        startOffset: selectionRange.startOffset,
        endXPath: getXpathForNode(selectionRange.endContainer, iframeDocument),
        endOffset: selectionRange.endOffset,
        text: textSelection.toString(),
        context: extractContextFromTextSelection(iframeDocument, selectionRange),
        range: selectionRange,
    };
    chapterHighlights.push(newHighlight);
    bookHighlights[readProgress.chapter] = chapterHighlights;

    setChapterHighlights({
        iframeWindow,
        chapterHighlights,
        selectedHighlightType: settingsSnapshot.highlight.selectedHighlightType,
    });

    const bookClone = book.clone();
    bookClone.highlights = bookHighlights;
    contextUpdate.book = bookClone;
    contextUpdate.selectedHighlight = newHighlight;

    props.enqueue.assign(contextUpdate);

    libraryStateMachineActor.send({
        type: 'UPDATE_BOOK_HIGHLIGHTS',
        book: bookClone,
    });
}