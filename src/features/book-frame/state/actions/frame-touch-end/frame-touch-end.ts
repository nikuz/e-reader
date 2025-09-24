import { statusBarStateMachineActor } from 'src/features/status-bar/state';
import { PAGE_TURN_TOUCH_DELAY } from '../../../constants';
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

    const selection = iframeDocument.getSelection();
    const position = props.event.position;

    if (performance.now() - frameInteractionStartTime < PAGE_TURN_TOUCH_DELAY) {
        if (selection?.toString().length) {
            selection?.removeAllRanges();
        } else {
            const bodyRect = iframeDocument.body.getBoundingClientRect();
            const x = position.x - contentWindow.scrollX;

            // left side touch
            if (x < bodyRect.width / 100 * 30) {
                props.enqueue.raise(({ type: 'PAGE_TURN_PREV' }));
            }
            // right side touch
            else if (x > bodyRect.width / 100 * 70) {
                props.enqueue.raise(({ type: 'PAGE_TURN_NEXT' }));
            } else {
                statusBarStateMachineActor.send({ type: 'TOGGLE' });
            }
        }
    } else {
        props.enqueue.raise(({
            type: 'SELECT_TEXT',
            position,
        }));
    }

    props.enqueue.assign({
        frameInteractionStartTime: undefined,
        frameInteractionStartPosition: undefined,
    });
}