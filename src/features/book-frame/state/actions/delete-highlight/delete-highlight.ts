import { settingsStateMachineActor } from 'src/features/settings/state';
import { libraryStateMachineActor } from 'src/features/library/state';
import { generateChapterHighlightsCss, getInjectedCSS } from '../../../utils';
import {
    HIGHLIGHTS_CSS_ID,
    INJECTED_CSS_PLACEHOLDER,
    FONT_CSS_PLACEHOLDER,
    HIGHLIGHTS_CSS_PLACEHOLDER,
} from '../../../constants';
import type { BookFrameStateContext, DeleteHighlightAction } from '../../types';

export function deleteHighlightAction(props: {
    event: DeleteHighlightAction,
    context: BookFrameStateContext,
    enqueue: {
        assign: (context: Partial<BookFrameStateContext>) => void,
    },
}) {
    const book = props.context.book;
    const readProgress = props.context.readProgress;
    const deletedHighlight = props.event.highlight;
    const iframeEl = props.context.iframeEl;
    const iframeWindow = iframeEl?.contentWindow;
    const iframeDocument = iframeEl?.contentDocument;
    const textSelection = props.context.textSelection;
    const selectionRange = textSelection?.getRangeAt(0);

    if (!book || !iframeDocument || !iframeWindow || !textSelection || !selectionRange) {
        return;
    }

    const contextUpdate: Partial<BookFrameStateContext> = {
        textSelection: undefined,
        textSelectionCreateEndTime: undefined,
        selectedHighlight: undefined,
    };
    const settingsSnapshot = settingsStateMachineActor.getSnapshot().context;
    const highlightsCSSValue = settingsSnapshot.highlightsCSSValue;
    const bookHighlights = [...book.highlights];
    const chapterHighlights = [...(bookHighlights[readProgress.chapter] ?? [])];
    const highlightIndex = chapterHighlights.findIndex(item => item.id === deletedHighlight.id);
    
    if (highlightIndex !== -1) {
        chapterHighlights.splice(highlightIndex, 1);
    }
    bookHighlights[readProgress.chapter] = chapterHighlights;

    iframeWindow.CSS?.highlights.delete(deletedHighlight.id);
    textSelection?.removeAllRanges();

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
        
        const blob = new Blob([modifiedContent], { type: 'text/html' });
        spineClone[readProgress.chapter] = {
            ...chapter,
            url: URL.createObjectURL(blob),
        };
        contextUpdate.deferredRevokeChapterUrl = chapter.url;
        bookClone.spine = spineClone;
    }

    bookClone.highlights = bookHighlights;
    contextUpdate.book = bookClone;

    props.enqueue.assign(contextUpdate);

    libraryStateMachineActor.send({
        type: 'UPDATE_BOOK_HIGHLIGHTS',
        book: bookClone,
    });
}