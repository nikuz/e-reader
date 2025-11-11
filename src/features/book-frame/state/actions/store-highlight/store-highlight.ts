import { settingsStateMachineActor } from 'src/features/settings/state';
import { libraryStateMachineActor } from 'src/features/library/state';
import type { BookHighlight } from 'src/types';
import {
    getXpathForNode,
    generateChapterHighlightsCss,
    getInjectedCSS,
    extractContextFromTextSelection,
} from '../../../utils';
import {
    HIGHLIGHTS_CSS_ID,
    HIGHLIGHTS_SELECTOR_PREFIX,
    INJECTED_CSS_PLACEHOLDER,
    FONT_CSS_PLACEHOLDER,
    HIGHLIGHTS_CSS_PLACEHOLDER,
} from '../../../constants';
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
    const highlightsCSSValue = settingsSnapshot.highlightsCSSValue;
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

    iframeWindow.CSS?.highlights.set(newHighlight.id, new Highlight(selectionRange));

    const bookClone = book.clone();
    const highlightCSS = generateChapterHighlightsCss(chapterHighlights, highlightsCSSValue);
    const settingsCSS = settingsSnapshot.settingsCSS;
    const fontCSS = settingsSnapshot.fontCSS;
    
    const highlightsCSSNode = iframeDocument?.getElementById(HIGHLIGHTS_CSS_ID);
    if (highlightsCSSNode) {
        highlightsCSSNode.textContent = highlightCSS;
    }
    
    const spineClone = [...book.spine];
    const chapter = spineClone[readProgress.chapter];
    if (chapter.content) {
        const modifiedContent = chapter.content
            .replace(INJECTED_CSS_PLACEHOLDER, getInjectedCSS(settingsCSS))
            .replace(FONT_CSS_PLACEHOLDER, fontCSS)
            .replace(HIGHLIGHTS_CSS_PLACEHOLDER, highlightCSS);
        
        const blob = new Blob([modifiedContent], { type: 'application/xhtml+xml' });
        spineClone[readProgress.chapter] = {
            ...chapter,
            url: URL.createObjectURL(blob),
        };
        contextUpdate.deferredRevokeChapterUrl = chapter.url;
        bookClone.spine = spineClone;
    }

    bookClone.highlights = bookHighlights;
    contextUpdate.book = bookClone;
    contextUpdate.selectedHighlight = newHighlight;

    props.enqueue.assign(contextUpdate);

    libraryStateMachineActor.send({
        type: 'UPDATE_BOOK_HIGHLIGHTS',
        book: bookClone,
    });
}