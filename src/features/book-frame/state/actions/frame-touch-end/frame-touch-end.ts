import { statusBarStateMachineActor } from 'src/features/status-bar/state';
import { findHighlightByCoordinates } from '../../../utils';
import type {
    BookFrameStateContext,
    BookFrameStateEvents,
    FrameTouchEndEvent,
} from '../../types';

export function frameTouchEndAction(props: {
    event: FrameTouchEndEvent,
    context: BookFrameStateContext,
    enqueue: {
        assign: (context: Partial<BookFrameStateContext>) => void,
        raise: (context: BookFrameStateEvents) => void,
    },
}) {
    const book = props.context.book;
    const iframeEl = props.context.iframeEl;
    const iframeWindow = iframeEl?.contentWindow;
    const iframeDocument = iframeEl?.contentDocument;
    const contextUpdate: Partial<BookFrameStateContext> = {
        frameTouchStartTime: undefined,
        frameTouchMoveTime: undefined,
        frameInteractionStartPosition: undefined,
    };
    
    if (!book || !iframeEl || !iframeWindow || !iframeDocument) {
        props.enqueue.assign(contextUpdate);
        return;
    }
    
    const readProgress = props.context.readProgress;
    const textSelection = props.context.textSelection;
    const hasSelectedText = textSelection?.toString().length;
    const frameTouchStartTime = props.context.frameTouchStartTime;
    const frameTouchMoveTime = props.context.frameTouchMoveTime;
    const textSelectionCreateEndTime = props.context.textSelectionCreateEndTime;
    const frameInteractionStartPosition = props.context.frameInteractionStartPosition;
    const chapterHighlights = book?.highlights[readProgress.chapter];
    let selectedHighlight = false;

    // find existing highlight by mouse click position
    if (frameInteractionStartPosition && chapterHighlights) {
        const highlight = findHighlightByCoordinates({
            coordinates: frameInteractionStartPosition,
            iframeWindow,
            iframeDocument,
            chapterHighlights,
        });
        const selection = iframeDocument.getSelection();
        if (highlight && highlight.range && selection) {
            selectedHighlight = true;
            selection.removeAllRanges();
            selection.addRange(highlight.range);
            contextUpdate.textSelection = selection;
            contextUpdate.textSelectionCreateEndTime = Date.now();
            contextUpdate.selectedHighlight = highlight;
        }
    }
    
    // user previously selected some text and now just clicks outside of the text selection
    if (
        !selectedHighlight
        && hasSelectedText
        && textSelectionCreateEndTime
        && (
            (frameTouchStartTime && frameTouchStartTime > textSelectionCreateEndTime)
            || (frameTouchMoveTime && frameTouchMoveTime > textSelectionCreateEndTime)
        )
    ) {
        // remove old highlight
        textSelection?.removeAllRanges();
        contextUpdate.textSelection = undefined;
        contextUpdate.textSelectionCreateEndTime = undefined;
    }
    
    const menuPanelsVisible = props.context.menuPanelsVisible;
    
    if (!frameTouchMoveTime && !hasSelectedText && !selectedHighlight) {
        if (menuPanelsVisible) {
            contextUpdate.menuPanelsVisible = false;
            statusBarStateMachineActor.send({ type: 'TOGGLE' });
        } else {
            const position = props.event.position;
            const bodyRect = iframeDocument.body.getBoundingClientRect();
            const x = position.x - iframeWindow.scrollX;

            // left side touch
            if (x < bodyRect.width / 100 * 30) {
                props.enqueue.raise(({ type: 'PAGE_TURN_PREV' }));
            }
            // right side touch
            else if (x > bodyRect.width / 100 * 70) {
                props.enqueue.raise(({ type: 'PAGE_TURN_NEXT' }));
            }
            // middle screen touch
            else {
                contextUpdate.menuPanelsVisible = true;
                statusBarStateMachineActor.send({ type: 'TOGGLE' });
            }
        }
    }

    props.enqueue.assign(contextUpdate);
}