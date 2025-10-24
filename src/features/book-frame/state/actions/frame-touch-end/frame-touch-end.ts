import { statusBarStateMachineActor } from 'src/features/status-bar/state';
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
    const contextUpdate: Partial<BookFrameStateContext> = {
        frameTouchStartTime: undefined,
        frameTouchMoveTime: undefined,
        frameInteractionStartPosition: undefined,
    };
    const textSelection = props.context.textSelection;
    const hasSelectedText = props.context.textSelection?.toString().length;
    const frameTouchStartTime = props.context.frameTouchStartTime;
    const frameTouchMoveTime = props.context.frameTouchMoveTime;
    const textSelectionCreateEndtimeTime = props.context.textSelectionCreateEndtimeTime;

    if (
        hasSelectedText
        && textSelectionCreateEndtimeTime
        && (
            (frameTouchStartTime && frameTouchStartTime > textSelectionCreateEndtimeTime)
            || (frameTouchMoveTime && frameTouchMoveTime > textSelectionCreateEndtimeTime)
        )
    ) {
        // remove old highlight
        textSelection?.removeAllRanges();
        contextUpdate.textSelection = undefined;
        contextUpdate.textSelectionCreateEndtimeTime = undefined;
    } else if (hasSelectedText) {
        // store new highlight
        props.enqueue.raise({ type: 'STORE_HIGHLIGHT' });
    }
    
    const iframeEl = props.context.iframeEl;
    const iframeWindow = iframeEl?.contentWindow;
    const iframeDocument = iframeEl?.contentDocument;

    if (!iframeEl || !iframeWindow || !iframeDocument || frameTouchMoveTime) {
        props.enqueue.assign(contextUpdate);
        return;
    }

    const menuPanelsVisible = props.context.menuPanelsVisible;
    
    if (menuPanelsVisible) {
        contextUpdate.menuPanelsVisible = false;
        statusBarStateMachineActor.send({ type: 'TOGGLE' });
    } else if (!hasSelectedText) {
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

    props.enqueue.assign(contextUpdate);
}