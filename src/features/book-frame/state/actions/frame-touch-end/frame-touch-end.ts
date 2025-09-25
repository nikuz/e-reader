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
    const iframeEl = props.context.iframeEl;
    const frameInteractionStartTime = props.context.frameInteractionStartTime;
    const contentWindow = iframeEl?.contentWindow;
    const iframeDocument = iframeEl?.contentDocument;

    if (!iframeEl || !contentWindow || !iframeDocument || frameInteractionStartTime === undefined) {
        return;
    }

    const textSelection = props.context.textSelection;
    
    if (!textSelection?.toString().length) {
        const position = props.event.position;
        const bodyRect = iframeDocument.body.getBoundingClientRect();
        const x = position.x - contentWindow.scrollX;

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
            statusBarStateMachineActor.send({ type: 'TOGGLE' });
        }
    }

    props.enqueue.assign({
        frameInteractionStartTime: undefined,
        frameInteractionStartPosition: undefined,
    });
}