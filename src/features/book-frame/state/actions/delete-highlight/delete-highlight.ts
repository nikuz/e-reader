import { settingsStateMachineActor } from 'src/features/settings/state';
import { libraryStateMachineActor } from 'src/features/library/state';
import { setChapterHighlights } from '../../../utils';
import type { BookFrameStateContext, DeleteHighlightEvent } from '../../types';

export function deleteHighlightAction(props: {
    event: DeleteHighlightEvent,
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
    const bookHighlights = [...book.highlights];
    const chapterHighlights = [...(bookHighlights[readProgress.chapter] ?? [])];
    const highlightIndex = chapterHighlights.findIndex(item => item.id === deletedHighlight.id);
    const settingsSnapshot = settingsStateMachineActor.getSnapshot().context;
    
    if (highlightIndex !== -1) {
        chapterHighlights.splice(highlightIndex, 1);
    }
    bookHighlights[readProgress.chapter] = chapterHighlights;

    setChapterHighlights({
        iframeWindow,
        chapterHighlights,
        selectedHighlightType: settingsSnapshot.highlight.selectedHighlightType,
    });
    
    textSelection?.removeAllRanges();

    const bookClone = book.clone();
    bookClone.highlights = bookHighlights;
    contextUpdate.book = bookClone;

    props.enqueue.assign(contextUpdate);

    libraryStateMachineActor.send({
        type: 'UPDATE_BOOK_HIGHLIGHTS',
        book: bookClone,
    });
}